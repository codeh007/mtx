import { createLazyFileRoute } from "@tanstack/react-router";
import { AdkEventsView } from "../AdkEventsView";
import AgentChatView from "../AgentChatView";

export const Route = createLazyFileRoute("/adk/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  return (
    <>
      <AgentChatView sessionId={sessionId} />

      <AdkEventsView sessionId={sessionId} />
    </>
  );
}
