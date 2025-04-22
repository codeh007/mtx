import { AIChatAgent } from "agents/ai-chat-agent";
import {
  type DataStreamWriter,
  type Message,
  type StreamTextOnFinishCallback,
  createDataStreamResponse,
  generateId,
  streamText,
  tool,
} from "ai";
import type { RootAgentState, ScheduledItem } from "mtmaiapi";
import { z } from "zod";
// import type { RootAgentState } from "../agent_state/root_agent_state";
// import type { IncomingMessage, OutgoingMessage, ScheduledItem } from "../agent_state/shared";
import { callAgentRunner } from "../agent_utils/agent_utils";
import { getDefaultModel } from "../components/cloudflare-agents/model";
import { tools } from "./tools";
import { Schedule, Connection, ConnectionContext } from "agents";
import { OutgoingMessage, IncomingMessage } from "http";

function convertScheduleToScheduledItem(schedule: Schedule): ScheduledItem {
  return {
    id: schedule.id,
    trigger:
      schedule.type === "delayed"
        ? `in ${schedule.delayInSeconds} seconds`
        : schedule.type === "cron"
          ? `at ${schedule.cron}`
          : `at ${new Date(schedule.time * 1000).toISOString()}`,
    nextTrigger: new Date(schedule.time * 1000).toISOString(),
    description: schedule.payload,
    type: schedule.type,
  };
}

export class Chat extends AIChatAgent<Env, RootAgentState> {
  initialState = {
    counter: 0,
    color: "#3B82F6",
    mainViewType: "chat",
    chatHistoryIds: [],
    mcpServers: {},
    mcpTools: [],
    mcpPrompts: [],
    mcpResources: [],
    agentRunnerUrl: "http://localhost:7860",
  } satisfies RootAgentState;

  onStart(): void | Promise<void> {
    // console.log("chat onStart");
  }
  onConnect(connection: Connection, ctx: ConnectionContext) {
    this.broadcast(
      JSON.stringify({
        type: "connected",
        data: { message: "(chat agent)Hello, world! connected" },
      } satisfies OutgoingMessage),
    );
  }
  async onRequest(request: Request) {
    return super.onRequest(request);
  }

  async onMessage(connection: Connection, message: string): Promise<void> {
    const event = JSON.parse(message) as IncomingMessage;

    if (event.type === "schedule") {
    } else if (event.type === "delete-schedule") {
      await this.cancelSchedule(event.id);
    } else {
      // console.log("root ag unknown message", event);
      super.onMessage(connection, message);
    }
  }

  async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
    const model = getDefaultModel(this.env);
    const sessionId = this.name;
    const callCoderAgent = tool({
      description: "调用具有 python 编程能力的Agent, 用来解决复杂问题",
      parameters: z.object({
        prompt: z.string().describe("The prompt to send to the coder agent"),
      }),
      execute: async ({ prompt }, options) => {
        if (!this.state.agentRunnerUrl) {
          return "Error: agentRunnerUrl is not set";
        }
        try {
          console.log("callCoderAgent", prompt);
          const result = await callAgentRunner(this.state.agentRunnerUrl, {
            app_name: "root",
            user_id: "user",
            session_id: sessionId,
            new_message: {
              role: "user",
              parts: [{ text: prompt }],
            },
            streaming: false,
          });
          console.log("callCoderAgent result", result);
        } catch (error) {
          console.error("Error calling coder agent", error);
          return `Error calling coder agent: ${error}`;
        }
      },
    });

    // cloudflare agents 的 streamText 的实现
    const dataStreamResponse = createDataStreamResponse({
      execute: async (dataStream) => {
        const lastestMessage = this.messages?.[this.messages.length - 1];
        lastestMessage.content;
        if (lastestMessage.content.startsWith("@adk")) {
          lastestMessage.content = lastestMessage.content.slice(4);
          await this.onDemoRun2(lastestMessage, dataStream, onFinish);
        } else {
          const result = streamText({
            model,
            messages: this.messages,
            tools: { ...tools, callCoderAgent },
            onFinish: (result) => {
              console.log("onStreamText result", result);
              onFinish(result);
            },
            onError: (error) => {
              console.log("onStreamText error", error);
            },
          });

          result.mergeIntoDataStream(dataStream);
        }
      },
    });

