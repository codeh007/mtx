// import { zodToJsonSchema } from "@langchain/core";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getModelFromConfig } from "../../../agentutils/agentutils";
import type { MtmRunnableConfig } from "../../../agentutils/runableconfig";
import { searchSearxng } from "../../../agentutils/searxng";
import type { StormGraphAnnotation } from "../state";

const subsectionSchema = z.object({
  subsection_title: z.string().describe("Title of the subsection"),
  description: z.string().describe("Content of the subsection"),
});

const sectionSchema = z.object({
  section_title: z.string().describe("Title of the section"),
  description: z.string().describe("Content of the section"),
  subsections: z.array(subsectionSchema).describe("Titles and descriptions for each subsection of the Wikipedia page."),
});

const outlineSchema = z.object({
  page_title: z.string().describe("Title of the Wikipedia page"),
  sections: z.array(sectionSchema).describe("Titles and descriptions for each section of the Wikipedia page."),
});


export const researchNode = async (
  state: typeof StormGraphAnnotation.State,
  config: MtmRunnableConfig,
) => {

  if(!state.topic){
    state.topic ="seo"
  }
  if(!state.topic){
    return {
      next: "__end__",
      error:"topic is required",
    };
  }
  const searxngUrl = config.configurable?.mtmaiConfig.searxng;
  console.log("开始调用搜索", searxngUrl);


  const searchResults = await searchSearxng(searxngUrl, "hello", {
    categories: ["general"],
  });
  console.log("searchResults", searchResults);

  console.log("开始初始化大纲");
  const outline = await initOutline(state, config);
  return {
    next: "__end__",
    searchResults: [searchResults],
    outline: outline.outline,
  };
};

// 先依靠模型自身写一个初始大纲
const initOutline = async (
  state: typeof StormGraphAnnotation.State,
  config: MtmRunnableConfig,
) => {
  const topic = state.topic;

  if (!topic) {
    return {
      error: "topic is required",
    };
  }
  const messages = [
    {
      role: "system",
      content: "You are a Wikipedia writer. Write an outline for a Wikipedia page about a user-provided topic. Be comprehensive and specific."
                    +"\n\nIMPORTANT: Your response must be in valid JSON format. Follow these guidelines:"
                    +"\n- Use double quotes for all strings"
                    +"\n- Ensure all keys and values are properly enclosed"
                    +"\n- Do not include any text outside of the JSON object"
                    +"\n- Strictly adhere to the following JSON schema:"
                    +`\n${JSON.stringify(zodToJsonSchema(outlineSchema))}`
                    +"\n\nDouble-check your output to ensure it is valid JSON before submitting.",
    },
    {
      role: "user",
      content: topic,
    },
  ];

  const jsonSchema = zodToJsonSchema(subsectionSchema);
  console.log("jsonSchema", jsonSchema);

  const model = await getModelFromConfig(config, {
    temperature: 0,
    maxTokens: 8000,
  });

  // const modelWithTool = model.withStructuredOutput(outlineSchema, {
  //   // name: "outline_query",
  //   includeRaw: true,
  // });

  const result = await model.invoke(messages);

  console.log("result", result.content);

  // let outline = result.parsed;
  // if (!outline) {
  const outline = outlineSchema.parse(JSON.parse(result.content as string));
  // }

  return {
    outline,
  };
};
