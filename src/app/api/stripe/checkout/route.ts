import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_IDS, createCheckoutSession, createCustomer } from "@/lib/stripe";
import type { PlanName } from "@/lib/stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan }: { plan: PlanName } = await req.json();

  if (!PRICE_IDS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Get or create user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    customerId = await createCustomer(
      profile?.email ?? "",
      profile?.full_name ?? ""
    );
    await supabase
      .from("user_profiles")
      .update({ stripe_customer_id: customerId })
      .eq("clerk_id", userId);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = await createCheckoutSession(
    customerId,
    PRICE_IDS[plan],
    userId,
    `${baseUrl}/settings?success=1`,
    `${baseUrl}/settings?cancelled=1`
  );

  return NextResponse.json({ url });
}
