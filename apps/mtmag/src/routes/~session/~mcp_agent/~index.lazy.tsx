import { createLazyFileRoute } from "@tanstack/react-router";
import { agentFetch } from "agents/client";
import { useAgent } from "agents/react";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Button } from "mtxuilib/ui/button";
import { useRef, useState } from "react";
import type { MCPAgentState } from "../../../agent_state/mcp_agent_state";
export const Route = createLazyFileRoute("/session/mcp_agent/")({
  component: RouteComponent,
});

let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("sessionId", sessionId);
}

function RouteComponent() {
  const [isConnected, setIsConnected] = useState(false);
  const mcpInputRef = useRef<HTMLInputElement>(null);
  const [mcpAgentState, setMcpAgentState] = useState({
    counter: 0,
  } as MCPAgentState);

  const mcpAgent = useAgent<MCPAgentState>({
    agent: "mcp-agent",
    name: "mcp-agent",
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
    onStateUpdate: (state) => {
      setMcpAgentState(state);
    },
  });

  function openPopup(authUrl: string) {
    window.open(
      authUrl,
      "popupWindow",
      "width=600,height=800,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes",
    );
  }
  const handleMcpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mcpInputRef.current || !mcpInputRef.current.value.trim()) return;

    const serverUrl = mcpInputRef.current.value;
    agentFetch(
      {
        host: mcpAgent.host,
        agent: "my-agent",
        name: sessionId!,
        path: "add-mcp",
      },
      {
        method: "POST",
        body: JSON.stringify({ url: serverUrl }),
      },
    );
    setMcpAgentState({
      ...mcpAgentState,
      servers: {
        ...mcpAgentState.servers,
        placeholder: {
          url: serverUrl,
          state: "connecting",
        },
      },
    });
  };

  return (
    <div>
      <div>mcp agent</div>
      <DebugValue data={mcpAgentState} />
      <div className="container">
        <div className="status-indicator">
          <div className={`status-dot ${isConnected ? "connected" : ""}`} />
          {isConnected ? "Connected to server" : "Disconnected"}
        </div>

        <div className="mcp-servers">
          <form className="mcp-form" onSubmit={handleMcpSubmit}>
            <input
              type="text"
              ref={mcpInputRef}
              className="mcp-input"
              placeholder="MCP Server URL"
            />
            <Button type="submit">Add MCP Server</Button>
          </form>
        </div>

        <div className="mcp-section">
          <h2>MCP Servers</h2>

          {mcpAgentState?.servers &&
            Object.entries(mcpAgentState.servers).map(([id, server]) => (
              <div key={id} className={"mcp-server"}>
                <div>
                  <div>URL: {server.url}</div>
                  <div className="status-indicator">
                    <div
                      className={`status-dot ${server.state === "ready" ? "connected" : ""}`}
                    />
                    {server.state} (id: {id})
                  </div>
                </div>
                {server.state === "authenticating" && server.authUrl && (
                  <button
                    type="button"
                    onClick={() => openPopup(server.authUrl as string)}
                  >
                    Authorize
                  </button>
                )}
              </div>
            ))}
        </div>

        <div className="messages-section">
          <h2>Server Data</h2>
          <h3>Tools</h3>
          {mcpAgentState?.tools?.map((tool) => (
            <div key={`${tool.name}-${tool.serverId}`}>
              <b>{tool.name}</b>
              <pre className="code">{JSON.stringify(tool, null, 2)}</pre>
            </div>
          ))}

          <h3>Prompts</h3>
          {mcpAgentState?.prompts?.map((prompt) => (
            <div key={`${prompt.name}-${prompt.serverId}`}>
              <b>{prompt.name}</b>
              <pre className="code">{JSON.stringify(prompt, null, 2)}</pre>
            </div>
          ))}

          <h3>Resources</h3>
          {mcpAgentState?.resources?.map((resource) => (
            <div key={`${resource.name}-${resource.serverId}`}>
              <b>{resource.name}</b>
              <pre className="code">{JSON.stringify(resource, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
