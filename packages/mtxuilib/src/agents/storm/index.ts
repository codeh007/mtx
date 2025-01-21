import { START, Send, StateGraph } from "@langchain/langgraph";
// import { customAction } from "./nodes/customAction";
// import { generateArtifact } from "./nodes/generate-artifact";
// import { generateFollowup } from "./nodes/generateFollowup";
import { generatePath } from "./nodes/generatePath";
// import { generateTitleNode } from "./nodes/generateTitle";
// import { reflectNode } from "./nodes/reflect";
// import { replyToGeneralInput } from "./nodes/replyToGeneralInput";
// import { rewriteArtifact } from "./nodes/rewrite-artifact";
// import { rewriteArtifactTheme } from "./nodes/rewriteArtifactTheme";
// import { rewriteCodeArtifactTheme } from "./nodes/rewriteCodeArtifactTheme";
// import { updateArtifact } from "./nodes/updateArtifact";
// import { updateHighlightedText } from "./nodes/updateHighlightedText";
import { StormGraphAnnotation } from "./state";

/**
 * 其他参考文档:
 *  https://blog.cloudflare.com/langchain-and-cloudflare/
 *
 */

export const DEFAULT_INPUTS = {
  highlightedCode: undefined,
  highlightedText: undefined,
  next: undefined,
  language: undefined,
  artifactLength: undefined,
  regenerateWithEmojis: undefined,
  readingLevel: undefined,
  addComments: undefined,
  addLogs: undefined,
  fixBugs: undefined,
  portLanguage: undefined,
  customQuickActionId: undefined,
};

const routeNode = (state: typeof StormGraphAnnotation.State) => {
  if (!state.next) {
    throw new Error("'next' state field not set.");
  }

  return new Send(state.next, {
    ...state,
  });
};

const cleanState = (_: typeof StormGraphAnnotation.State) => {
  return {
    ...DEFAULT_INPUTS,
  };
};

export function buildStormGraph() {
  const builder = new StateGraph(StormGraphAnnotation)
    // Start node & edge
    .addNode("generatePath", generatePath)
    .addEdge(START, "generatePath")
    // Nodes
    // .addNode("replyToGeneralInput", replyToGeneralInput)
    // .addNode("rewriteArtifact", rewriteArtifact)
    // .addNode("rewriteArtifactTheme", rewriteArtifactTheme)
    // .addNode("rewriteCodeArtifactTheme", rewriteCodeArtifactTheme)
    // .addNode("updateArtifact", updateArtifact)
    // .addNode("updateHighlightedText", updateHighlightedText)
    // .addNode("generateArtifact", generateArtifact)
    // .addNode("customAction", customAction)
    // .addNode("generateFollowup", generateFollowup)
    // .addNode("cleanState", cleanState)
    // .addNode("reflect", reflectNode)
    // .addNode("generateTitle", generateTitleNode)
    // Initial router
    .addConditionalEdges("generatePath", routeNode, [
      //   "updateArtifact",
      //   "rewriteArtifactTheme",
      //   "rewriteCodeArtifactTheme",
      //   "replyToGeneralInput",
      //   "generateArtifact",
      //   "rewriteArtifact",
      //   "customAction",
      //   "updateHighlightedText",
    ]);
  // Edges
  // .addEdge("generateArtifact", "generateFollowup")
  // .addEdge("updateArtifact", "generateFollowup")
  // .addEdge("updateHighlightedText", "generateFollowup")
  // .addEdge("rewriteArtifact", "generateFollowup")
  // .addEdge("rewriteArtifactTheme", "generateFollowup")
  // .addEdge("rewriteCodeArtifactTheme", "generateFollowup")
  // .addEdge("customAction", "generateFollowup")
  // // End edges
  // .addEdge("replyToGeneralInput", "cleanState")
  // // Only reflect if an artifact was generated/updated.
  // .addEdge("generateFollowup", "reflect")
  // .addEdge("reflect", "cleanState")
  // .addConditionalEdges("cleanState", conditionallyGenerateTitle, [
  //   END,
  //   "generateTitle",
  // ])
  // .addEdge("generateTitle", END);

  return builder;
}
