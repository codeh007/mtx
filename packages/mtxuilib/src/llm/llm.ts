import { ChatOpenAI } from "@langchain/openai";
// import { OpenAIChatSettings } from "@ai-sdk/openai";
import OpenAI from "openai";
// const defaultModel = "@cf/meta/llama-3.1-8b-instruct";
// const defaultModel = "meta-llama/Meta-Llama-3-70B-Instruct-Turbo";
// const defaultModel = "meta-llama/Meta-Llama-3-8B-Instruct-Turbo";
const defaultModel = "llama3-groq-70b-8192-tool-use-preview";

const openAIList = [
  {
    token: "yfVRxAEf5PzZ-Kp75QPDCFcIOdXpq4eoSf9XPL03",
    baseURL:
      "https://api.cloudflare.com/client/v4/accounts/623faf72ee0d2af3e586e7cd9dadb72b/ai/v1",
  },
  {
    token: "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",
  },
];

const together_tokens = [
  "b499766806f24fc0ba872e7979ec2ad9a91362b39a550449e4bb68108d45861d",
];

function splitOnce(input: string, delimiter: string): [string, string] {
  const delimiterIndex = input.indexOf(delimiter);
  if (delimiterIndex === -1) {
    return [input, ""];
  }
  const part1 = input.substring(0, delimiterIndex);
  const part2 = input.substring(delimiterIndex + delimiter.length);
  return [part1, part2];
}

function getProvider(modelName: string) {
  const [providerName, model] = splitOnce(modelName, "/");
  switch (providerName) {
    case "groq":
      return "groq";
    case "@cf":
      return "cf";
    case "together":
      return "together";
    default:
      return "hf";
  }
}
export function getModelName(modelName: string) {
  const _modelName = modelName || defaultModel;
  if (_modelName === "default") return defaultModel;
  const [providerName, model] = splitOnce(_modelName, "/");
  switch (providerName) {
    case "groq":
      return model;
    case "@cf":
      return modelName;
    case "together":
      return model;
    default:
      return modelName;
  }
}

export function getApiKeyByModelName(modelName: string) {
  const _modelName = modelName || defaultModel;
  const provider = getProvider(_modelName);
  switch (provider) {
    case "cf":
      return openAIList[0].token;
    // case "groq": {
    // 	const token = getRandomItem(groq_tokens);
    // 	return token;
    // }
    case "together":
      return together_tokens[0];
    default:
      // huggingface
      return process.env.HUGGINGFACEHUB_API_TOKEN;
  }
}

// export function getOpenaiChat(modelName?: string) {
//   return getOpenAiChatGraq();
// }

export function getOpenAiChatGraq() {
  const apiKey = "gsk_XncA6chwBwxwteYwui6DWGdyb3FYVhssnvzYourlKaZWHkYnTWye";
  const baseURL = "https://api.groq.com/openai/v1";
  return new OpenAI({ apiKey, baseURL });
}
export function getOpenAiChatTogether() {
  const apiKey =
    "a7ac7e09d69fb4d6b761e2f4418f1a9edfd422618affc9cc554857069322fa3b"; //together
  const baseURL = "https://api.together.xyz/v1";
  return new OpenAI({ apiKey, baseURL });
}

export function getDefaultOpenaiClient() {
  const apiKey = "CzEDAeske7RipomNe3KLLtqvu820Ewfp";
  const baseURL = "https://llama3-1-70b.lepton.run/api/v1/";
  const openaiClient = new OpenAI({ apiKey, baseURL });
  return openaiClient;
}
export function getLlm() {
  const apiKey = "CzEDAeske7RipomNe3KLLtqvu820Ewfp";
  const baseURL = "https://llama3-1-70b.lepton.run/api/v1/";

  const modelName = "openai/llama3.1-70b";

  const lcllm = new ChatOpenAI(
    {
      temperature: 0.1,
      apiKey,
      model: modelName,
    },
    {
      baseURL: baseURL,
    },
  );
  return lcllm;
}

export async function chatCompletionStream(stream) {
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.choices[0].delta.finish_reason) {
          controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
          controller.close();
          return;
        }
        if (chunk.choices[0].delta.content === undefined) {
          controller.enqueue("data: [DONE]\n\n");
          controller.close();
          return;
        }
        console.log(chunk.choices[0].delta.content);
        controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    },
  });
}

export async function chatStream(stream) {
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.choices[0].delta.finish_reason) {
          controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
          controller.close();
          return;
        }
        if (chunk.choices[0].delta.content === undefined) {
          controller.enqueue("data: [DONE]\n\n");
          controller.close();
          return;
        }
        console.log(chunk.choices[0].delta.content);
        // controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
        controller.enqueue(`0:"${chunk.choices[0].delta.content}" \n`);
      }
    },
  });
}
