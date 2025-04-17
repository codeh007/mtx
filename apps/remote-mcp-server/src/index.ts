import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import app from "mtxuilib/mcp_server/app.js";
import { z } from "zod";
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Demo",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "add",
      { a: z.number(), b: z.number() },
      async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }],
      }),
    );
    this.server.resource("counter", "mcp://resource/counter", (uri) => {
      return {
        contents: [{ uri: uri.href, text: "hello123 resource" }],
      };
    });
    //export type PromptCallback<Args extends undefined | PromptArgsRawShape = undefined> = Args extends PromptArgsRawShape ? (args: z.objectOutputType<Args, ZodTypeAny>, extra: RequestHandlerExtra) => GetPromptResult | Promise<GetPromptResult> : (extra: RequestHandlerExtra) => GetPromptResult | Promise<GetPromptResult>;

    this.server.prompt("review-code", { code: z.string() }, ({ code }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please review this code:\n\n${code}`,
          },
        },
      ],
    }));
  }
}

// Export the OAuth handler as the default
export default new OAuthProvider({
  apiRoute: "/sse",
  // TODO: fix these types
  // @ts-ignore
  apiHandler: MyMCP.mount("/sse"),
  // @ts-ignore
  defaultHandler: app,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/token",
  clientRegistrationEndpoint: "/register",
});
