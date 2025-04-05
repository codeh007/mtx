import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { agStateListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { AgStateView } from "../../../../components/team_state/AgStateView";
import { useTenantId } from "../../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/$sessionId/team_state/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const tid = useTenantId();
  const setTeamState = useWorkbenchStore((x) => x.setTeamState);

  const agStateListQuery = useQuery({
    ...agStateListOptions({
      path: {
        tenant: tid!,
      },
      query: {
        session: sessionId,
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
      <DebugValue data={{ agState: agStateListQuery.data }} />
      {/* {agStateQuery.data?.state?.type === StateType.TEAM_STATE && (
        <TeamStateView teamState={agStateQuery.data.state as TeamState} />
      )} */}

      {agStateListQuery.data?.rows?.map((x) => (
        <AgStateView key={x.metadata.id} state={x} />
      ))}
    </>
  );
}
