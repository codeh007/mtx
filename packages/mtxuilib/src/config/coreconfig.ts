export function getCoreEmbedConfig() {
  return {
    searxngApiUrl: "https://searxng.example.com",
    defaultLlmConfig: {
      apiKey: "CzEDAeske7RipomNe3KLLtqvu820Ewfp",
      baseURL: "https://llama3-1-70b.lepton.run/api/v1/",
      modelName: "openai/llama3.1-70b",
    },
  };
}

export const coreConfig = getCoreEmbedConfig();

export type CoreEmbedConfig = ReturnType<typeof getCoreEmbedConfig>;
