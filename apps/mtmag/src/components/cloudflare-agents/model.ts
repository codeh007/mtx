// export const model = openai("gpt-4o");
import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { openai } from "@ai-sdk/openai";
// import { createWorkersAI } from "workers-ai-provider";
import type { Env } from "./env";

export const getDefaultModel = (env: Env) => {
  // const aa= createWorkersAI("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {});
  // const modelClient = createWorkersAI({ binding: env.AI });
  // const model = modelClient("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {});
  console.log(`getDefaultModel ${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
  const googleModelClient = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  const model = googleModelClient("gemini-2.0-flash-exp", {});

  return model;
};
