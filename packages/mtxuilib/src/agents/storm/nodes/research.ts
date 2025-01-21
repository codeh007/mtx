import { getModelFromConfig } from "../../../agentutils/agentutils";
import type { MtmRunnableConfig } from "../../../agentutils/runableconfig";
import { searchSearxng } from "../../../agentutils/searxng";
import type { StormGraphAnnotation } from "../state";
export const researchNode = async (
  state: typeof StormGraphAnnotation.State,
  config: MtmRunnableConfig,
) => {
  const searxngUrl = config.configurable?.mtmaiConfig.searxng;
  console.log("开始调用搜索", searxngUrl);

  const searchResults = await searchSearxng(searxngUrl, "hello", {
    categories: ["general"],
  });
  console.log("searchResults", searchResults);

  console.log("开始初始化大纲");
  const outline = await initOutline(state, config);
  return {
    next: "__end__",
    searchResults: [searchResults],
    outline: outline.outline,
  };
};

// 先依靠模型自身写一个初始大纲
const initOutline = async (
  state: typeof StormGraphAnnotation.State,
  config: MtmRunnableConfig,
) => {
  const topic = state.topic;
  const systemPrompt = `You are a Wikipedia writer. Write an outline for a Wikipedia page about a user-provided topic. Be comprehensive and specific.`;

  if (!topic) {
    return {
      error: "topic is required",
    };
  }
  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: topic,
    },
  ];

  const model = await getModelFromConfig(config, {
    temperature: 0,
  });
  const aiResponse = await model.invoke(messages);

  // Outline
  // const loadedData = JSON.parse(config.mtmaiContext.repairJson(aiResponse.content));
  const outline = JSON.parse(aiResponse.content.toString());

  return {
    outline,
  };
};
