export const MtmaiuiConfig = {
  default_open_ai_key: "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",
  default_open_base_url: "https://integrate.api.nvidia.com/v1",
  default_open_model: "nvidia/llama-3.3-nemotron-super-49b-v1",

  apiEndpoint: "https://mtmag.yuepa8.com",
  // gomtmApiEndpoint: "http://localhost:8383",
};

export const getAppConfig = () => {
  return {
    ...MtmaiuiConfig,
    gomtmApiEndpoint:
      process.env?.GOMTM_API_ENDPOINT || process.env?.VERCEL_URL || "http://localhost:8383",
  };
};
