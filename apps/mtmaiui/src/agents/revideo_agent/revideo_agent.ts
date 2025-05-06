import type { Connection, ConnectionContext, Schedule } from "agents";
import { unstable_getSchedulePrompt, unstable_scheduleSchema } from "agents/schedule";
import {
  type StreamTextOnFinishCallback,
  type ToolSet,
  createDataStreamResponse,
  generateId,
  generateObject,
  streamText,
} from "ai";
import { experimental_createMCPClient, generateText } from "ai";
import { connection } from "next/server";
import type { ShortVideoInMessage } from "../../agent_state/shortvideo_agent_state";
import { getDefaultModel } from "../../components/cloudflare-agents/model";
import { ChatAgentBase } from "../ChatAgentBase";
import { tools } from "../tools";
import type { ShortVideoAgentState } from "./revideo_state";

export class RevidioAg extends ChatAgentBase<Env, ShortVideoAgentState> {
  initialState = {
    video_subject: "",
    // schedules: [],
    scheduleFinished: [] as Schedule<string>[],
  } satisfies ShortVideoAgentState;

  onStart(): void | Promise<void> {}
  onConnect(connection: Connection, ctx: ConnectionContext) {}
  onClose(connection: Connection) {}

  async onMessage(connection: Connection, message: string): Promise<void> {
    this.log("onMessage", message);
    const event = JSON.parse(message) as ShortVideoInMessage;
    const eventType = event.type;
    this.log("onMessage", eventType);
    switch (eventType) {
      case "revideo_topic":
        console.log("revideo_topic", event);
        break;
      case "run_workflow_revideo":
        await this.onRunWorkflowRevideo(connection, event);
        break;
      default:
        return super.onMessage(connection, message);
    }
  }

