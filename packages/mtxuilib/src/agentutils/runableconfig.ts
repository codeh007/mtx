import type { createClient } from "@hey-api/client-fetch";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
export interface MtmRunnableConfig extends LangGraphRunnableConfig {
  ctx: GraphContext;
  backendUrl?: string;
  mtmclient?: ReturnType<typeof createClient>;
}
