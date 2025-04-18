import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { MCPClientManager } from "agents/mcp/client";
import { DurableObjectOAuthClientProvider } from "agents/mcp/do-oauth-client-provider";
import { z } from "zod";
import type { MCPAgentState } from "../agent_state/mcp_agent_state";
import type { Env } from "../components/cloudflare-agents/env";
import { State } from "postgres";
export type Server = {
  url: string;
  state: "authenticating" | "connecting" | "ready" | "discovering" | "failed";
  authUrl?: string;
};

export class MyMCP extends McpAgent<Env, MCPAgentState, {}> {
  server = new McpServer({
    name: "mcp-agent",
    version: "1.0.0",
  });
  mcp = new MCPClientManager("mcp-agent", "1.0.0");

  initialState: MCPAgentState = {
    counter: 1,
    servers: {},
    tools: [],
    prompts: [],
    resources: [],
  };
  setServerState(id: string, state: Server) {
    this.setState({
      ...this.state,
      servers: {
        ...this.state.servers,
        [id]: state,
      },
    });
  }

  async refreshServerData() {
    this.setState({
      ...this.state,
      prompts: this.mcp.listPrompts(),
      tools: this.mcp.listTools(),
      resources: this.mcp.listResources(),
    });
  }
  async addMcpServer(url: string): Promise<string> {
    console.log(`Registering server: ${url}`);
    const authProvider = new DurableObjectOAuthClientProvider(
      this.ctx.storage,
      this.name,
      `${this.env.HOST}/agents/my-agent/${this.name}/callback`,
    );
    const { id, authUrl } = await this.mcp.connect(url, {
      transport: { authProvider },
    });
    this.setServerState(id, {
      url,
      authUrl,
      state: this.mcp.mcpConnections[id].connectionState,
    });
    if (this.mcp.mcpConnections[id].connectionState === "ready") {
      await this.refreshServerData();
    }
    return authUrl ?? "";
  }

  async init() {
    this.server.resource("counter", "mcp://resource/counter", (uri) => {
      return {
        contents: [{ uri: uri.href, text: String(this.state.counter) }],
      };
    });

    this.server.tool(
      "add",
      "Add to the counter, stored in the MCP",
      { a: z.number() },
      async ({ a }) => {
        this.setState({ ...this.state, counter: this.state.counter + a });

        return {
          content: [
            {
              type: "text",
              text: String(`Added ${a}, total is now ${this.state.counter}`),
            },
          ],
        };
      },
    );
  }
  onStateUpdate(state: State) {
    console.log({ stateUpdate: state });
  }
}

export default MyMCP.mount("/sse", {
  binding: "MyMCP",
});
