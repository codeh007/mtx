import { Hono } from "hono";
import type { Env } from "../../types";
import { WsContext } from "./wsContextHandler";

export const wsApp = new Hono<{ Bindings: Env }>().get(
  "/ws",
  async (c, events) => handleWsRequest(c.req.raw, c.env, c.executionCtx),
);

export function handleWsRequest(request: Request, env, ctx) {
  const upgradeHeader = request.headers.get("Upgrade");
  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);
  server.accept();
  const wsctx = new WsContext(client, server);
  wsctx.handshark();

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
