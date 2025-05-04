import type { Connection, ConnectionContext } from "agents";
import { MCPClientManager } from "agents/mcp/client";
import { experimental_createMCPClient as createMCPClient, generateText } from "ai";
import {
  type StreamTextOnFinishCallback,
  type ToolSet,
  createDataStreamResponse,
  streamText,
} from "ai";
import type {
  ShortVideoAgentState,
  ShortVideoInMessage,
} from "../agent_state/shortvideo_agent_state";
import { getDefaultModel } from "../components/cloudflare-agents/model";
import { ChatAgentBase } from "./ChatAgentBase";
import { tools } from "./tools";

export class ShortVideoAg extends ChatAgentBase<Env, ShortVideoAgentState> {
  mcpClientManager = new MCPClientManager("mcp-clients", "1.0.0");
  initialState = {
    mtmai_api_endpoint: "https://colab-7860.yuepa8.com",
    video_subject: "",
  } satisfies ShortVideoAgentState;

  onStart(): void | Promise<void> {}
  onConnect(connection: Connection, ctx: ConnectionContext) {
    // const auth = ctx.request.headers.get("authorization");
    // console.log("auth", auth);
  }

  onClose(connection: Connection) {
    console.log("root ag disconnected:", connection.id);
  }

  async onMessage(connection: Connection, message: string): Promise<void> {
    const event = JSON.parse(message) as ShortVideoInMessage;
    if (event.type === "shortvideo_topic") {
      console.log("shortvideo_topic", event);
      return;
    }
    return super.onMessage(connection, message);
  }

  async onChatMessage(onFinish: StreamTextOnFinishCallback<ToolSet>) {
    const model = getDefaultModel(this.env);
    const lastestMessage = this.messages?.[this.messages.length - 1];
    const userInput = lastestMessage?.content;
    this.log("userInput", userInput);
    if (userInput?.startsWith("/test1")) {
      const mcpClient = await createMCPClient({
        transport: {
          type: "sse",
          url: "https://colab-7860.yuepa8.com/sse",
        },
      });
      const response = await generateText({
        model: model,
        tools: await mcpClient.tools(), // use MCP tools
        prompt: `立即调用 "greet" 工具, 传入参数:"你好"`,
      });
      this.log("response", response.text);
    } else {
      // cloudflare agents 的 streamText 的实现
      const dataStreamResponse = createDataStreamResponse({
        execute: async (dataStream) => {
          const result = streamText({
            model,
            messages: this.messages,
            tools: { ...tools },
            onFinish: (result) => {
              onFinish(result);
            },
            onError: (error) => {
              console.log("onStreamText error", error);
            },
          });
          result.mergeIntoDataStream(dataStream);
        },
      });

      return dataStreamResponse;
    }
  }
}
