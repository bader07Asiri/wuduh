import type { SupabaseClient } from "@supabase/supabase-js";

// Anthropic prices per 1M tokens (USD). Falls back to Haiku pricing.
const PRICES: Record<string, { in: number; out: number }> = {
  "claude-haiku-4-5-20251001": { in: 1, out: 5 },
  "claude-haiku-4-5":          { in: 1, out: 5 },
  "claude-sonnet-4-5":         { in: 3, out: 15 },
};

export function tokenCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const p = PRICES[model] ?? { in: 1, out: 5 };
  return (inputTokens / 1e6) * p.in + (outputTokens / 1e6) * p.out;
}

// Records one AI call's real token usage + cost into ai_logs.
export async function logAiUsage(
  supabase: SupabaseClient,
  ctx: { userId: string; projectId?: string | null; promptType?: string; model: string },
  usage: { inputTokens: number; outputTokens: number }
): Promise<void> {
  const cost = tokenCostUsd(ctx.model, usage.inputTokens, usage.outputTokens);
  await supabase.from("ai_logs").insert({
    user_id: ctx.userId,
    project_id: ctx.projectId ?? null,
    prompt_type: ctx.promptType ?? null,
    model: ctx.model,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
    tokens_used: usage.inputTokens + usage.outputTokens,
    cost_usd: Number(cost.toFixed(6)),
    success: true,
  });
}
