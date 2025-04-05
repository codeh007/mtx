import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { agStateListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/$sessionId/team_state/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const tid = useTenantId();
  const setTeamState = useWorkbenchStore((x) => x.setTeamState);

  const agStateQuery = useQuery({
    ...agStateListOptions({
      path: {
        tenant: tid!,
      },
      query: {
        // chat: sessionId,
      },
    }),
  });

  // useEffect(() => {
  //   if (agStateQuery.data) {
  //     setTeamState(agStateQuery.data);
  //   }
  // }, [agStateQuery.data, setTeamState]);
  return (
    <>
      <DebugValue data={{ agState: agStateQuery.data }} />
      {/* {agStateQuery.data?.state?.type === StateType.TEAM_STATE && (
        <TeamStateView teamState={agStateQuery.data.state as TeamState} />
      )} */}
    </>
  );
}
