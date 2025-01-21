import type { createClient } from "@hey-api/client-fetch";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
export interface MtmRunnableConfig extends LangGraphRunnableConfig {
  ctx: GraphContext;
  backendUrl: string;
  mtmclient: ReturnType<typeof createClient>;
}

// export interface LangGraphRunnableConfig2<
//   ConfigurableType extends Record<string, any> = Record<string, any>,
// > extends RunnableConfig<ConfigurableType> {
//   store?: BaseStore;
//   writer?: (chunk: unknown) => void;
// }
