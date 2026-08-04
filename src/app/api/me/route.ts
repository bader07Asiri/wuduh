import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Returns the signed-in user's real subscription plan/status from Supabase.
// Used by the settings page so it never shows a hardcoded plan.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("subscription_plan, subscription_status")
    .eq("clerk_id", userId)
    .maybeSingle();

  return NextResponse.json({
    plan: data?.subscription_plan ?? "free",
    status: data?.subscription_status ?? "active",
  });
}
