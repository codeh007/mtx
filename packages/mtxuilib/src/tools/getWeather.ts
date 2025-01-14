import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const getWeatherTool = tool(
  (input) => {
    //@ts-ignore
    if (["sf", "san francisco"].includes(input.location.toLowerCase())) {
      return "It's 60 degrees and foggy.";
    }
    return "It's 90 degrees and sunny.";
  },
  {
    name: "get_weather",
    description: "Call to get the current weather.",
    schema: z.object({
      location: z.string().describe("Location to get the weather for."),
    }),
  },
);
