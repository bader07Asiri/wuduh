import Stripe from "stripe";
import type { BillingInterval } from "@/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PRICE_IDS = {
  starter:      process.env.STRIPE_STARTER_PRICE_ID!,
  professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
  enterprise:   process.env.STRIPE_ENTERPRISE_PRICE_ID!,
} as const;

// أسعار سنوية اختيارية: إذا لم يُعرَّف المتغير يبقى undefined ويرفض الـ checkout
// السنوي بخطأ واضح (لا يحوّل للشهري).
export const YEARLY_PRICE_IDS = {
  starter:      process.env.STRIPE_STARTER_YEARLY_PRICE_ID,
  professional: process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID,
  enterprise:   process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
} as const;

export type PlanName = keyof typeof PRICE_IDS;
export type { BillingInterval };

export function isPlanName(v: unknown): v is PlanName {
  return v === "starter" || v === "professional" || v === "enterprise";
}

export function isBillingInterval(v: unknown): v is BillingInterval {
  return v === "monthly" || v === "yearly";
}

/** Price ID حسب الباقة والفترة. يرجع undefined إذا لم يُعرَّف المتغير المطلوب. */
export function getPriceId(plan: PlanName, interval: BillingInterval): string | undefined {
  const id = interval === "yearly" ? YEARLY_PRICE_IDS[plan] : PRICE_IDS[plan];
  return id ? id : undefined;
}

/** عكس getPriceId: يعرف الباقة من Price ID شهري أو سنوي. */
export function getPlanFromPriceId(priceId: string): PlanName | "free" {
  for (const plan of ["starter", "professional", "enterprise"] as const) {
    if (PRICE_IDS[plan] && priceId === PRICE_IDS[plan]) return plan;
    if (YEARLY_PRICE_IDS[plan] && priceId === YEARLY_PRICE_IDS[plan]) return plan;
  }
  return "free";
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });

  return session.url!;
}

export async function createCustomer(email: string, name: string): Promise<string> {
  const customer = await stripe.customers.create({ email, name });
  return customer.id;
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}
