import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { agStateGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../hooks/useAuth";
import { ChatClient } from "../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const tid = useTenantId();
  const agStateQuery = useQuery({
    ...agStateGetOptions({
      path: {
        tenant: tid!,
      },
      query: {
        chat: sessionId,
      },
    }),
  });
  return (
    <>
      <DebugValue data={{ data: agStateQuery.data, sessionId }} />
      <ChatClient />
    </>
  );
}
