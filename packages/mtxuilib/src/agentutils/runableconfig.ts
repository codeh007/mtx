import type { createClient } from "@hey-api/client-fetch";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import type { mtmaiWorkerConfig } from "mtmaiapi";
export interface MtmRunnableConfig extends LangGraphRunnableConfig {
  ctx: GraphContext;
  backendUrl?: string;
  mtmclient?: ReturnType<typeof createClient>;
  mtmaiConfig?: Awaited<ReturnType<typeof mtmaiWorkerConfig>>["data"];
}
