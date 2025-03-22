import { useQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { agentListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTenantId } from "../../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/agent")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  const tid = useTenantId();
  const agentsQuery = useQuery({
    ...agentListOptions({
      path: {
        tenant: tid,
      },
      query: {
        team: comId,
      },
    }),
  });
  return (
    <>
      <div>agent</div>
      <DebugValue data={agentsQuery.data} />
      <Outlet />
    </>
  );
}
