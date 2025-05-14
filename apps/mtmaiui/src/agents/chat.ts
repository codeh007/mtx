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
import postgres from "postgres";

import { appendResponseMessages } from "ai";
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

const decoder = new TextDecoder();

export class Chat extends ChatAgentBase<Env, ChatAgentState> {
  initialState: ChatAgentState = {
    lastUpdated: 0,
    subAgents: {},
    enabledDebug: true,
    // 是否自动调度
    enabledAutoDispatch: true,
  };

  async onStart(): Promise<void> {
    const sql = postgres(this.env.HYPERDRIVE.connectionString);
    try {
      await sql`SELECT * from upsert_agent(
        p_name  => ${"chat"}::text,
        p_id    => ${this.name}::text,
        p_type  => ${"cfagent"}::text
      )`;
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
  // async onRequest(request: Request) {
  //   return super.onRequest(request);
  // }

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
  async onStateUpdate(state, source: "server" | Connection) {
    // console.log(`${source} state updated`, state);
    // this.log(`后端状态更新: ${JSON.stringify(state)}`);

    if (typeof source === "string") {
      // return;
    } else {
      source.send(
        JSON.stringify({
          type: "state_update",
          data: state,
        } satisfies OutgoingMessage),
      );
    }

    if (state.enabledAutoDispatch) {
      const response = await this.startAutoDispatch();
      this._reply();
    } else {
      await this.stopAutoDispatch();
    }
  }

  async startAutoDispatch() {
    this.log("自动调度已开启");

    try {
      const model = getDefaultModel(this.env);
      // const lastestMessage = this.messages?.[this.messages.length - 1];
      // const userInput = lastestMessage?.content;
      const dataStreamResponse = createDataStreamResponse({
        execute: async (dataStream) => {
          const result = streamText({
            model,
            // messages: this.messages,
            messages: [
              {
                role: "user",
                content: "你好,请自我介绍,你能做什么?",
              },
            ],
            tools: {
              ...tools,
              ...toolGenShortVideo(this.env),
              ...toolSmolagent(this.env),
              // ...toolSchedule(this.env, this, this.onSchedule, userInput),
            },
            onFinish: async (result) => {
              // onFinish(result as any);
              this.log(`startAutoDispatch, onFinish, request: ${JSON.stringify(result.request)}`);
              this.log(`startAutoDispatch, onFinish, steps: ${JSON.stringify(result.steps)}`);
              this.log(`startAutoDispatch, onFinish, text: ${JSON.stringify(result.text)}`);
              this.log(`startAutoDispatch, onFinish: ${JSON.stringify(result.response)}`);
              const finalMessages = appendResponseMessages({
                messages: this.messages,
                responseMessages: result.response.messages,
              });
              await this.persistMessages(finalMessages);
            },
            onError: (error: any) => {
              // console.log("onStreamText error", error, error.stack);
              this.log(`onStreamText error: ${error.message}, ${error.stack}`);
              // dataStream.writeData({ value: "Hello" });
            },
          });
          result.mergeIntoDataStream(dataStream);
        },
      });
      // const newId = generateId();
      const newId = "msg-ns0xeqqjHESZcpIsTX77Y2vc";
      await this.log("newId", newId);
      await this._reply(newId, dataStreamResponse);
      return dataStreamResponse;
    } catch (e: any) {
      // this.log(`onChatMessage error: ${e.message}, ${e.stack}`);
      this.handleException(e);
      // return dataStreamResponse;
    }
  }

  private _broadcastChatMessage(message: OutgoingMessage, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude);
  }
  private async _reply(id: string, response: Response) {
    this.log("_reply", id);
    // now take chunks out from dataStreamResponse and send them to the client
    // return this._tryCatchChat(async () => {
    // @ts-expect-error TODO: fix this type error
    for await (const chunk of response.body!) {
      const body = decoder.decode(chunk);
      this.log("_reply", body);
      this._broadcastChatMessage({
        id,
        type: "cf_agent_use_chat_response",
        body,
        done: false,
      });
    }

    this._broadcastChatMessage({
      id,
      type: "cf_agent_use_chat_response",
      body: "",
      done: true,
    });
    // });
  }

  async stopAutoDispatch() {
    this.log("自动调度已关闭");
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
