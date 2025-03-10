import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { isArtifactMarkdownContent } from "mtxuilib/lib/artifact_content_types";
import {
  getFormattedReflections,
  getModelFromConfig,
  optionallyGetSystemPromptFromConfig,
} from "../../../../agentutils/agentutils.ts--";

import type {
  OpenCanvasGraphAnnotation,
  OpenCanvasGraphReturnType,
} from "../../state";
import { optionallyUpdateArtifactMeta } from "./update-meta";
import { buildPrompt, createNewArtifactContent, validateState } from "./utils";

export const rewriteArtifact = async (
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig,
): Promise<OpenCanvasGraphReturnType> => {
  const smallModelWithConfig = (await getModelFromConfig(config)).withConfig({
    runName: "rewrite_artifact_model_call",
  });
  const memoriesAsString = await getFormattedReflections(config);
  const { currentArtifactContent, recentHumanMessage } = validateState(state);

  const artifactMetaToolCall = await optionallyUpdateArtifactMeta(
    state,
    config,
  );
  const artifactType = artifactMetaToolCall?.args?.type;
  const isNewType = artifactType !== currentArtifactContent.type;

  const artifactContent = isArtifactMarkdownContent(currentArtifactContent)
    ? currentArtifactContent.fullMarkdown
    : currentArtifactContent.code;

  const formattedPrompt = buildPrompt({
    artifactContent,
    memoriesAsString,
    isNewType,
    artifactMetaToolCall,
  });

  const userSystemPrompt = optionallyGetSystemPromptFromConfig(config);
  const fullSystemPrompt = userSystemPrompt
    ? `${userSystemPrompt}\n${formattedPrompt}`
    : formattedPrompt;

  const newArtifactResponse = await smallModelWithConfig.invoke([
    { role: "system", content: fullSystemPrompt },
    recentHumanMessage,
  ]);

  const newArtifactContent = createNewArtifactContent({
    artifactType,
    state,
    currentArtifactContent,
    artifactMetaToolCall,
    newContent: newArtifactResponse.content as string,
  });

  return {
    artifact: {
      ...state.artifact,
      currentIndex: state.artifact.contents.length + 1,
      contents: [...state.artifact.contents, newArtifactContent],
    },
  };
};
