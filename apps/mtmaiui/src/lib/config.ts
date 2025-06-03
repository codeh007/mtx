export const mtmaiAppInitState = {
  default_open_ai_key: "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",
  default_open_base_url: "https://integrate.api.nvidia.com/v1",
  default_open_model: "nvidia/llama-3.3-nemotron-super-49b-v1",
};

export const getAppConfig = () => {
  return {
    ...mtmaiAppInitState,
    mtmServerUrl:
      process.env?.MTM_SERVER_URL ||
      // `https://${process.env?.VERCEL_URL}` ||
      "https://www.yuepa8.com",
  };
};
