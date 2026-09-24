// ============================
// وضوح | Wuduh — فحص صلاحية الأدمن (موحّد)
// يقبل المستخدم كأدمن إذا:
//   1) إيميل Clerk الأساسي = ADMIN_EMAIL، أو
//   2) العمود is_admin = true في user_profiles، أو
//   3) إيميل الملف الشخصي المخزّن = ADMIN_EMAIL
// بهذا لا تنكسر لوحة الأدمن بسبب تفاوت الإيميل المخزّن أو تغيّر متغيّر البيئة.
// ============================

import { currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").toLowerCase();

export async function verifyAdmin(userId: string): Promise<boolean> {
  // 1) إيميل Clerk الأساسي
  try {
    const user = await currentUser();
    const primaryEmail =
      user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
      user?.emailAddresses[0]?.emailAddress ??
      null;
    if (primaryEmail && ADMIN_EMAIL && primaryEmail.toLowerCase() === ADMIN_EMAIL) {
      return true;
    }
  } catch {
    /* تجاهل — نكمل للفحوصات التالية */
  }

  // 2) + 3) علم is_admin أو إيميل الملف الشخصي
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("email, is_admin")
    .eq("clerk_id", userId)
    .single();

  return (
    data?.is_admin === true ||
    (!!data?.email && !!ADMIN_EMAIL && data.email.toLowerCase() === ADMIN_EMAIL)
  );
}
