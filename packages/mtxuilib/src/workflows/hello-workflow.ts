import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";

import * as ai from "ai";
import type { Env } from "../types";

export type Params = {
  email: string;
  metadata: Record<string, string>;
  to: string;
  content: string;
  host: string;
};

// <docs-tag name="workflow-entrypoint">
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    // Can access bindings on `this.env`
    // Can access params on `event.payload`

    console.log("payload123", event.payload);
    const { to, host, content } = event.payload;
    const files = await step.do("my first step", async () => {
      // Fetch a list of files from $SOME_SERVICE
      console.log("my first step");
      console.log({
        我的消息: "我的消息123",
        aa: ai.streamText,
      });
      return {
        inputParams: event,
        files: [
          "doc_7392_rev3.pdf",
          "report_x29_final.pdf",
          "memo_2024_05_12.pdf",
          "file_089_update.pdf",
          "proj_alpha_v2.pdf",
          "data_analysis_q2.pdf",
          "notes_meeting_52.pdf",
          "summary_fy24_draft.pdf",
        ],
      };
    });

    await step.do("my first step", async () => {
      console.log("开始检查 ip 地址");
      console.log({
        我的消息: "我的消息123",
        aa: ai.streamText,
      });
      const apiResponse = await step.do("some other step", async () => {
        const resp = await fetch("https://api.cloudflare.com/client/v4/ips");
        return await resp.json<any>();
      });
      return await apiResponse.json();
    });

    //主动休眠
    // await step.sleep("wait on something", "1 minute");

    await step.do(
      "make a call to write that could maybe, just might, fail",
      // Define a retry strategy
      {
        retries: {
          limit: 5,
          delay: "5 second",
          backoff: "exponential",
        },
        timeout: "15 minutes",
      },
      async () => {
        console.log({
          我的消息: "我的消息456",
        });

        // Do stuff here, with access to the state from our previous steps
        if (Math.random() > 0.5) {
          throw new Error("API call to $STORAGE_SYSTEM failed");
        }
      },
    );
    await step.do("最终步骤", async () => {
      console.log({
        我的消息: "我的消息123",
        aa: ai.streamText,
        event: event,
      });
      return {
        最终结果: "最终结果123",
        event: event,
      };
    });
  }
}
