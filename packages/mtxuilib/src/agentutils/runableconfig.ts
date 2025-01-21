import type { createClient } from "@hey-api/client-fetch";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import type { mtmaiWorkerConfig } from "mtmaiapi";

interface MtmConfigurable extends Record<string, any> {
  thread_id?: string;
  ctx?: GraphContext;
  backendUrl?: string;
  mtmclient?: ReturnType<typeof createClient>;
  mtmaiConfig?: Awaited<ReturnType<typeof mtmaiWorkerConfig>>["data"];
}

export interface MtmRunnableConfig
  extends LangGraphRunnableConfig<MtmConfigurable> {
  // ctx: GraphContext;
  // backendUrl?: string;
  // mtmclient?: ReturnType<typeof createClient>;
  // mtmaiConfig?: Awaited<ReturnType<typeof mtmaiWorkerConfig>>["data"];
}
