import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import type { ArtifactV3 } from "mtmaiapi";

export const TitleGenerationAnnotation = Annotation.Root({
  /**
   * The chat history to generate a title for
   */
  ...MessagesAnnotation.spec,
  /**
   * The artifact that was generated/updated (if any)
   */
  artifact: Annotation<ArtifactV3 | undefined>,
});

export type TitleGenerationReturnType = Partial<
  typeof TitleGenerationAnnotation.State
>;
