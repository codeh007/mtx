import type { Prompt, Resource, Tool } from "@modelcontextprotocol/sdk/types.js";
import type { UIMessage } from "ai";
import type { McpServer } from "./shared";

export type RootAgentState = {
  counter: number;
  color: string;
  mainViewType: "chat" | "scheduler";
  chatHistoryIds: string[];

  // mcp client settings
  mcpServers: Record<string, McpServer>;
  mcpTools: (Tool & { serverId: string })[];
  mcpPrompts: (Prompt & { serverId: string })[];
  mcpResources: (Resource & { serverId: string })[];
  currentMcpServer?: McpServer;

  //
  mainAccessToken?: string;
  agentRunnerUrl?: string;
};

export type AgentRunRequest = {
  app_name: string;
  user_id: string;
  session_id: string;
  new_message: UIMessage;
  streaming: boolean;
};
