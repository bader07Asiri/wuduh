import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

// PDPL — data subject right: erase the user's account and all personal data.
// User-initiated on their own account only.
//
// الترتيب مقصود:
//   1) إلغاء اشتراك Stripe أولًا — إذا فشل نوقف كل شيء (لا نحذف البيانات ويبقى المستخدم يُفوتر).
//   2) تجهيل ai_logs (نحتفظ بالتكلفة والتوكنز للمحاسبة، ونزيل ما يربطها بالشخص).
//   3) حذف بيانات Supabase مع فحص خطأ كل عملية.
//   4) حذف حساب Clerk فقط بعد نجاح كل ما سبق.
// أي فشل ← status 500 برسالة عربية، وحساب الدخول يبقى ليقدر المستخدم يعيد المحاولة.

const ANONYMIZED_USER_ID = "deleted-user";
const ACTIVE_STRIPE_STATUSES = new Set(["active", "trialing", "past_due", "incomplete", "unpaid"]);
const DATA_ERROR = "تعذّر حذف بياناتك بالكامل، ولم يُحذف حسابك. حاول مرة أخرى أو تواصل معنا.";

type DbError = { message?: string; code?: string } | null;

function fail(step: string, error: unknown, message: string) {
  console.error(`[me/delete] ${step} failed:`, error);
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

// جدول اختياري غير منشأ في القاعدة (migration لم تُشغَّل) = لا بيانات فيه للحذف.
function isMissingTable(error: DbError) {
  return error?.code === "42P01" || error?.code === "PGRST205";
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const supabase = createAdminClient();

  // ── 1) إلغاء اشتراكات Stripe الفعّالة ──
  const { data: subs, error: subsError } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id, status")
    .eq("user_id", userId);
  if (subsError) return fail("read subscriptions", subsError, DATA_ERROR);

  for (const sub of (subs ?? []) as { stripe_subscription_id: string | null; status: string | null }[]) {
    const subId = sub.stripe_subscription_id;
    if (!subId) continue;
    if (sub.status && !ACTIVE_STRIPE_STATUSES.has(sub.status)) continue; // ملغى مسبقًا

    try {
      await stripe.subscriptions.cancel(subId);
    } catch (e) {
      // ملغى أو غير موجود في Stripe = لا فوترة قائمة، نكمل. غير ذلك نوقف الحذف.
      let alreadyGone = (e as { code?: string })?.code === "resource_missing";
      if (!alreadyGone) {
        try {
          const current = await stripe.subscriptions.retrieve(subId);
          alreadyGone = current.status === "canceled";
        } catch {
          /* يبقى alreadyGone = false */
        }
      }
      if (!alreadyGone) {
        return fail(
          `cancel Stripe subscription ${subId}`,
          e,
          "تعذّر إلغاء اشتراكك المدفوع، لذلك لم يُحذف حسابك. حاول مرة أخرى أو تواصل معنا."
        );
      }
    }
  }

  // ── 2) تجهيل ai_logs ──
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId);
  if (projectsError) return fail("read projects", projectsError, DATA_ERROR);
  const projectIds = ((projects ?? []) as { id: string }[]).map((p) => p.id);

  // سجلات المستخدم نفسه: نزيل هويته ونص الخطأ ورابط المشروع، ونبقي التكلفة والتوكنز.
  const { error: anonError }: { error: DbError } = await supabase
    .from("ai_logs")
    .update({ user_id: ANONYMIZED_USER_ID, project_id: null, error_message: null })
    .eq("user_id", userId);
  if (anonError) return fail("anonymize ai_logs", anonError, DATA_ERROR);

  // سجلات أعضاء آخرين على مشاريع هذا المستخدم: نفك الربط حتى لا يمنع القيد حذف المشاريع
  // (لازم حتى قبل تشغيل migration ON DELETE SET NULL).
  if (projectIds.length > 0) {
    const { error: unlinkError }: { error: DbError } = await supabase
      .from("ai_logs")
      .update({ project_id: null })
      .in("project_id", projectIds);
    if (unlinkError) return fail("unlink ai_logs from projects", unlinkError, DATA_ERROR);
  }

  // ── 3) حذف بيانات Supabase ──
  // المشاريع والمخرجات والاشتراكات والمؤسسات المملوكة تتتالى أيضًا عبر user_profiles (CASCADE).
  const steps: { step: string; optional?: boolean; run: () => PromiseLike<{ error: DbError }> }[] = [
    { step: "delete project_shares (target)", optional: true,
      run: () => supabase.from("project_shares").delete().eq("target_user_id", userId) },
    { step: "delete org_members", optional: true,
      run: () => supabase.from("org_members").delete().eq("user_id", userId) },
    { step: "delete deliverables", run: () => supabase.from("deliverables").delete().eq("user_id", userId) },
    { step: "delete projects", run: () => supabase.from("projects").delete().eq("user_id", userId) },
    { step: "delete user_profiles", run: () => supabase.from("user_profiles").delete().eq("clerk_id", userId) },
  ];
  for (const { step, optional, run } of steps) {
    const { error } = await run();
    if (error && !(optional && isMissingTable(error))) return fail(step, error, DATA_ERROR);
  }

  // ── 4) حذف حساب الدخول (بعد نجاح كل ما سبق فقط) ──
  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
  } catch (e) {
    return fail(
      "Clerk user deletion",
      e,
      "حُذفت بياناتك، لكن تعذّر حذف حساب الدخول — تواصل معنا لإكماله."
    );
  }

  return NextResponse.json({ ok: true });
}
