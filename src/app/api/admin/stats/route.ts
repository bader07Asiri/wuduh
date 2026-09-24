import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { PLANS } from "@/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await verifyAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();

  const [
    { count: totalUsers },
    { data: planBreakdown },
    { count: totalProjects },
    { count: totalDeliverables },
    { count: totalOrgs },
    { data: recentUsers },
    { data: activeSubscribers },
  ] = await Promise.all([
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase.from("user_profiles").select("subscription_plan, subscription_status"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("deliverables").select("*", { count: "exact", head: true }),
    supabase.from("organizations").select("*", { count: "exact", head: true }),
    supabase.from("user_profiles")
      .select("full_name, email, subscription_plan, subscription_status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("user_profiles")
      .select("subscription_plan")
      .eq("subscription_status", "active")
      .neq("subscription_plan", "free"),
  ]);

  const PLAN_PRICES: Record<string, number> = {
    starter: PLANS.starter.price_monthly,
    professional: PLANS.professional.price_monthly,
    enterprise: PLANS.enterprise.price_monthly,
  };

  const planCounts: Record<string, number> = { free: 0, starter: 0, professional: 0, enterprise: 0 };
  (planBreakdown ?? []).forEach((u: { subscription_plan: string }) => {
    if (u.subscription_plan in planCounts) {
      planCounts[u.subscription_plan]++;
    }
  });

  const estimatedMRR = (activeSubscribers ?? []).reduce((sum: number, u: { subscription_plan: string }) => {
    return sum + (PLAN_PRICES[u.subscription_plan] ?? 0);
  }, 0);

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalProjects: totalProjects ?? 0,
    totalDeliverables: totalDeliverables ?? 0,
    totalOrgs: totalOrgs ?? 0,
    planCounts,
    estimatedMRR,
    recentUsers: recentUsers ?? [],
  });
}
