import type { Session } from "@auth/core/types";
import type { Connection, ConnectionContext } from "agents";
import { Agent } from "agents";
import type { AgentContext } from "agents";
import { MCPClientManager } from "agents/mcp/client";
import type { RootAgentState } from "../agent_state/root_agent_state";
import type { McpServer } from "../agent_state/shared";
import type { IncomingMessage, OutgoingMessage } from "../agent_state/shared";

export class RootAg extends Agent<Env, RootAgentState> {
  mcpClientManager = new MCPClientManager("mcp-clients", "1.0.0");

  initialState = {
    counter: 0,
    text: "root ag text",
    color: "#3B82F6",
    mainViewType: "chat",
    chatHistoryIds: [],
    mcpServers: {},
    mcpTools: [],
    mcpPrompts: [],
    mcpResources: [],
  } satisfies RootAgentState;

  constructor(ctx: AgentContext, env: Env) {
    console.log("root ag constructor", ctx, env);
    super(ctx, env);
  }

  onStart(): void | Promise<void> {
    console.log("root ag onStart");
    // const session = await getAuthUser(this.ctx);
    // console.log("session", session);
  }
  onConnect(connection: Connection, ctx: ConnectionContext) {
    // const auth = ctx.request.headers.get("authorization");
    // console.log("auth", auth);

    connection.send(
      JSON.stringify({
        type: "connected",
        data: {
          message: "Hello, world! connected",
        },
      } satisfies OutgoingMessage),
    );
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
    const event = JSON.parse(message) as IncomingMessage;

    if (event.type === "schedule") {
      //       const result = await generateObject({
      //         model,
      //         mode: "json",
      //         schemaName: "task",
      //         schemaDescription: "A task to be scheduled",
      //         schema: unstable_scheduleSchema, // <- the shape of the object that the scheduler expects
      //         maxRetries: 5,
      //         prompt: `${unstable_getSchedulePrompt({
      //           date: new Date(),
      //         })}
      // Input to parse: "${event.input}"`,
      //       });
      //       const { when, description } = result.object;
      //       if (when.type === "no-schedule") {
      //         connection.send(
      //           JSON.stringify({
      //             type: "error",
      //             data: `No schedule provided for ${event.input}`,
      //           } satisfies OutgoingMessage)
      //         );
      //         return;
      //       }
      //       const schedule = await this.schedule(
      //         when.type === "scheduled"
      //           ? when.date!
      //           : when.type === "delayed"
      //             ? when.delayInSeconds!
      //             : when.cron!,
      //         "onTask",
      //         description
      //       );
      //       connection.send(
      //         JSON.stringify({
      //           type: "schedule",
      //           data: convertScheduleToScheduledItem(schedule),
      //         } satisfies OutgoingMessage)
      //       );
    } else if (event.type === "delete-schedule") {
      await this.cancelSchedule(event.id);
    } else if (event.type === "demo-event-1") {
      await this.onDemoEvent1(event.data);
    } else if (event.type === "set-mcp-server") {
      await this.onSetMcpServer(event.data);
    } else if (event.type === "set-user-session") {
      await this.onSetUserSession(event.data);
    } else {
      console.log("root ag unknown message", event);
    }
  }

  async onSetMcpServer(playload: McpServer) {
    console.log("setMcpServer", playload);
    this.setState({
      ...this.state,
      currentMcpServer: playload,
    });
  }

  async onSetUserSession(session: Session) {
    console.log("(root ag) setUserSession", session);
  }
  async refreshMcpServerData() {
    console.log("my-mcp-agent refreshServerData");
    this.setState({
      ...this.state,
      mcpPrompts: this.mcpClientManager.listPrompts(),
      mcpTools: this.mcpClientManager.listTools(),
      mcpResources: this.mcpClientManager.listResources(),
    });
  }
  async onDemoEvent1(payload: unknown) {
    this.broadcast(
      JSON.stringify({
        type: "demo-event-response",
        data: payload,
      } satisfies OutgoingMessage),
    );
  }
}
