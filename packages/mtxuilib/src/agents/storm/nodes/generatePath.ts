import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { z } from "zod";
import { getModelFromConfig } from "../../../agentutils/agentutils.ts--";
import {
  formatArtifactContentWithTemplate,
  getArtifactContent,
} from "../../../agentutils/opencanvas_utils";
import {
  CURRENT_ARTIFACT_PROMPT,
  NO_ARTIFACT_PROMPT,
  ROUTE_QUERY_OPTIONS_HAS_ARTIFACTS,
  ROUTE_QUERY_OPTIONS_NO_ARTIFACTS,
  ROUTE_QUERY_PROMPT,
} from "../prompts";
import type { StormGraphAnnotation } from "../state";

/**

/**
 * graph 入口
 */
export const generatePath = async (
  state: typeof StormGraphAnnotation.State,
  config: LangGraphRunnableConfig,
) => {
  if (state.customQuickActionId) {
    return {
      next: "customAction",
    };
  }

  const currentArtifactContent = state.artifact
    ? getArtifactContent(state.artifact)
    : undefined;

  // Call model and decide if we need to respond to a users query, or generate a new artifact
  const formattedPrompt = ROUTE_QUERY_PROMPT.replace(
    "{artifactOptions}",
    currentArtifactContent
      ? ROUTE_QUERY_OPTIONS_HAS_ARTIFACTS
      : ROUTE_QUERY_OPTIONS_NO_ARTIFACTS,
  )
    .replace(
      "{recentMessages}",
      state.messages
        .slice(-3)
        .map((message) => `${message.getType()}: ${message.content}`)
        .join("\n\n"),
    )
    .replace(
      "{currentArtifactPrompt}",
      currentArtifactContent
        ? formatArtifactContentWithTemplate(
            CURRENT_ARTIFACT_PROMPT,
            currentArtifactContent,
          )
        : NO_ARTIFACT_PROMPT,
    );

  const artifactRoute = currentArtifactContent
    ? "rewriteArtifact"
    : "generateArtifact";

  const model = await getModelFromConfig(config, {
    temperature: 0,
  });

  const routeSchema = z.object({
    route: z
      .enum(["replyToGeneralInput", artifactRoute])
      .describe("The route to take based on the user's query."),
  });
  const modelWithTool = model.withStructuredOutput(routeSchema, {
    name: "route_query",
    includeRaw: true,
  });

  const result = await modelWithTool.invoke([
    {
      role: "user",
      content: formattedPrompt,
    },
  ]);

  let route = result.parsed?.route;
  if (!route) {
    route = routeSchema.parse(JSON.parse(result.raw.content.toString())).route;
  }

  return {
    // 暂时写死, 直接跳转到 research 节点
    next: "research",
  };
};

const initOutline = async (
  topic: string,
  config: LangGraphRunnableConfig,
) => {};
