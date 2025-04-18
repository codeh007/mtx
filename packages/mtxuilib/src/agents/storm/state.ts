import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import type {
  // ArtifactLengthOptions,
  ArtifactV3,
  CodeHighlight,
  LanguageOptions,
  Outline,
  // ProgrammingLanguageOptions,
  ReadingLevelOptions,
  TextHighlight,
} from "mtmaiapi";
import { z } from "zod";
import type { SearxngSearchResult } from "../../agentutils/searxng";
import { editorSchema } from "./schema";
export const StormGraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  searchResults: Annotation<SearxngSearchResult[] | undefined>,
  topic: Annotation<string | undefined>,
  outline: Annotation<Outline | undefined>,
  error: Annotation<string | undefined>,
  // 编辑者(角色观点)
  editors: Annotation<z.infer<typeof editorSchema>[] | undefined>,
  // 下面的可能都是没用的 ===================================================================
  /**
   * The part of the artifact the user highlighted. Use the `selectedArtifactId`
   * to determine which artifact the highlight belongs to.
   */
  highlightedCode: Annotation<CodeHighlight | undefined>,
  /**
   * The highlighted text. This includes the markdown blocks which the highlighted
   * text belongs to, along with the entire plain text content of highlight.
   */
  highlightedText: Annotation<TextHighlight | undefined>,
  /**
   * The artifacts that have been generated in the conversation.
   */
  artifact: Annotation<ArtifactV3>,
  /**
   * The next node to route to. Only used for the first routing node/conditional edge.
   */
  next: Annotation<string | undefined>,
  /**
   * The language to translate the artifact to.
   */
  language: Annotation<LanguageOptions | undefined>,
  /**
   * The length of the artifact to regenerate to.
   */
  // artifactLength: Annotation<ArtifactLengthOptions | undefined>,
  /**
   * Whether or not to regenerate with emojis.
   */
  regenerateWithEmojis: Annotation<boolean | undefined>,
  /**
   * The reading level to adjust the artifact to.
   */
  readingLevel: Annotation<ReadingLevelOptions | undefined>,
  /**
   * Whether or not to add comments to the code artifact.
   */
  addComments: Annotation<boolean | undefined>,
  /**
   * Whether or not to add logs to the code artifact.
   */
  addLogs: Annotation<boolean | undefined>,
  /**
   * The programming language to port the code artifact to.
   */
  // portLanguage: Annotation<ProgrammingLanguageOptions | undefined>,
  /**
   * Whether or not to fix bugs in the code artifact.
   */
  // fixBugs: Annotation<boolean | undefined>,
  /**
   * The ID of the custom quick action to use.
   */
  customQuickActionId: Annotation<string | undefined>,
});

export type StormGraphReturnType = Partial<typeof StormGraphAnnotation.State>;
