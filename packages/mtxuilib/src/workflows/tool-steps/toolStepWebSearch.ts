import { type DynamicStructuredTool, tool } from "@langchain/core/tools";
import { z } from "zod";
import { WebSearchTool } from "../../tools/webSearch";
import type { WorkflowEvent, WorkflowStep, ZodObjectAny } from "../../types";
import type { MtmaiClient } from "../mtmaiclient";

export const WebSearchTool22 = tool(
  ({ query }) => {
    return "It's 90 degrees and sunny.";
  },
  {
    name: "web_search",
    description: "Call to search the web.",
    schema: z.object({
      query: z.string().describe("Query to search for."),
    }),
  },
);
//@ts-ignore
export function WraperToolStep<T extends ZodObjectAny>(
  step: WorkflowStep,
  targetTool: DynamicStructuredTool<T>,
) {
  const fn = async (input) => {
    return await step.do("tool callxxxxx ", async () => {
      const result = targetTool.invoke(input);
      return result;
    });
  };
  return tool(fn, {
    name: targetTool.name,
    description: targetTool.description,
    schema: targetTool.schema,
  });
}

export async function toolStepWebSearch(
  event: WorkflowEvent<unknown>,
  step: WorkflowStep,
  ctx: MtmaiClient,
  props: {
    query: string;
  },
) {
  const { query } = props;
  return await step.do(`tool call websearch(${query}) `, async () => {
    const searchResult = await WebSearchTool.invoke(props);
    return {
      data: searchResult,
    };
  });
}
