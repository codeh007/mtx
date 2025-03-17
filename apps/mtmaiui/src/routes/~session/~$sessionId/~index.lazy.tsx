import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { agStateGetOptions } from "mtmaiapi";
import { useEffect } from "react";
import { useTenantId } from "../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { ChatClient } from "../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const tid = useTenantId();
  const setTeamState = useWorkbenchStore((x) => x.setTeamState);
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

  useEffect(() => {
    if (agStateQuery.data) {
      setTeamState(agStateQuery.data);
    }
  }, [agStateQuery.data, setTeamState]);
  return (
    <>
      <ChatClient />
    </>
  );
}
