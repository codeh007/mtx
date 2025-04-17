// import { openai } from "@ai-sdk/openai";
import { createWorkersAI } from "workers-ai-provider";
// export const model = openai("gpt-4o");

export const getDefaultModel = (env: Env) => {
  // const aa= createWorkersAI("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {});

  const modelClient = createWorkersAI({ binding: env.AI });
  const model = modelClient("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {});
  return model;
};
