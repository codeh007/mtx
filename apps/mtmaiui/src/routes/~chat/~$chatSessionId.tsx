import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { sessionGetOptions } from "mtmaiapi";
import { useTenant } from "../../hooks/useAuth";
import ChatView from "./ag-chat/chat";

export const Route = createFileRoute("/session/$chatSessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatSessionId } = Route.useParams();

  const tenant = useTenant();

  const chatSession = useSuspenseQuery({
    ...sessionGetOptions({
      path: {
        tenant: tenant!.metadata.id,
        session: chatSessionId,
      },
    }),
  });
  return (
    <div>{chatSession.data && <ChatView session={chatSession.data} />}</div>
  );
}