    return dataStreamResponse;
  }
  async onTask(payload: unknown, schedule: Schedule<string>) {
    // 提示: 当到时间运行新任务时, 会先进入这个函数.
    //      这个函数, 应该实际运行 任务载荷,
    //      建议的方式:
    //        1: 通过 api 运行远程任务.
    //        2:
    //
    console.log("on Task", payload, schedule);

    // 广播任务信息, 这样,所有在同一个 房间的客户端都可以接收到信息,从而可以自主运行实际的任务.
    this.broadcast(
      JSON.stringify({
        type: "run-schedule",
        data: convertScheduleToScheduledItem(schedule),
      } satisfies OutgoingMessage),
    );
  }

  async onStep(step) {
    console.log("onStep", step);
    this.broadcast(
      JSON.stringify({
        type: "new-step",
        data: step,
      } satisfies OutgoingMessage),
    );
  }

  async getState() {
    return this.state;
  }

  async onDemoRun2(
    newMessage: Message,
    dataStream: DataStreamWriter,
    onFinish: StreamTextOnFinishCallback<{}>,
  ) {
    // console.log("onDemoRun2", data);
    // const helloStream2 = async function* () {
    //   yield "hello";
    //   yield "world";
    //   yield "test";
    // };
    // const textGenerator = helloStream2();

    let finnalResponseText = "";
    // 逐个处理yield的文本
    for await (const adkEvent of await this.onCallAdk(newMessage)) {
      // 写入到dataStream，使用与AI SDK相同的格式
      // 这里的 "0:" 前缀是为了与AI SDK的格式保持一致
      // dataStream.write(`0:${JSON.stringify(chunk)}\n`);
      // dataStream.write(`0:"hello222"\n`);

      if (adkEvent.content) {
        if (adkEvent.content.parts) {
          for (const part of adkEvent.content.parts) {
            // yield part.text;
            const a = `0:${JSON.stringify(part.text)}\n`;
            console.log("a", a);
            dataStream.write(a);
            finnalResponseText += part.text;
          }
        } else {
          // yield data.content;
        }
      }

      // 可选：添加一些延迟来模拟真实的流式响应
      // await new Promise((resolve) => setTimeout(resolve, 300));
    }
    onFinish({
      text: finnalResponseText,
      files: [],
      steps: [],
      toolResults: [],
      toolCalls: [],
      warnings: [],
      finishReason: "stop",
      reasoningDetails: [],
      reasoning: undefined,
      experimental_providerMetadata: {},
      sources: [],
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      },
      logprobs: [],
      request: {},
      response: {
        id: generateId(),
        timestamp: new Date(),
        modelId: "gemini-1.5-flash22",
        // 这里返回的消息将写入数据库
        messages: [
          {
            role: "assistant",
            content: finnalResponseText,
            id: generateId(),
          },
        ],
        body: {},
      },
      providerMetadata: {},
    });
  }
  async onCallAdk(newMessage: Message) {
    const adkEndpoint = "http://localhost:7860/run_sse_v2";
    const postData = {
      app_name: "root",
      user_id: "user",
      session_id: "a16c95ef-eb45-496d-9c88-f95406f12e3b---",
      new_message: {
        role: newMessage.role,
        parts: [
          {
            text: newMessage.content,
          },
        ],
      },
      streaming: false,
    };

    const response = await fetch(adkEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get reader from response body");
    }

    async function* streamAdkMessages() {
      try {
        let buffer = "";
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const text = new TextDecoder().decode(value);
          buffer += text;

          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

          for (const line of lines) {
            if (line.trim() === "") continue;
            if (line === "data: [DONE]") {
              console.log("Adk SSE message: [DONE]");
              return;
            }

            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6);
                const data = JSON.parse(jsonStr);
                yield data;
              } catch (e) {
                console.error("(Adk sse) Failed to parse SSE message:", line);
                // console.error("Parse error:", e);
              }
            }
          }
        }
      } finally {
        reader?.releaseLock();
      }
    }
    return streamAdkMessages();
  }
}
