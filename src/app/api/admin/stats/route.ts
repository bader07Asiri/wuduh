import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "info@nailart.sa";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("email")
    .eq("clerk_id", userId)
    .single();

  if (!profile || profile.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
    starter: 149,
    professional: 399,
    enterprise: 999,
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
