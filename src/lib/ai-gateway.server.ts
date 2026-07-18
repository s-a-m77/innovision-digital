import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createAiGatewayProvider(apiKey: string, baseURL: string) {
  return createOpenAICompatible({
    name: "ai-gateway",
    baseURL,
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}
