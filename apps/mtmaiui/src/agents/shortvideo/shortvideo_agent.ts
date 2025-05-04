import type { Connection, ConnectionContext } from "agents";
import {
  type StreamTextOnFinishCallback,
  type ToolSet,
  createDataStreamResponse,
  streamText,
} from "ai";
import { experimental_createMCPClient, generateText } from "ai";
import type {
  ShortVideoAgentState,
  ShortVideoInMessage,
} from "../../agent_state/shortvideo_agent_state";
import { getDefaultModel } from "../../components/cloudflare-agents/model";
import { ChatAgentBase } from "../ChatAgentBase";
import { tools } from "../tools";

const mcpServerUrl = "https://colab-7860.yuepa8.com/sse";

export class ShortVideoAg extends ChatAgentBase<Env, ShortVideoAgentState> {
  initialState = {
    mtmai_api_endpoint: mcpServerUrl,
    video_subject: "",
  } satisfies ShortVideoAgentState;

  onStart(): void | Promise<void> {}
  onConnect(connection: Connection, ctx: ConnectionContext) {}
  onClose(connection: Connection) {}

  async onMessage(connection: Connection, message: string): Promise<void> {
    const event = JSON.parse(message) as ShortVideoInMessage;
    if (event.type === "shortvideo_topic") {
      console.log("shortvideo_topic", event);
      return;
    }
    return super.onMessage(connection, message);
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
      if (userInput?.startsWith("/test1")) {
        await this.onTest1();
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
}
