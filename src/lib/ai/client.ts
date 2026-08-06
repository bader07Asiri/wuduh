import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface AIGenerateOptions {
  system: string;
  user: string;
  maxTokens?: number;
  model?: string;
  // Called with real token usage from the Anthropic response (for cost tracking).
  onUsage?: (u: { inputTokens: number; outputTokens: number; model: string }) => void | Promise<void>;
}

export async function generateWithClaude(options: AIGenerateOptions): Promise<object> {
  const { system, user, maxTokens = 8000, model = "claude-sonnet-4-5" } = options;

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });

  // Record actual token usage (tokens are billed even if the response was truncated).
  try {
    await options.onUsage?.({
      inputTokens: response.usage?.input_tokens ?? 0,
      outputTokens: response.usage?.output_tokens ?? 0,
      model,
    });
  } catch { /* logging must never break generation */ }

  if (response.stop_reason === "max_tokens") {
    throw new Error(
      "الاستجابة تجاوزت الحد الأقصى للطول ولم تكتمل — أعد المحاولة أو قلّل حجم المشروع"
    );
  }

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response (Claude sometimes wraps in ```json)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) throw new Error("لم يتمكن الذكاء الاصطناعي من توليد استجابة صحيحة");

  try {
    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  } catch {
    throw new Error("خطأ في تحليل استجابة الذكاء الاصطناعي");
  }
}

export async function streamWithClaude(
  options: AIGenerateOptions,
  onChunk: (text: string) => void
): Promise<object> {
  const { system, user, maxTokens = 8000 } = options;

  let fullText = "";

  const stream = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      fullText += event.delta.text;
      onChunk(event.delta.text);
    }
  }

  const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/) || fullText.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) throw new Error("لم يتمكن الذكاء الاصطناعي من توليد استجابة صحيحة");

  return JSON.parse(jsonMatch[1] || jsonMatch[0]);
}
