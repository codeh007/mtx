import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import type { ArtifactCodeV3, ArtifactMarkdownV3, ArtifactV3 } from "mtmaiapi";
import {
  getFormattedReflections,
  getModelConfig,
  getModelFromConfig,
  optionallyGetSystemPromptFromConfig,
} from "../../../../agentutils/agentutils";
import type {
  OpenCanvasGraphAnnotation,
  OpenCanvasGraphReturnType,
} from "../../state";
import { ARTIFACT_TOOL_SCHEMA } from "./schemas";
import { createArtifactContent, formatNewArtifactPrompt } from "./utils";

/**
 * Generate a new artifact based on the user's query.
 */
export const generateArtifact = async (
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig,
): Promise<OpenCanvasGraphReturnType> => {
  console.log("🎨 进入 generateArtifact");
  const { modelName } = getModelConfig(config);
  const smallModel = await getModelFromConfig(config, {
    temperature: 0.5,
  });

  const modelWithArtifactTool = smallModel.bindTools(
    [
      {
        name: "generate_artifact",
        schema: ARTIFACT_TOOL_SCHEMA,
      },
    ],
    { tool_choice: "generate_artifact" },
  );

  const memoriesAsString = await getFormattedReflections(config);
  const formattedNewArtifactPrompt = formatNewArtifactPrompt(
    memoriesAsString,
    modelName,
  );

  const userSystemPrompt = optionallyGetSystemPromptFromConfig(config);
  const fullSystemPrompt = userSystemPrompt
    ? `${userSystemPrompt}\n${formattedNewArtifactPrompt}`
    : formattedNewArtifactPrompt;

  const response = await modelWithArtifactTool.invoke(
    [{ role: "system", content: fullSystemPrompt }, ...state.messages],
    { runName: "generate_artifact" },
  );

  // 有些模型输出内容不是出现在 tool_calls 中，而是直接出现在 response 中
  if (response.tool_calls?.length === 0) {
    // const newArtifactContent = createArtifactContent(response.content);
    const newArtifactContent: ArtifactCodeV3 | ArtifactMarkdownV3 =
      ARTIFACT_TOOL_SCHEMA.parse(JSON.parse(response.content.toString()));
    const newArtifact: ArtifactV3 = {
      currentIndex: 0,
      contents: [newArtifactContent],
    };
    return {
      artifact: newArtifact,
    };
  }
  const newArtifactContent = createArtifactContent(response.tool_calls?.[0]);
  const newArtifact: ArtifactV3 = {
    currentIndex: 1,
    contents: [newArtifactContent],
  };

  return {
    artifact: newArtifact,
  };
};
