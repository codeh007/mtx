import type { Connection, ConnectionContext, WSMessage } from "agents";
import { AIChatAgent } from "agents/ai-chat-agent";
import type { WorkerAgentState } from "../agent_state/workerAgentState";

/**
 * 管理多个 worker 状态
 * 并且对接 聊天客户端 UI
 */
export class WorkerAgent extends AIChatAgent<Env, WorkerAgentState> {
  initialState: WorkerAgentState = {
    totalWorkers: 0,
    lastUpdated: new Date().getTime(),
  };

  async onStart() {
    console.log("Agent started with state:", this.state);
  }

  async onRequest(request: Request): Promise<Response> {
    return new Response("Hello from worker Agent!");
  }

  async onConnect(connection: Connection, ctx: ConnectionContext) {}

  async onMessage(connection: Connection, message: WSMessage) {
    connection.send("Received your message");
  }

  // async onError(connection: Connection, error: unknown) {
  //   this.setState({ ...this.state, error: error as string });
  // }

  async onClose(
    connection: Connection,
    code: number,
    reason: string,
    wasClean: boolean,
  ): Promise<void> {
    this.setState({ ...this.state, totalWorkers: this.state.totalWorkers - 1 });
  }

  onStateUpdate(state: WorkerAgentState, source: "server" | Connection) {
    console.log("State updated:", state, "Source:", source);
  }

  log(message: string) {
    this.broadcast(
      JSON.stringify({
        type: "log",
        data: {
          level: "info",
          message,
        },
      }),
    );
  }
}
