import { Agent, type Connection, type ConnectionContext, type WSMessage } from "agents";
import type { WorkerAgentState } from "../agent_state/workerAgentState";

/**
 * 管理多个 worker 状态
 * 并且对接 聊天客户端 UI
 */
export class WorkerAgent extends Agent<Env, WorkerAgentState> {
  initialState: WorkerAgentState = {
    totalWorkers: 0,
    lastUpdated: new Date().getTime(),
  };

  // Called when a new Agent instance starts or wakes from hibernation
  async onStart() {
    console.log("Agent started with state:", this.state);
  }

  // Handle HTTP requests coming to this Agent instance
  // Returns a Response object
  async onRequest(request: Request): Promise<Response> {
    return new Response("Hello from worker Agent!");
  }

  // Called when a WebSocket connection is established
  // Access the original request via ctx.request for auth etc.
  async onConnect(connection: Connection, ctx: ConnectionContext) {
    // Connections are automatically accepted by the SDK.
    // You can also explicitly close a connection here with connection.close()
    // Access the Request on ctx.request to inspect headers, cookies and the URL
    this.setState({ ...this.state, totalWorkers: this.state.totalWorkers + 1 });
  }

  // Called for each message received on a WebSocket connection
  // Message can be string, ArrayBuffer, or ArrayBufferView
  async onMessage(connection: Connection, message: WSMessage) {
    // Handle incoming messages
    connection.send("Received your message");
  }

  // Handle WebSocket connection errors
  async onError(connection: Connection, error: unknown) {
    // console.error("Connection error:", error);
    this.setState({ ...this.state, error: error as string });
  }

  // Handle WebSocket connection close events
  async onClose(
    connection: Connection,
    code: number,
    reason: string,
    wasClean: boolean,
  ): Promise<void> {
    // console.log(`Connection closed: ${code} - ${reason}`);
    this.setState({ ...this.state, totalWorkers: this.state.totalWorkers - 1 });
  }

  onStateUpdate(state: WorkerAgentState, source: "server" | Connection) {
    console.log("State updated:", state, "Source:", source);
  }

  async customProcessingMethod(data: any) {
    this.setState({ ...this.state, lastUpdated: new Date().getTime() });
  }
}
