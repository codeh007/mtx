import { Hono } from "hono";
import { DemoMcpServer } from "../agents/demoMcpServer";

const mcpSseRoute = new Hono<{ Bindings: Env }>();

mcpSseRoute.all("/*", (c) => {
  const handler = DemoMcpServer.mount("/sse", { binding: "DemoMcpServer" });
  const response = handler.fetch(c.req.raw, c.env, c.executionCtx);
  return response;
});

export default mcpSseRoute;
