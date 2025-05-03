import { createLazyFileRoute } from "@tanstack/react-router";
import { useAgent } from "agents/react";
import type { RootAgentState } from "mtmaiapi";
// import { OutgoingMessage } from "http";
// import { RootAgentState } from "mtmaiapi";
import { useState } from "react";
import type { OutgoingMessage } from "../../agent_state/shared";
import { CfAgentChatView } from "../../components/chatv2/CfAgentChatView";
// import type { RootAgentState } from "../../agent_state/root_agent_state";
// import type { IncomingMessage, OutgoingMessage } from "../../agent_state/shared";
// import AgentChatView from "../../components/cloudflare-agents/Chat";
// import { useMtSession } from "../../stores/SessionProvider";

export const Route = createLazyFileRoute("/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [rootState, setRootState] = useState<RootAgentState>();

  const rootAgent = useAgent<RootAgentState>({
    agent: "root_ag",
    name: "default1",

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
      color: "red",
    });
  };

  // const session = useMtSession();

  // useEffect(() => {
  //   if (session.data) {
  //     rootAgent.send(
  //       JSON.stringify({
  //         type: "set-user-session",
  //         data: session.data,
  //       } satisfies IncomingMessage),
  //     );
  //   }
  // }, [session, rootAgent]);

  return (
    <>
      {/* <ChatClient /> */}
      <div className="flex gap-2">
        <div className="flex-1 w-full">
          {/* <div className="flex gap-2">
            <DebugValue data={session} />

            <Button onClick={increment}>Increment:({rootState?.counter})</Button>
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

            <Button
              onClick={() => {
                console.log("call adk demo");
                rootAgent.send(
                  JSON.stringify({
                    type: "call-adk",
                    data: "hello call adk",
                  } satisfies IncomingMessage),
                );
              }}
            >
              call adk demo
            </Button>
            <McpServerView agent={rootAgent} />
            {rootState?.currentMcpServer && (
              <CurrentMcpServerView mcpServer={rootState.currentMcpServer} />
            )}
          </div> */}
          {/* <Chat /> */}
          {/* <AgentChatView /> */}
          <CfAgentChatView />
        </div>
      </div>
    </>
  );
}
