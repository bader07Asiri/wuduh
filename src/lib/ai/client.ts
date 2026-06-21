import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface AIGenerateOptions {
  system: string;
  user: string;
  maxTokens?: number;
  model?: string;
}

export async function generateWithClaude(options: AIGenerateOptions): Promise<object> {
  const { system, user, maxTokens = 8000, model = "claude-sonnet-4-6" } = options;

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });

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
    model: "claude-sonnet-4-6",
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
