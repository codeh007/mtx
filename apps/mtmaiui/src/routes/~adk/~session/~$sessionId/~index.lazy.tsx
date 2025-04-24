import { createLazyFileRoute } from "@tanstack/react-router";
import AgentChatView from "../../../../components/chatv2/AgentChatView";

export const Route = createLazyFileRoute("/adk/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AgentChatView />
    </>
  );
}
