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
  return {
    next: "todo node",
    searchResults: [searchResults],
  };
};
