import type { LangGraphRunnableConfig } from "@langchain/langgraph";

export interface MtmRunnableConfig extends LangGraphRunnableConfig {
	ctx: GraphContext;
}
