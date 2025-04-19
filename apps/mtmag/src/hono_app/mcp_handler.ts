import { Hono } from "hono";
import { DemoMcpServer } from "../agents/demoMcpServer";

const mcpSseRoute = new Hono<{ Bindings: Env }>();

// const handler = DemoMcpServer.mount("/mcp/sse");

mcpSseRoute.all("/sse", (c) => {
  const handler = DemoMcpServer.mount("/mcp/sse", { binding: "DemoMcpServer" });
  const response = handler.fetch(c.req.raw, c.env, c.executionCtx);
  return response;
});

export default mcpSseRoute;
