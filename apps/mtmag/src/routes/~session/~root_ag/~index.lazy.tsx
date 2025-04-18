import { createLazyFileRoute } from "@tanstack/react-router";
import { useAgent } from "agents/react";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import type { RootAgentState } from "../../../agent_state/root_agent_state";
import type {
  IncomingMessage,
  OutgoingMessage,
} from "../../../components/cloudflare-agents/shared";
export const Route = createLazyFileRoute("/session/root_ag/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [state, setState] = useState({ counter: 0 });

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
    agent.setState({
      ...state,
      counter: state.counter + 1,
      text: "new text",
      color: "red",
    });
  };
  return (
    <div>
      <div>Count: {state.counter}</div>
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
    </div>
  );
}
