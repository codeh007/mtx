import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import type { StormGraphAnnotation } from "../state";
export const researchNode = async (
  state: typeof StormGraphAnnotation.State,
  config: LangGraphRunnableConfig,
) => {
  return {
    next: "todo node",
  };
};
