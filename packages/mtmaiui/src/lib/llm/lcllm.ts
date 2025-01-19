import { ChatOpenAI } from "@langchain/openai";

export const getDefaultLcModel = () => {
  const model = new ChatOpenAI({ model: "gpt-4" });
  return model;
};
