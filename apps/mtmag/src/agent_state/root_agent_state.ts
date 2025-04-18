import type { Prompt, Resource, Tool } from "@modelcontextprotocol/sdk/types.js";
import type { McpServer } from "./shared";

export type RootAgentState = {
  counter: number;
  text: string;
  color: string;
  mainViewType: "chat" | "scheduler";
  chatHistoryIds: string[];

  // mcp client settings
  mcpServers: Record<string, McpServer>;
  mcpTools: (Tool & { serverId: string })[];
  mcpPrompts: (Prompt & { serverId: string })[];
  mcpResources: (Resource & { serverId: string })[];
  currentMcpServer?: McpServer;
};
