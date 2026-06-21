import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "Bader.s.alasiri@gmail.com";

async function verifyAdmin(userId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("email")
    .eq("clerk_id", userId)
    .single();
  return data?.email === ADMIN_EMAIL;
}

// GET /api/admin/users?search=&page=&limit=
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await verifyAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("user_profiles")
    .select("id, clerk_id, email, full_name, subscription_plan, subscription_status, is_admin, created_at, onboarding_completed", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data ?? [], total: count ?? 0, page, limit });
}

// PATCH /api/admin/users  { clerk_id, subscription_plan?, subscription_status?, is_admin? }
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await verifyAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { clerk_id, subscription_plan, subscription_status, is_admin } = body;

  if (!clerk_id) return NextResponse.json({ error: "clerk_id required" }, { status: 400 });

  const supabase = createAdminClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  const validPlans = ["free", "starter", "professional", "enterprise"];
  const validStatuses = ["active", "cancelled", "past_due", "trialing"];

  if (subscription_plan !== undefined) {
    if (!validPlans.includes(subscription_plan))
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    updates.subscription_plan = subscription_plan;
  }

  if (subscription_status !== undefined) {
    if (!validStatuses.includes(subscription_status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    updates.subscription_status = subscription_status;
  }

  if (is_admin !== undefined) {
    updates.is_admin = Boolean(is_admin);
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("clerk_id", clerk_id)
    .select("id, clerk_id, email, full_name, subscription_plan, subscription_status, is_admin")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user: data });
}
