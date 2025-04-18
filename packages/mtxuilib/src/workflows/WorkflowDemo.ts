import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";

import type { Env } from "../types";

import { getLlm } from "../llm/llm";

export type Params = {
  input: string;
  email: string;
  metadata: Record<string, string>;
  to: string;
  content: string;
  host: string;
};

export class WorkflowDemo extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const { to, host, content, input } = event.payload;
    const toolChoice = await step.do("llm helloworld 步骤", async () => {
      const llm = getLlm();

      const messages = [
        {
          role: "system",
          content: `根据用户输入，判断用户意图，并给出相应的回答。
回答必须是以下三个之一：
- "使用机票工具"
- "使用酒店工具"
- "使用火车票工具"

**IMPORTANT**
不要有任何其他内容，只返回"使用机票工具"、"使用酒店工具"、"使用火车票工具"中的一个。
eg. 如果用户输入中包含"预定"，则必须返回"使用机票工具"`,
        },
        { role: "user", content: "你好，我想预定机票" },
      ];
      const resp = await llm.invoke(messages);
      return {
        output: resp.content,
      };
    });

    switch (toolChoice.output) {
      case "使用机票工具":
        await step.do("使用机票工具", async () => {
          return {
            output: "fake result for ticket",
          };
        });
        break;
      case "使用酒店工具":
        await step.do("使用机票工具", async () => {
          return {
            output: "fake result for ticket",
          };
        });
        break;
      case "使用火车票工具":
        await step.do("使用火车票工具", async () => {
          return {
            output: "fake result for train",
          };
        });
        break;
    }
  }
}
