import type { LlmConfig } from "mtmaiapi";

export function getLlmConfig(): LlmConfig {
  const defaultLlm: LlmConfig = {
    model: "llama3.1-70b",
    apiKey: "ZGd2VL8B9KxqMB3HIsTaNXmp5iM9ew3c",
    baseUrl: "https://llama3-1-70b.lepton.run/api/v1/",
    metadata: {
      id: "default-llm",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  return defaultLlm;
}
