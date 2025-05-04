/**
 * 短视频文案生成
 */

const shortvideo_prompt = `
# Role: Video Subject Generator

## Goals:
Generate a subject for a video, depending on the user's input.

## Constrains:
1. the subject is to be returned as a string.
2. the subject must be related to the user's input.

`;

export const generateShortvideoSubject = async (input: string) => {
  const response = await fetch(input);
  const data = await response.json();
  return data;
};
