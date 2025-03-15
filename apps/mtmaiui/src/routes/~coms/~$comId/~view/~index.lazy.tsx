import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { comsGetOptions } from "mtmaiapi";
import { useTenantId } from "../../../../hooks/useAuth";
import { TeamBuilder } from "../../../components/views/team/builder/builder";

export const Route = createLazyFileRoute("/coms/$comId/view/")({
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
    <>
      <div className="flex flex-col gap-4 w-full h-full">
        <TeamBuilder team={teamQuery.data} />
      </div>
    </>
  );
}
