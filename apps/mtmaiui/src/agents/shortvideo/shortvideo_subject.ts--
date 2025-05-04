/**
 * 短视频文案生成
 */
import { type LanguageModelV1, generateText } from "ai";
const shortvideo_prompt = `
# Role: Video Subject Generator

## Goals:
Generate a subject for a video, depending on the user's input.

## Constrains:
1. the subject is to be returned as a string.
2. the subject must be related to the user's input.

`;

export const generateShortvideoSubject = async (input: string, model: LanguageModelV1) => {
  const response = await generateText({
    model: model,
    messages: [{ role: "system", content: input }],
  });
  return response.text;
};
