import { ChatOpenAI } from "@langchain/openai";

import { createOpenAI } from "@ai-sdk/openai";
export const DEFAULT_MAX_TOKENS = 8192;
export const MAX_RESPONSE_SEGMENTS = 2;

export const llm_configs = {
  llms: [
    {
      id: "chat",
      name: "chat",
      provider: "together_ai",
      base_url: "https://api.together.xyz/v1",
      api_key:
        "29cead0a87a33dff3d5f5d377adb962fcf5d0661770d3994fc6d0e95c70c5139",
      is_tool_use: true,
      model: "together_ai/meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      llm_type: "llama3.1",
      // # base_url: "http://localhost:3400/api/llm_proxy"
      // # base_url: "https://3400-niutrans-classicalmoder-9fbkp8wozlh.ws-us116.gitpod.io/api/llm_proxy"
    },
  ],
};

export const getLlmOpenaiClient = (name?: string) => {
  const _configName = name || "chat";
  const llm_config = llm_configs.llms.find((llm) => llm.id === _configName);
  if (!llm_config) {
    throw new Error(`Llm config not found: ${name}`);
  }

  const { base_url, api_key } = llm_config;
  const openAiClient = createOpenAI({
    baseURL: base_url,
    apiKey: api_key,
  });
  // const model = "meta-llama/Llama-3-8b-chat-hf";

  let modelName = llm_config.model;
  //处理 model 的前缀名
  const all_llm_providers_prefix = ["together_ai/", "groq/"];
  if (all_llm_providers_prefix.some((prefix) => modelName.startsWith(prefix))) {
    modelName = modelName.slice(modelName.indexOf("/") + 1);
  }
  const openaiModel = openAiClient(modelName);
  return openaiModel;
};

const defaultModel = "llama3-groq-70b-8192-tool-use-preview";

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

export function getLlm() {
  //1: 通过后端获取 llm 配置
  try {
    //   TODO:
  } catch (e) {
    console.error("get llm config from api error", e);
  }

  //2: 后端获取失败, 使用环境变量
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_API_BASE;
  const modelName = process.env.OPENAI_MODEL;
  return new ChatOpenAI(
    {
      temperature: 0.1,
      apiKey,
      model: modelName,
    },
    {
      baseURL: baseURL,
      fetch: customeLlmFetch,
    },
  );
}
const customeLlmFetch = async (url: RequestInfo, options: RequestInit) => {
  // console.log("customeLlmFetch", url, options);
  const response = await fetch(url, options);
  // console.log(
  //   `customeLlmFetch response: ${response.status}, content-length: ${response.headers.get(
  //     "content-length",
  //   )}, content-type: ${await response.headers.get("content-type")}`,
  // );
  return response;
};
