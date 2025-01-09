import { tool } from "@langchain/core/tools";
import { z } from "zod";
// import { DynamicTool } from "@langchain/core/tools";

export const WebSearchTool = tool(
  //@ts-ignore
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
