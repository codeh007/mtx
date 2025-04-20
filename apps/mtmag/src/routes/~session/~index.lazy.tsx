import { createLazyFileRoute } from "@tanstack/react-router";
import Chat from "../../components/cloudflare-agents/playground/Chat";

import { useAgent } from "agents/react";
import { Button } from "mtxuilib/ui/button";
import { useEffect, useState } from "react";
import type { RootAgentState } from "../../agent_state/root_agent_state";
import type { IncomingMessage, OutgoingMessage } from "../../agent_state/shared";
import { useMtSession } from "../../stores/SessionProvider";
import { CurrentMcpServerView, McpServerView } from "./McpServerView";

export const Route = createLazyFileRoute("/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [rootState, setRootState] = useState<RootAgentState>();

  const rootAgent = useAgent<RootAgentState>({
    agent: "root_ag",
    name: "root_agent",

    onStateUpdate: (newState) => setRootState(newState),

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
      } else if (parsedMessage?.type === "require-main-access-token") {
        console.log("require-main-access-token", parsedMessage);
      } else {
        console.log("scheduler client, 未知错误", message);
      }
    },
  });
  const increment = () => {
    //@ts-ignore
    rootAgent.setState({
      ...rootState,
      counter: (rootState?.counter ?? 0) + 1,
      text: "new text",
      color: "red",
    });
  };

  const session = useMtSession();

  useEffect(() => {
    console.log("session", session);
    if (session.data) {
      rootAgent.send(
        JSON.stringify({
          type: "set-user-session",
          data: session.data,
        } satisfies IncomingMessage),
      );
    }
  }, [session, rootAgent]);

  return (
    <>
      {/* <ChatClient /> */}
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <div className="flex gap-2">
        {/* <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Scheduler</h2>
          <Scheduler addToast={addToast} />
        </div> */}
        {/* <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">State Sync Demo</h2>
          <Stateful addToast={addToast} />
        </div> */}
        {/* <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Email (wip)</h2>
          <Email addToast={addToast} />
        </div> */}
        <div>
          <div>Count: {rootState?.counter}</div>
          <Button onClick={increment}>Increment</Button>
          <Button
            onClick={() => {
              rootAgent.send(
                JSON.stringify({
                  type: "demo-event-1",
                  data: "hello",
                } satisfies IncomingMessage),
              );
            }}
          >
            send demo event
          </Button>
          <McpServerView agent={rootAgent} />
          {rootState?.currentMcpServer && (
            <CurrentMcpServerView mcpServer={rootState.currentMcpServer} />
          )}
        </div>
        <div className="flex-1 w-full">
          <Chat />
        </div>
      </div>
    </>
  );
}
