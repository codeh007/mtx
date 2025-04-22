import { createLazyFileRoute } from "@tanstack/react-router";
import AgentChatView from "../../../../components/chatv2/AgentChatView";
import { WorkbrenchProvider } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/adk/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  return (
    <>
      <WorkbrenchProvider sessionId={sessionId}>
        <AgentChatView sessionId={sessionId} />
      </WorkbrenchProvider>
    </>
  );
}
