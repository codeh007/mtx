import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { initChatModel } from "langchain/chat_models/universal";
import { getModelConfig } from "../../agentutils/agentutils";
import type { Artifact } from "../../types/opencanvasTypes";

export const formatArtifacts = (
  messages: Artifact[],
  truncate?: boolean,
): string =>
  messages
    .map((artifact) => {
      const content = truncate
        ? `${artifact.content.slice(0, 500)}${artifact.content.length > 500 ? "..." : ""}`
        : artifact.content;
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
