// ============================
// وضوح | Wuduh — AI Usage Guard
// يتحقق من حدود الاستخدام قبل كل طلب للذكاء الصناعي
// ============================

import { createClient as createAdminSupabase } from "@supabase/supabase-js";

const MONTHLY_AI_LIMITS: Record<string, number> = {
  free:         5,    // 5 مخرجات/شهر
  starter:      30,   // 30 مخرجة/شهر
  professional: 150,  // 150 مخرجة/شهر
  enterprise:   -1,   // غير محدود
};

interface UsageCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  plan: string;
  error?: string;
}

export async function checkAIUsage(userId: string): Promise<UsageCheckResult> {
  const supabase = createAdminSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // جلب خطة المستخدم
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("subscription_plan, subscription_status")
    .eq("clerk_id", userId)
    .single();

  const plan = profile?.subscription_plan ?? "free";
  const limit = MONTHLY_AI_LIMITS[plan] ?? 5;

  // غير محدود للـ enterprise
  if (limit === -1) {
    return { allowed: true, used: 0, limit: -1, plan };
  }

  // حساب الاستخدام هذا الشهر
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("deliverables")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  const used = count ?? 0;

  if (used >= limit) {
    return {
      allowed: false,
      used,
      limit,
      plan,
      error: `وصلت للحد الشهري (${used}/${limit} مخرجة). يرجى ترقية خطتك للمتابعة.`,
    };
  }

  return { allowed: true, used, limit, plan };
}
