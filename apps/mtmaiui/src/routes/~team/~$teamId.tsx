import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { comsGetOptions } from "mtmaiapi";
import { useTenant } from "../../hooks/useAuth";
import { TeamBuilder } from "../components/views/team/builder/builder";

export const Route = createFileRoute("/team/$teamId")({
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
        com: teamId,
      },
    }),
  });

  return (
    <>
      <TeamBuilder
        team={teamQuery.data}
        // onChange={handleSaveTeam}
        // onDirtyStateChange={setHasUnsavedChanges}
      />
    </>
  );
}
