import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { isArtifactMarkdownContent } from "mtxuilib/lib/artifact_content_types";

import type { ArtifactMarkdownV3, ArtifactV3, Reflections } from "mtmaiapi";
import {
  ensureStoreInConfig,
  formatReflections,
  getModelFromConfig,
} from "../../../agentutils/agentutils.ts--";
import { getArtifactContent } from "../../../agentutils/opencanvas_utils";
import {
  ADD_EMOJIS_TO_ARTIFACT_PROMPT,
  CHANGE_ARTIFACT_LANGUAGE_PROMPT,
  CHANGE_ARTIFACT_LENGTH_PROMPT,
  CHANGE_ARTIFACT_READING_LEVEL_PROMPT,
  CHANGE_ARTIFACT_TO_PIRATE_PROMPT,
} from "../prompts";
import type {
  OpenCanvasGraphAnnotation,
  OpenCanvasGraphReturnType,
} from "../state";

export const rewriteArtifactTheme = async (
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig,
): Promise<OpenCanvasGraphReturnType> => {
  const smallModel = await getModelFromConfig(config);

  const store = ensureStoreInConfig(config);
  const assistantId = config.configurable?.assistant_id;
  if (!assistantId) {
    throw new Error("`assistant_id` not found in configurable");
  }
  const memoryNamespace = ["memories", assistantId];
  const memoryKey = "reflection";
  const memories = await store.get(memoryNamespace, memoryKey);
  const memoriesAsString = memories?.value
    ? formatReflections(memories.value as Reflections)
    : "No reflections found.";

  const currentArtifactContent = state.artifact
    ? getArtifactContent(state.artifact)
    : undefined;
  if (!currentArtifactContent) {
    throw new Error("No artifact found");
  }
  if (!isArtifactMarkdownContent(currentArtifactContent)) {
    throw new Error("Current artifact content is not markdown");
  }

  let formattedPrompt = "";
  if (state.language) {
    formattedPrompt = CHANGE_ARTIFACT_LANGUAGE_PROMPT.replace(
      "{newLanguage}",
      state.language,
    ).replace(
      "{artifactContent}",
      (currentArtifactContent as ArtifactMarkdownV3).fullMarkdown,
    );
  } else if (state.readingLevel && state.readingLevel !== "pirate") {
    let newReadingLevel = "";
    switch (state.readingLevel) {
      case "child":
        newReadingLevel = "elementary school student";
        break;
      case "teenager":
        newReadingLevel = "high school student";
        break;
      case "college":
        newReadingLevel = "college student";
        break;
      case "phd":
        newReadingLevel = "PhD student";
        break;
    }
    formattedPrompt = CHANGE_ARTIFACT_READING_LEVEL_PROMPT.replace(
      "{newReadingLevel}",
      newReadingLevel,
    ).replace(
      "{artifactContent}",
      (currentArtifactContent as ArtifactMarkdownV3).fullMarkdown,
    );
  } else if (state.readingLevel && state.readingLevel === "pirate") {
    formattedPrompt = CHANGE_ARTIFACT_TO_PIRATE_PROMPT.replace(
      "{artifactContent}",
      (currentArtifactContent as ArtifactMarkdownV3).fullMarkdown,
    );
  } else if (state.artifactLength) {
    let newLength = "";
    switch (state.artifactLength) {
      case "shortest":
        newLength = "much shorter than it currently is";
        break;
      case "short":
        newLength = "slightly shorter than it currently is";
        break;
      case "long":
        newLength = "slightly longer than it currently is";
        break;
      case "longest":
        newLength = "much longer than it currently is";
        break;
    }
    formattedPrompt = CHANGE_ARTIFACT_LENGTH_PROMPT.replace(
      "{newLength}",
      newLength,
    ).replace(
      "{artifactContent}",
      (currentArtifactContent as ArtifactMarkdownV3).fullMarkdown,
    );
  } else if (state.regenerateWithEmojis) {
    formattedPrompt = ADD_EMOJIS_TO_ARTIFACT_PROMPT.replace(
      "{artifactContent}",
      (currentArtifactContent as ArtifactMarkdownV3).fullMarkdown,
    );
  } else {
    throw new Error("No theme selected");
  }

  formattedPrompt = formattedPrompt.replace("{reflections}", memoriesAsString);

  const newArtifactValues = await smallModel.invoke([
    { role: "user", content: formattedPrompt },
  ]);

  const newArtifact: ArtifactV3 = {
    ...state.artifact,
    currentIndex: state.artifact.contents.length + 1,
    contents: [
      ...state.artifact.contents,
      {
        ...currentArtifactContent,
        index: state.artifact.contents.length + 1,
        fullMarkdown: newArtifactValues.content as string,
      },
    ],
  };

  return {
    artifact: newArtifact,
  };
};
