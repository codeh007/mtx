import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { comsGetOptions } from "mtmaiapi";
import { TeamBuilder } from "../../../components/autogen_views/team/builder/builder";
import { useTenant } from "../../../hooks/useAuth";

export const Route = createLazyFileRoute("/team/$teamId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { teamId } = Route.useParams();
  const tenant = useTenant();
  if (!tenant) {
    return null;
  }
  const teamQuery = useSuspenseQuery({
    ...comsGetOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
      query: {
        com: teamId,
      },
    }),
  });

  return (
    <>
      <TeamBuilder team={teamQuery.data} />
    </>
  );
}
