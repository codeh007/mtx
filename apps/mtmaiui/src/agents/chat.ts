import type { Connection, ConnectionContext, Schedule } from "agents";
import { unstable_callable } from "agents";
import {
  type DataStreamWriter,
  type Message,
  type StreamTextOnFinishCallback,
  type ToolSet,
  createDataStreamResponse,
  generateId,
  streamText,
} from "ai";
import { sql } from "drizzle-orm";

import type {
  ChatAgentIncomingMessage,
  ChatAgentOutgoingMessage,
  ChatAgentState,
} from "../agent_state/chat_agent_state";
import type { OutgoingMessage } from "../agent_state/shared";
import { toolGenShortVideo, toolSmolagent } from "../agent_utils/tools2";
import { getDefaultModel } from "../components/cloudflare-agents/model";
import { ChatAgentBase } from "./ChatAgentBase";
import { tools } from "./tools";
import { convertScheduleToScheduledItem } from "./utils";
export class Chat extends ChatAgentBase<Env, ChatAgentState> {
  initialState: ChatAgentState = {
    lastUpdated: 0,
    subAgents: {},
    enabledDebug: true,
    // 是否自动调度
    enabledAutoDispatch: true,
  };

  async onStart(): Promise<void> {
    globalThis.Hyperdrive = this.env.HYPERDRIVE;
    try {
      await this.getDb().execute(
        sql`SELECT * from upsert_agent(
        p_name  => ${"chat"}::text,
        p_id    => ${this.name}::text,
        p_type  => ${"cfagent"}::text
      )`,
      );
    } catch (e: any) {
      this.handleException(e);
    }
  }
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
      case "new_chat_participant": {
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
      }
      case "schedule":
        this.onRunSchedule(event.data);
        break;
      default:
        super.onMessage(connection, message);
    }
  }

  async onChatMessage(onFinish: StreamTextOnFinishCallback<ToolSet>) {
    try {
      const model = getDefaultModel(this.env);
      // const lastestMessage = this.messages?.[this.messages.length - 1];
      // const userInput = lastestMessage?.content;
      const dataStreamResponse = createDataStreamResponse({
        execute: async (dataStream) => {
          const result = streamText({
            model,
            messages: this.messages,
            tools: {
              ...tools,
              ...toolGenShortVideo(this.env),
              ...toolSmolagent(this.env),
              // ...toolSchedule(this.env, this, this.onSchedule, userInput),
            },
            onFinish: (result) => {
              onFinish(result as any);
            },
            onError: (error: any) => {
              // console.log("onStreamText error", error, error.stack);
              this.log(`onStreamText error: ${error.message}, ${error.stack}`);
              dataStream.writeData({ value: "Hello" });
            },
          });
          result.mergeIntoDataStream(dataStream);
        },
      });

      return dataStreamResponse;
    } catch (e: any) {
      // this.log(`onChatMessage error: ${e.message}, ${e.stack}`);
      this.handleException(e);
      // return dataStreamResponse;
    }
  }
  onStateUpdate(state, source: "server" | Connection) {
    // console.log(`${source} state updated`, state);
  }

  @unstable_callable()
  async onRunSchedule(schedule: any) {
    try {
      this.log(`onRunSchedule: ${JSON.stringify(schedule)}`);
      const result = await this.schedule(30, "log", { message: "hello计划任务" });
      const schedules = await this.getSchedules();
      this.log(`schedules list: ${JSON.stringify(result)}\n${JSON.stringify(schedules)}\n`);
      return schedules;
    } catch (e: any) {
      this.log(`onRunSchedule error: ${e.message}`);
    }
  }

  @unstable_callable()
  async listSchedules() {
    try {
      const schedules = await this.getSchedules();
      this.log(`listSchedules: ${JSON.stringify(schedules)}`);
      return schedules;
    } catch (e: any) {
      this.log(`listSchedules error: ${e.message}`);
      return [];
    }
  }

  /**
   * 当到时间运行新任务时, 会先进入这个函数
   * 这个函数负责完整最终的任务调用
   * @param payload
   * @param schedule
   */
  async onTask(payload: unknown, schedule: Schedule<string>) {
    // 调用任务的几个可能性:
    // 1. 同一个 agent 内的调度
    // 2. 基于 pgmq 消息队列的任务调度

    // 广播任务信息, 这样,所有在同一个 房间的客户端都可以接收到信息,从而可以自主运行实际的任务.
    this.broadcast(
      JSON.stringify({
        type: "runSchedule",
        data: convertScheduleToScheduledItem(schedule),
      } satisfies OutgoingMessage),
    );
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
}
