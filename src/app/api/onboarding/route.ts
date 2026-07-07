import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { OnboardingData } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: OnboardingData & { clerk_id: string } = await req.json();

  const { error } = await supabase.from("user_profiles").upsert({
    clerk_id: userId,
    user_type: body.user_type,
    industry: body.industry,
    company_name: body.company_name,
    team_size: body.team_size,
    onboarding_completed: true,
    subscription_plan: "free",
    subscription_status: "active",
    updated_at: new Date().toISOString(),
  }, { onConflict: "clerk_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
