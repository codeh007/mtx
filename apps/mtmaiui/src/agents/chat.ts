import type { Connection, ConnectionContext, Schedule } from "agents";
import { getAgentByName } from "agents";
import { unstable_callable as callable } from "agents";
import {
  type DataStreamWriter,
  type Message,
  type StreamTextOnFinishCallback,
  type ToolSet,
  createDataStreamResponse,
  generateId,
  streamText,
  tool,
} from "ai";
import { z } from "zod";
import type {
  ChatAgentIncomingMessage,
  ChatAgentOutgoingMessage,
  ChatAgentState,
} from "../agent_state/chat_agent_state";
import { AgentNames, type OutgoingMessage } from "../agent_state/shared";
import { getDefaultModel } from "../components/cloudflare-agents/model";
import { ChatAgentBase } from "./ChatAgentBase";
import type { ShortVideoAg } from "./shortvideo/shortvideo_agent";
import { tools } from "./tools";
import { convertScheduleToScheduledItem } from "./utils";
import type { WorkerAgent } from "./worker_agent";

export class Chat extends ChatAgentBase<Env, ChatAgentState> {
  initialState: ChatAgentState = {
    lastUpdated: 0,
    subAgents: {},
    enabledDebug: true,
  };

  onStart(): void | Promise<void> {}
  onConnect(connection: Connection, ctx: ConnectionContext) {
    this.setState({
      ...this.state,
    });
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
    const event = JSON.parse(message) as ChatAgentIncomingMessage;
    switch (event.type) {
      //未起作用
      case "new_chat_participant":
        this.setState({
          ...this.state,
          // participants: [...this.state.participants, event.data.agentName],
        });
        this.broadcast(
          JSON.stringify({
            type: "new_chat_participant",
            data: { agentName: event.data.agentName || "unknown" },
          } satisfies ChatAgentOutgoingMessage),
        );
        break;
      default:
        super.onMessage(connection, message);
    }
  }

  async onChatMessage(onFinish: StreamTextOnFinishCallback<ToolSet>) {
    const model = getDefaultModel(this.env);
    // const sessionId = this.name;
    const lastestMessage = this.messages?.[this.messages.length - 1];
    const userInput = lastestMessage?.content;
    const dataStreamResponse = createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model,
          messages: this.messages,
          tools: this.getTools(),
          onFinish: (result) => {
            onFinish(result as any);
          },
          onError: (error: any) => {
            console.log("onStreamText error", error, error.stack);
            dataStream.writeData({ value: "Hello" });
          },
        });
        result.mergeIntoDataStream(dataStream);
      },
    });

    return dataStreamResponse;
  }
  onStateUpdate(state, source: "server" | Connection) {
    // console.log(`${source} state updated`, state);
  }

  getTools() {
    return { ...tools, ...this.toolGenShortVideo() };
  }

  @callable()
  async search1(query: string) {
    // Uses Vector store results filtered by Metadata limited
    // To this agent
    // const results = await searchMenusByAgent(query, this.name);
    // return results.map((result) => result.metadata.restaurantName);
    return { data: "searchRestaurants fake results" };
  }
  @callable()
  async callWorkflow1(query: string) {
    return { data: "callWorkflow1 fake results" };
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
        type: "runSchedule",
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
            // const a = `0:${JSON.stringify(part.text)}\n`;
            // console.log("a", a);
            dataStream.write(`0:${JSON.stringify(part.text)}\n`);
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

  toolGenShortVideo() {
    return {
      genShortVideo: tool({
        description: "生成短视频",
        parameters: z.object({
          topic: z.string().describe("短视频主题"),
        }),
        execute: async ({ topic }) => {
          try {
            let shortAgId = this.state.subAgents?.[AgentNames.shortVideoAg];
            if (!shortAgId) {
              shortAgId = generateId();
            }
            const shortVideoAgent = await getAgentByName<Env, ShortVideoAg>(
              this.env.ShortVideoAg,
              shortAgId,
            );

            this.setState({
              ...this.state,
              subAgents: {
                ...this.state.subAgents,
                [AgentNames.shortVideoAg]: shortAgId,
              },
            });
            // ! Fixme: 工具调用,应尽可能返回文本
            const result = await shortVideoAgent.onGenShortVideo(topic);
            return result;
          } catch (e: any) {
            console.error("toolGenShortVideo error", e);
            return `运行出错: ${e.message}, ${e.stack}`;
          }
        },
      }),
    };
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

  // 演示, 直接调用另外一个 agent
  async demoCallAgent() {
    const workerAgent = await getAgentByName<Env, WorkerAgent>(this.env.WorkerAgent, "default");
    // const id = this.env.WorkerAgent.idFromName("default");
    // const workerAgent = this.env.WorkerAgent.get(id);

    if (!workerAgent) {
      // throw new Error("Worker agent not found");
      this.handleException(new Error("Worker agent not found"));
    }
    workerAgent.log("log message from worker agent");
    await workerAgent.callAdkAgent("shortvideo_agent", {
      role: "user",
      parts: [
        {
          type: "text",
          text: "call adk agent example",
        },
      ],
    });
  }

  @callable()
  async onCallSmalagent(task: string) {
    await this.pushTask("small_agent", {
      task,
    });
  }
}
