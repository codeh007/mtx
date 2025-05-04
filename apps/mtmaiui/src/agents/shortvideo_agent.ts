import type { Connection, ConnectionContext } from "agents";
import { Agent } from "agents";
import { MCPClientManager } from "agents/mcp/client";
import type {
  ShortVideoAgentState,
  ShortVideoInMessage,
} from "../agent_state/shortvideo_agent_state";
// import type { RootAgentState } from "../agent_state/root_agent_state";
// import type { McpServer } from "../agent_state/shared";
// import type { IncomingMessage, OutgoingMessage } from "../agent_state/shared";

export class ShortVideoAg extends Agent<Env, ShortVideoAgentState> {
  mcpClientManager = new MCPClientManager("mcp-clients", "1.0.0");
  initialState = {
    tts_api_endpoint: "",
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
  onRequest(request: Request): Response | Promise<Response> {
    const timestamp = new Date().toLocaleTimeString();
    return new Response(`Server time: ${timestamp} - Your request has been processed!`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  async onMessage(connection: Connection, message: string): Promise<void> {
    const event = JSON.parse(message) as ShortVideoInMessage;

    if (event.type === "schedule") {
    } else {
      console.log("root ag unknown message", event);
    }
  }
}
