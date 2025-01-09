import OpenAI from "openai";

export function defaultOpenAi() {
  const openai = new OpenAI({
    apiKey: process.env.CLOUDFLARE_API_KEY,
    baseURL: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
  });
  return openai;
}
