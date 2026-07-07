import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import type { WebhookEvent } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify Clerk webhook signature (svix protocol) using Node crypto
function verifyWebhookSignature(
  body: string,
  headers: {
    "svix-id": string;
    "svix-timestamp": string;
    "svix-signature": string;
  },
  secret: string
): boolean {
  try {
    // Clerk webhook secret format: "whsec_<base64>"
    const secretBytes = Buffer.from(
      secret.startsWith("whsec_") ? secret.slice(6) : secret,
      "base64"
    );

    const toSign = `${headers["svix-id"]}.${headers["svix-timestamp"]}.${body}`;
    const hmac = createHmac("sha256", secretBytes).update(toSign).digest("base64");

    // Svix may send multiple signatures (space-separated "v1,<sig>")
    const signatures = headers["svix-signature"]
      .split(" ")
      .map((s) => s.replace(/^v\d+,/, ""));

    return signatures.some((sig) => {
      try {
        return timingSafeEqual(Buffer.from(hmac), Buffer.from(sig));
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[clerk-webhook] CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await req.text();

  const svixId = req.headers.get("svix-id") ?? "";
  const svixTimestamp = req.headers.get("svix-timestamp") ?? "";
  const svixSignature = req.headers.get("svix-signature") ?? "";

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Reject stale webhooks (> 5 minutes old)
  const timestampMs = Number(svixTimestamp) * 1000;
  if (Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
    return NextResponse.json({ error: "Webhook timestamp too old" }, { status: 400 });
  }

  const valid = verifyWebhookSignature(
    body,
    { "svix-id": svixId, "svix-timestamp": svixTimestamp, "svix-signature": svixSignature },
    webhookSecret
  );

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(body) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, data } = event;

  // user.created — create profile row
  if (type === "user.created") {
    const user = data as {
      id: string;
      email_addresses?: { email_address: string; id: string }[];
      first_name?: string | null;
      last_name?: string | null;
      primary_email_address_id?: string | null;
    };

    const primaryEmail =
      user.email_addresses?.find((e) => e.id === user.primary_email_address_id)
        ?.email_address ??
      user.email_addresses?.[0]?.email_address ??
      null;

    const fullName =
      [user.first_name, user.last_name].filter(Boolean).join(" ") || null;

    const { error } = await supabase.from("user_profiles").upsert(
      {
        clerk_id: user.id,
        email: primaryEmail,
        full_name: fullName,
        subscription_plan: "free",
        subscription_status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_id", ignoreDuplicates: true }
    );

    if (error) {
      console.error("[clerk-webhook] user.created upsert failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[clerk-webhook] user.created → profile created for ${user.id}`);
  }

  // user.updated — sync name and email
  if (type === "user.updated") {
    const user = data as {
      id: string;
      email_addresses?: { email_address: string; id: string }[];
      first_name?: string | null;
      last_name?: string | null;
      primary_email_address_id?: string | null;
    };

    const primaryEmail =
      user.email_addresses?.find((e) => e.id === user.primary_email_address_id)
        ?.email_address ??
      user.email_addresses?.[0]?.email_address ??
      null;

    const fullName =
      [user.first_name, user.last_name].filter(Boolean).join(" ") || null;

    const { error } = await supabase
      .from("user_profiles")
      .update({
        email: primaryEmail,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_id", user.id);

    if (error) {
      console.error("[clerk-webhook] user.updated failed:", error.message);
    } else {
      console.log(`[clerk-webhook] user.updated → synced profile for ${user.id}`);
    }
  }

  // user.deleted — optional: mark inactive or delete
  if (type === "user.deleted") {
    const user = data as { id?: string; deleted?: boolean };
    if (user.id) {
      await supabase
        .from("user_profiles")
        .update({ subscription_status: "canceled", updated_at: new Date().toISOString() })
        .eq("clerk_id", user.id);
      console.log(`[clerk-webhook] user.deleted → deactivated profile for ${user.id}`);
    }
  }

  return NextResponse.json({ received: true });
}
