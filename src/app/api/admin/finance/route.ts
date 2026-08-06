import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { PLANS } from "@/types";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const USD_TO_SAR = 3.75;

const PLAN_PRICE: Record<string, number> = {
  starter: PLANS.starter.price_monthly,
  professional: PLANS.professional.price_monthly,
  enterprise: PLANS.enterprise.price_monthly,
};

type LogRow = { user_id: string; cost_usd: number | null; tokens_used: number | null; created_at: string };
type UserRow = { clerk_id: string; email: string | null; full_name: string | null; subscription_plan: string; subscription_status: string };

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data: me } = await supabase.from("user_profiles").select("email").eq("clerk_id", userId).single();
  if (!me?.email || me.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: logsData }, { data: usersData }] = await Promise.all([
    supabase.from("ai_logs").select("user_id, cost_usd, tokens_used, created_at"),
    supabase.from("user_profiles").select("clerk_id, email, full_name, subscription_plan, subscription_status"),
  ]);
  const logs = (logsData ?? []) as LogRow[];
  const users = (usersData ?? []) as UserRow[];

  // ── Token costs (USD → SAR) ──
  const tokenCostTotalUsd = logs.reduce((s, l) => s + Number(l.cost_usd ?? 0), 0);
  const tokenCostMonthUsd = logs
    .filter((l) => new Date(l.created_at) >= startOfMonth)
    .reduce((s, l) => s + Number(l.cost_usd ?? 0), 0);
  const tokensTotal = logs.reduce((s, l) => s + Number(l.tokens_used ?? 0), 0);
  const tokenCostMonthSar = tokenCostMonthUsd * USD_TO_SAR;

  // ── Revenue (active paid subscriptions, monthly, SAR) ──
  const revenueMonthly = users.reduce((s, u) => {
    return u.subscription_status === "active" && u.subscription_plan in PLAN_PRICE
      ? s + PLAN_PRICE[u.subscription_plan]
      : s;
  }, 0);

  // ── Income allocation (defaults) ──
  const tokenBudget = tokenCostMonthSar * 2; // cover actual token spend + buffer
  const afterToken = Math.max(0, revenueMonthly - tokenBudget);
  const emergency = afterToken * 0.20;
  const reserve = afterToken * 0.15;
  const profit = afterToken - emergency - reserve;

  // ── Per-user: revenue taken vs token consumed ──
  const costByUser: Record<string, number> = {};
  logs.forEach((l) => { costByUser[l.user_id] = (costByUser[l.user_id] ?? 0) + Number(l.cost_usd ?? 0); });

  const perUser = users
    .map((u) => {
      const revenue = u.subscription_status === "active" && u.subscription_plan in PLAN_PRICE ? PLAN_PRICE[u.subscription_plan] : 0;
      const cost = Number(((costByUser[u.clerk_id] ?? 0) * USD_TO_SAR).toFixed(2));
      return { email: u.email, name: u.full_name, plan: u.subscription_plan, revenue, cost, net: Number((revenue - cost).toFixed(2)) };
    })
    .filter((u) => u.revenue > 0 || u.cost > 0)
    .sort((a, b) => b.net - a.net);

  const n = (x: number) => Number(x.toFixed(2));
  return NextResponse.json({
    currency: "SAR",
    revenueMonthly: n(revenueMonthly),
    tokenCostMonthly: n(tokenCostMonthSar),
    tokenCostTotal: n(tokenCostTotalUsd * USD_TO_SAR),
    tokensTotal,
    netMonthly: n(revenueMonthly - tokenCostMonthSar),
    allocation: { tokenBudget: n(tokenBudget), emergency: n(emergency), reserve: n(reserve), profit: n(profit) },
    perUser,
  });
}
