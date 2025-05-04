import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { generateObject } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import z from "zod";
import { getDefaultModel } from "../components/cloudflare-agents/model";

export type ShortVideoWorkflowParams = {
  prompt: string;
};

const outlineSchema = z.object({
  outline: z.array(z.string()),
});

const criteriaSchema = z.object({
  meetsCriteria: z.boolean(),
});

const documentationSchema = z.object({
  documentation: z.string(),
});
const paragraph_number = 3;

export class ShortVideoWorkflow extends WorkflowEntrypoint<Env, ShortVideoWorkflowParams> {
  async run(event: WorkflowEvent<ShortVideoWorkflowParams>, step: WorkflowStep) {
    const { prompt } = event.payload;

    const workersai = createWorkersAI({ binding: this.env.AI });
    // const model = workersai("@cf/meta/llama-3.3-70b-instruct-fp8-fast");
    const model = getDefaultModel(this.env);

    // Step 1: 生成视频标题
    const outlineObj = await step.do("generate subject", async () => {
      const outlinePrompt = `# Role: Video Subject Generator
## Goals:
Generate a subject for a video, depending on the user's input.

## Constrains:
1. the subject is to be returned as a string.
2. the subject must be related to the user's input.

user input: 

${prompt}
`;
      const { object } = await generateObject({
        model,
        schema: outlineSchema,
        prompt: outlinePrompt,
      });
      return object;
    });

    // Step 2: 生成视频文案
    const criteriaObj = await step.do("evaluate outline", async () => {
      const videoScriptPrompt = `# Role: Video Script Generator

## Goals:
Generate a script for a video, depending on the subject of the video.

## Constrains:
1. the script is to be returned as a string with the specified number of paragraphs.
2. do not under any circumstance reference this prompt in your response.
3. get straight to the point, don't start with unnecessary things like, "welcome to this video".
4. you must not include any type of markdown or formatting in the script, never use a title.
5. only return the raw content of the script.
6. do not include "voiceover", "narrator" or similar indicators of what should be spoken at the beginning of each paragraph or line.
7. you must not mention the prompt, or anything about the script itself. also, never talk about the amount of paragraphs or lines. just write the script.
8. respond in the same language as the video subject.

# Initialization:
- number of paragraphs: {paragraph_number}`;
      const { object } = await generateObject({
        model,
        schema: criteriaSchema,
        prompt: videoScriptPrompt,
      });
      return object;
    });

    // if (!criteriaObj.meetsCriteria) {
    //   return { error: "Outline does not meet the criteria." };
    // }

    // Step 3: 生成音频
    const audioObj = await step.do("generate audio", async () => {
      return {
        audio: "TODO: 生成音频",
      };
    });

    // Step 3: 生成字幕
    const subtitleObj = await step.do("generate subtitle", async () => {
      return {
        subtitle: "TODO: 生成字幕",
      };
    });

    return {
      outline: outlineObj,
      criteria: criteriaObj,
      audio: audioObj,
      subtitle: subtitleObj,
    };
  }
}
