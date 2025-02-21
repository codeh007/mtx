import { jsonrepair } from "jsonrepair";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getModelFromConfig } from "../../../agentutils/agentutils";
import type { MtmRunnableConfig } from "../../../agentutils/runableconfig.ts--";
import { outlineSchema, perspectivesSchema, subsectionSchema } from "../schema";
import type { StormGraphAnnotation } from "../state";

/**
 * 初始化研究节点
 * 1. 初始大纲
 * 2. 初始化基于角色的专家(编辑者)
 * @param state
 * @param config
 * @returns
 */
export const initResearchNode = async (
  state: typeof StormGraphAnnotation.State,
  config: MtmRunnableConfig,
) => {
  if (!state.topic) {
    state.topic = "seo";
  }
  if (!state.topic) {
    return {
      next: "__end__",
      error: "topic is required",
    };
  }
  // const searxngUrl = config.configurable?.mtmaiConfig.searxng;
  // console.log("开始调用搜索", searxngUrl);
  // const searchResults = await searchSearxng(searxngUrl, "hello", {
  //   categories: ["general"],
  // });
  // console.log("searchResults", searchResults);

  // TODO: 可以并发
  const outline = await initOutline(state, config);
  const perspectives = await surveySubjects(state.topic, config);
  return {
    // searchResults: [searchResults], //这个搜索结果暂时没用,应该放到别的地方
    outline: outline,
    editors: perspectives.editors,
  };
};

// 依靠模型自身写一个初始大纲
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
      content:
        "You are a Wikipedia writer. Write an outline for a Wikipedia page about a user-provided topic. Be comprehensive and specific." +
        "\n\nIMPORTANT: Your response must be in valid JSON format. Follow these guidelines:" +
        "\n- Use double quotes for all strings" +
        "\n- Ensure all keys and values are properly enclosed" +
        "\n- Do not include any text outside of the JSON object" +
        "\n- Strictly adhere to the following JSON schema:" +
        `\n${JSON.stringify(zodToJsonSchema(outlineSchema))}` +
        "\n\nDouble-check your output to ensure it is valid JSON before submitting.",
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
  });

  // const modelWithTool = model.withStructuredOutput(outlineSchema, {
  //   // name: "outline_query",
  //   includeRaw: true,
  // });

  const result = await model.invoke(messages);

  // console.log("result", result.content);

  // let outline = result.parsed;
  // if (!outline) {
  const outline = outlineSchema.parse(JSON.parse(result.content as string));
  return outline;
};

// 初始化 编辑者(角色观点, 用于后续的对话)
const surveySubjects = async (topic: string, config: MtmRunnableConfig) => {
  // 步骤: 召回系统已有的相关主题
  const relatedSubjectsSchema = z.object({
    topics: z
      .array(z.string())
      .describe(
        "Comprehensive list of related subjects as background research.",
      ),
  });
  const system =
    `I'm writing a Wikipedia page for a topic mentioned below. Please identify and recommend some Wikipedia pages on closely related subjects. I'm looking for examples that provide insights into interesting aspects commonly associated with this topic, or examples that help me understand the typical content and structure included in Wikipedia pages for similar topics.` +
    `Please list the as many subjects and urls as you can.` +
    `[Requirements]` +
    `- No explanations, greetings, or other unnecessary words. Output only in strict JSON data format` +
    "\nDouble-check your output to ensure it is valid JSON before submitting,Strictly adhere to the following JSON schema:\n" +
    `${JSON.stringify(zodToJsonSchema(relatedSubjectsSchema))}` +
    `Topic of interest: ${topic}`;

  const messages = [
    {
      role: "system",
      content: system,
    },
  ];

  const model = await getModelFromConfig(config, {
    temperature: 0,
  });

  const result = await model.invoke(messages);
  const relatedSubjects = relatedSubjectsSchema.parse(
    JSON.parse(jsonrepair(result.content as string)),
  );

  // 步骤: 召回系统已有的相关主题
  // examples = await MtmTopicDocRetriever().retrive(related_subjects.topics)
  const examples = ["about seo", "about ai", "about ai seo"]; // 暂时写死

  // 步骤: 构建不同角色不同观点的编辑者, Generate Perspectives
  const messagesPerspectives = [
    {
      role: "system",
      content:
        "You need to select a diverse (and distinct) group of Wikipedia editors who will work together to create a comprehensive article on the topic. Each of them represents a different perspective, role, or affiliation related to this topic." +
        `\nYou can use other Wikipedia pages of related topics for inspiration. For each editor, add a description of what they will focus on.` +
        `\n[Requirements]` +
        `\n- No explanations, greetings, or other unnecessary words. Output only in strict JSON data format` +
        "\nDouble-check your output to ensure it is valid JSON before submitting,Strictly  to the following JSON schema:" +
        `\n${JSON.stringify(zodToJsonSchema(perspectivesSchema))}` +
        `\nWiki page outlines of related topics for inspiration:` +
        `${examples}`,
    },
    {
      role: "user",
      content: `Topic of interest: ${topic}`,
    },
  ];
  const resultPerspectives = await model.invoke(messagesPerspectives);
  const perspectives = perspectivesSchema.parse(
    JSON.parse(jsonrepair(resultPerspectives.content as string)),
  );

  return perspectives;
};