  async onChatMessage(
    onFinish: StreamTextOnFinishCallback<ToolSet>,
    options?: { abortSignal?: AbortSignal },
  ) {
    this.log("(onChatMessage)开始");
    const mcpClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: mcpServerUrl,
      },
    });
    try {
      const model = getDefaultModel(this.env);
      const lastestMessage = this.messages?.[this.messages.length - 1];
      const userInput = lastestMessage?.content;
      this.log("userInput", userInput);
      if (userInput?.startsWith("/test1")) {
        this.log("onTest1");
        await this.onTest1();
      } else if (userInput?.startsWith("/test2")) {
        this.log("onTest2");
        await this.onTest2(connection);
      } else if (userInput?.startsWith("/reset")) {
        this.log("onReset");
        await this.onReset();
      } else {
        this.log("onChatMessage");
        await mcpClient.init();
        const mcptools = await mcpClient.tools();

        const dataStreamResponse = createDataStreamResponse({
          execute: async (dataStream) => {
            const result = streamText({
              model,
              messages: this.messages,
              tools: { ...tools, ...mcptools },
              onFinish: (result) => {
                onFinish(result);
              },
              onError: (error) => {
                this.handleException(error);
              },
            });
            result.mergeIntoDataStream(dataStream);
          },
        });
        return dataStreamResponse;
      }
    } catch (error) {
      this.handleException(error);
    } finally {
      await mcpClient.close();
      this.log("对话结束, mcpClient closed");
    }
  }

  async onTest1() {
    const model = getDefaultModel(this.env);
    try {
      const client = await experimental_createMCPClient({
        transport: {
          type: "sse",
          url: mcpServerUrl,
        },
      });

      const tools = await client.tools();
      this.log("tools", JSON.stringify(tools));

      const response = await generateText({
        model: model,
        tools,
        messages: [{ role: "user", content: "结合你可以获取的工具, 告诉我你能做什么?" }],
      });
      await client.close();
      this.log("response", response.text);
    } catch (error) {
      this.handleException(error);
    }

    // this.log(`(自定义库)开始连接 mcp server: ${mcpServerUrl}`);
    // const mcpClient = new MCPClientManager("mcp-clients", "1.11.0");

    // const { id, authUrl } = await mcpClient.connect(mcpServerUrl);
    // this.log("连接完成, 开始获取工具");
    // const tools4 = mcpClient.listTools();
    // this.log("tools4", JSON.stringify(tools4));

    // this.log(`开始连接 mcp server: ${mcpServerUrl}`);
    // // await this.mcp.connect(mcpServerUrl);
    // // 问题: 官方例子,确实时使用 mcp.connect 连接服务器的, 但是 提示 超时,可能因为版本问题导致的.
    // const { id, authUrl } = await this.mcp.connect(mcpServerUrl);
    // this.log("连接完成, 开始获取工具");
    // const tools3 = this.mcp.unstable_getAITools();
    // this.log("tools3", JSON.stringify(tools3));
    // const tools2 = this.mcp.listTools();
    // this.log("tools2", JSON.stringify(tools2));

    // const mcpClient = await createMCPClient({
    //   transport: {
    //     type: "sse",
    //     url: mcpServerUrl,
    //   },
    // });
    // const response = await generateText({
    //   model: model,
    //   tools: await mcpClient.tools(), // use MCP tools
    //   prompt: `立即调用 "greet" 工具, 传入参数:"你好"`,
    // });
    // this.log("response", response.text);
  }
  async onTest2(connection: Connection) {
    this.log("onTest2 启动");
    const userInput = "请在20秒后, 生成一个视频, 视频的主题是: 如何使用llm 生成一个视频";
    const model = getDefaultModel(this.env);
    //步骤1: 通过llm 生成计划任务数据
    const result = await generateObject({
      model,
      mode: "json",
      schemaName: "task",
      schemaDescription: "A task to be scheduled",
      schema: unstable_scheduleSchema, // <- the shape of the object that the scheduler expects
      maxRetries: 5,
      prompt: `${unstable_getSchedulePrompt({
        date: new Date(),
      })} 
Input to parse: "${userInput}"`,
    });
    const { when, description } = result.object;
    if (when.type === "no-schedule") {
      this.notifyError(`No schedule provided for ${userInput}`, connection);
      return;
    }

    // 将任务安排放到队列
    const schedule = await this.schedule(
      when.type === "scheduled"
        ? when.date!
        : when.type === "delayed"
          ? when.delayInSeconds!
          : when.cron!,
      "onTask",
      description,
    );

    //通知客户端
    this.notifySchedule(schedule, connection);
  }

  async onTest3(connection: Connection) {
    this.log("onTest3 启动");
    // schedule a task to run every 10 seconds
    // const { id } = await this.schedule("*/20 * * * *", "someTask", { message: "hello" });

    // schedule a task to run in 10 seconds
    const task = await this.schedule(10, "someTask", { message: "hello" });
    this.setState({
      schedules: [...this.state.schedules, task],
    });
  }

  async someTask(params: { message: string }) {
    this.log("someTask启动", params);
    this.setState({
      schedules: this.state.schedules.filter((t) => t.id !== params.id),
      scheduleFinished: [...this.state.scheduleFinished, params.id],
    });
  }

  async onRunWorkflowShortvideo(connection: Connection, event: any) {
    this.log("onRunWorkflowShortvideo启动");

    const exampleCase = `
在没有小红书的年代，成为网红并不容易，而绿茶旅社里来来往往的游客就成了初代网红成功出圈的重要推手。随着入住的游客越来越多，“绿茶旅社”的餐饮服务也因为游客们的口口相传形成口碑。2008年，绿茶旅社彻底转型成绿茶餐厅，并且因其独特的中式装修风格和亲民的定价迅速吸引了众多消费者。根据媒体报道，当时首家绿茶餐厅还创下了单日14次的翻台纪录。
`;

    const workflowInstance = await this.env.SHORTVIDEO_WORKFLOW.create({
      id: generateId(),
      params: {
        prompt: exampleCase,
      },
    });
    this.log("workflowInstance", workflowInstance.id);
  }

  /**
   * 实际的任务调度
   * @param payload
   * @param schedule
   */
  async onTask(payload: unknown, schedule: Schedule<string>) {
    // this.notifySchedule(schedule);
    this.notifyRunSchedule(schedule);
  }

  async onReset() {
    //TODO: 重置状态
  }
}
