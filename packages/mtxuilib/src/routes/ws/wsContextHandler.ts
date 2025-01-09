import { generateUUID } from "../../lib/s-utils";

export class WsContext {
  private connectId: string | undefined;
  constructor(
    private client: WebSocket,
    private server: WebSocket,
  ) {
    this.connectId = generateUUID();
    server.addEventListener("close", (e) => {
      console.log("ws server on close");
    });
    server.addEventListener("message", (event) => {
      console.log(event.data);
    });
    server.addEventListener("error", (e) => {
      console.log("ws server on error:", e);
    });
  }

  emit(data: any) {
    if (typeof data === "string") {
      this.server.send(data);
      return;
    }

    const jsonStr = JSON.stringify(data);
    this.server.send(jsonStr);
  }
  handshark() {
    this.emit({
      connectId: this.connectId,
    });
  }

  onRunAgent(data) {}
}
