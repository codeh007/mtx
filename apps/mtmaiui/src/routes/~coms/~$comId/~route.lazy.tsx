import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { comsGetOptions } from "mtmaiapi";
import { useTenantId } from "../../../hooks/useAuth";
import { TeamBuilderProvider } from "../../../stores/teamBuildStore";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/coms/$comId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  const tid = useTenantId();
  const teamQuery = useSuspenseQuery({
    ...comsGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        com: comId,
      },
    }),
  });
  return (
    <WorkbrenchProvider>
      <TeamBuilderProvider team={teamQuery.data}>
        <Outlet />
      </TeamBuilderProvider>
    </WorkbrenchProvider>
  );
}
