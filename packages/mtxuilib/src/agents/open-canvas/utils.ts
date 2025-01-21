import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import type { ArtifactV3 } from "mtmaiapi";
import { getModelConfig } from "../../agentutils/agentutils";

export const formatArtifacts = (
  messages: ArtifactV3[],
  truncate?: boolean,
): string =>
  messages
    .map((artifact) => {
      const content = truncate
        ? `${artifact.contents.slice(0, 500)}${artifact.contents.length > 500 ? "..." : ""}`
        : artifact.contents;
      return `Title: ${artifact.title}\nID: ${artifact.id}\nContent: ${content}`;
    })
    .join("\n\n");

export async function getModelFromConfig(
  config: LangGraphRunnableConfig,
  extra?: {
    temperature?: number;
    maxTokens?: number;
  },
) {
  const { temperature = 0.5, maxTokens } = extra || {};
  const { modelName, modelProvider, azureConfig, apiKey } =
    getModelConfig(config);
  return await initChatModel(modelName, {
    modelProvider,
    temperature,
    maxTokens,
    ...(apiKey ? { apiKey } : {}),
    ...(azureConfig != null
      ? {
          azureOpenAIApiKey: azureConfig.azureOpenAIApiKey,
          azureOpenAIApiInstanceName: azureConfig.azureOpenAIApiInstanceName,
          azureOpenAIApiDeploymentName:
            azureConfig.azureOpenAIApiDeploymentName,
          azureOpenAIApiVersion: azureConfig.azureOpenAIApiVersion,
          azureOpenAIBasePath: azureConfig.azureOpenAIBasePath,
        }
      : {}),
  });
}
