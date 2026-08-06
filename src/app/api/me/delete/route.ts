import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// PDPL — data subject right: erase the user's account and all personal data.
// User-initiated on their own account only.
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const supabase = createAdminClient();

  // Remove Supabase data (projects/deliverables also cascade via user_profiles).
  await supabase.from("org_members").delete().eq("user_id", userId);
  await supabase.from("deliverables").delete().eq("user_id", userId);
  await supabase.from("projects").delete().eq("user_id", userId);
  await supabase.from("user_profiles").delete().eq("clerk_id", userId);

  // Remove the authentication account.
  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
  } catch (e) {
    console.error("[me/delete] Clerk user deletion failed:", e);
    return NextResponse.json(
      { ok: false, error: "حُذفت بياناتك، لكن تعذّر حذف حساب الدخول — تواصل معنا لإكماله." },
      { status: 207 }
    );
  }

  return NextResponse.json({ ok: true });
}
