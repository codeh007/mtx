import type { MtmRunnableConfig } from "../../../agentutils/runableconfig";
import type { StormGraphAnnotation } from "../state";
export const researchNode = async (
  state: typeof StormGraphAnnotation.State,
  config: MtmRunnableConfig,
) => {
  // const mtmaiConfig = await mtmaiWorkerConfig({ client: config.mtmclient });
  // console.log("mtmaiConfig", mtmaiConfig.data);
  const searxngUrl = config.mtmaiConfig?.searxng;
  console.log("searxngUrl", searxngUrl);
  return {
    next: "todo node",
  };
};
