import type { Connection, ConnectionContext, Schedule } from "agents";
import { unstable_callable } from "agents";
import {
  type DataStreamWriter,
  type Message,
  type StreamTextOnFinishCallback,
  type ToolSet,
  createDataStreamResponse,
  generateId,
  generateText,
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
import { toolGenShortVideo, toolQueryTasksToRun, toolSmolagent } from "../agent_utils/tools2";
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
      // source.send(
      //   JSON.stringify({
      //     type: "state_update",
      //     data: state,
      //   } satisfies OutgoingMessage),
      // );
      if (state.enabledAutoDispatch) {
        const response = await this.startAutoDispatch();
        // this._reply();
      } else {
        await this.stopAutoDispatch();
      }
    }
  }

  async startAutoDispatch() {
    // this.log("自动调度已开启");

    if (!this.messages?.length) {
      // this.log("至少有一条聊天信息, 才能正常工作.");
      this.messages = [
        {
          id: generateId(),
          role: "user",
          content: "请自动完成任务调度, 我已经离开 UI, 你不要打扰我, 尽你最大的能力自动运行!",
        } satisfies Message,
      ];
      await this.saveMessages(this.messages);
      return;
    }

    try {
      const model = getDefaultModel(this.env);
      // const lastestMessage = this.messages?.[this.messages.length - 1];
      // const userInput = lastestMessage?.content;
      const dataStreamResponse = createDataStreamResponse({
        execute: async (dataStream) => {
          // const messages: Message[] = [
          //   ...this.messages,
          //   {
          //     id: generateId(),
          //     role: "user",
          //     content: "你好",
          //   },
          // ];
          const result = streamText({
            model,
            experimental_telemetry: { isEnabled: true },
            // messages: this.messages,
            messages: [
              {
                role: "system",
                content: `你是具备自动化任务调度的后台,根据聊天上下文自动调用对应的工具完成任务.

**背景描述**
当用户点击UI 中的"自动操作"按钮, 会触发 agent state 中的 enabledAutoDispatch=true 状态.
此时用户希望你处于后台不间断的进行任务调度.

**注意**
1: 你可以输出对话信息,但是不要期待用户会回复和反馈, 而是尽可能的调用工具完成任务.

**流程说明**
1:如果从对话上下文中,无法判断要执行什么任务, 就调用相关的工具查询需要执行的任务
2:如果确信已经没有必要继续了,回复: "TERMINAL"

**判断结束依据**
1: 当聊天上下文有大量重复,且没意义的对话时, 可以认为已经没有必要继续了
2: 当工具出现大量错误时, 可以认为已经没有必要继续了

**工具说明**
* queryTasksToRun: 用于获取需要执行的任务, 当你不知道要做什么时,调用这个工具看看.

`,
              },
              ...this.messages,
              // ...messages,
            ],
            tools: {
              // ...tools,
              // ...toolGenShortVideo(this.env),
              ...toolSmolagent(this.env),
              ...toolQueryTasksToRun(this.env),
            },
            maxSteps: 10,
            onFinish: async (result) => {
              // onFinish(result as any);
              // this.log(`startAutoDispatch, onFinish, request: ${JSON.stringify(result.request)}`);
              this.log("onFinish, steps:", JSON.stringify(result.steps, null, 2));
              // this.log(`startAutoDispatch, onFinish, text: ${JSON.stringify(result.text)}`);
              this.log("onFinish, response:", JSON.stringify(result.response, null, 2));
              const finalMessages = appendResponseMessages({
                messages: this.messages || [],
                responseMessages: result.response.messages,
              });
              await this.persistMessages(finalMessages);
            },
            onError: (error: any) => {
              console.log("onStreamText error", error, error.stack);
              this.log(`onStreamText error: ${error}, ${error.stack}`);
              this.handleException(error);
              // dataStream.writeData({ value: "Hello" });
            },
          });
          result.mergeIntoDataStream(dataStream);
        },
      });
      await this.callLlmWriteStory();
    } catch (e: any) {
      this.handleException(e);
    }
  }

  async callLlmWriteStory() {
    // 另一个 llm 调用 (演示)
    const model = getDefaultModel(this.env);
    const result = await generateText({
      model: model,
      // prompt: "Write a short story about a cat.",
      experimental_telemetry: { isEnabled: true },
      messages: this.messages,
    });
    const messages222 = [
      ...this.messages,
      {
        id: generateId(),
        role: "assistant",
        content: result.text,
        parts: [
          {
            type: "text",
            text: result.text,
          },
        ],
      } satisfies Message,
    ];
    await this.saveMessages(messages222);
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
