import { createLazyFileRoute } from "@tanstack/react-router";
import { useAgent } from "agents/react";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import type { RootAgentState } from "../../../agent_state/root_agent_state";
import type { IncomingMessage, McpServer, OutgoingMessage } from "../../../agent_state/shared";
export const Route = createLazyFileRoute("/session/root_ag/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [state, setState] = useState<RootAgentState>();

  const agent = useAgent<RootAgentState>({
    agent: "root_ag",
    name: "my-agent",
    onStateUpdate: (newState) => setState(newState),
    onMessage: (message) => {
      const parsedMessage = JSON.parse(message.data) as OutgoingMessage;
      if (parsedMessage?.type === "connected") {
        console.log("agent client connected");
      } else if (parsedMessage.type === "run-schedule") {
        console.log("run schedule", parsedMessage);
      } else if (parsedMessage?.type === "error") {
        console.log("error", parsedMessage);
      } else if (parsedMessage?.type === "schedule") {
        console.log("schedule", parsedMessage);
      } else if (parsedMessage?.type === "demo-event-response") {
        console.log("demo-event-response", parsedMessage);
      } else {
        console.log("scheduler client, 未知错误", message);
      }
    },
  });
  const increment = () => {
    //@ts-ignore
    agent.setState({
      ...state,
      counter: (state?.counter ?? 0) + 1,
      text: "new text",
      color: "red",
    });
  };
  return (
    <div>
      3333333333333
      <div>Count: {state?.counter}</div>
      <Button onClick={increment}>Increment</Button>
      <Button
        onClick={() => {
          agent.send(
            JSON.stringify({
              type: "demo-event-1",
              data: "hello",
            } satisfies IncomingMessage),
          );
        }}
      >
        send demo event
      </Button>
      <McpServerView agent={agent} />
      {state?.currentMcpServer && <CurrentMcpServerView mcpServer={state.currentMcpServer} />}
    </div>
  );
}

interface McpServerViewProps {
  agent: ReturnType<typeof useAgent<RootAgentState>>;
}
const McpServerView = ({ agent }: McpServerViewProps) => {
  const demoMcpServerUrl = "https://mcp-server-demo.com";

  const handleAddMcpServer = () => {
    agent.send(
      JSON.stringify({
        type: "add-mcp-server",
        data: {
          url: demoMcpServerUrl,
          state: "ready",
        },
      } satisfies IncomingMessage),
    );
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        {/* <input type="text" ref={mcpInputRef} className="mcp-input" placeholder="MCP Server URL" /> */}
        <Button type="button" onClick={handleAddMcpServer}>
          Add MCP Server
        </Button>
      </div>
    </div>
  );
};

interface CurrentMcpServerViewProps {
  mcpServer: McpServer;
}
const CurrentMcpServerView = ({ mcpServer }: CurrentMcpServerViewProps) => {
  return (
    <div className="flex flex-row gap-2 bg-blue-100 p-2 rounded-md">
      <div>{mcpServer.url}</div>
    </div>
  );
};
