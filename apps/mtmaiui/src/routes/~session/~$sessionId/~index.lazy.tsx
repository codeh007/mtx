import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatClient } from "../../../components/chat/Chat.client";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { sessionId } = Route.useParams();
  // const tid = useTenantId();
  // const setTeamState = useWorkbenchStore((x) => x.setTeamState);

  return (
    <>
      <ChatClient />
    </>
  );
}
