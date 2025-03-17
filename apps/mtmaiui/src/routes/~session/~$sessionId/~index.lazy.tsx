import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { agStateGetOptions } from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { useEffect } from "react";
import { useTenantId } from "../../../hooks/useAuth";
import { useSearch } from "../../../hooks/useNav";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { ChatClient } from "../../~play/~chat/chat/Chat.client";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const tid = useTenantId();
  const teamState = useWorkbenchStore((x) => x.teamState);
  const setTeamState = useWorkbenchStore((x) => x.setTeamState);
  const search = useSearch();
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
      {/* <DebugValue data={{ data: agStateQuery.data, sessionId }} /> */}
      {teamState && (
        <div>
          <CustomLink to={"state"} search={search}>
            state
          </CustomLink>
        </div>
      )}
      <ChatClient />
    </>
  );
}
