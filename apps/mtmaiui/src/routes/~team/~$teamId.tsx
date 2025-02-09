import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { teamGetOptions } from "mtmaiapi";
import { useTenant } from "../../hooks/useAuth";
import { TeamBuilder } from "../components/views/team/builder/builder";

export const Route = createFileRoute("/team/$teamId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { teamId } = Route.useParams();
  // const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const tenant = useTenant();
  const teamQuery = useSuspenseQuery({
    ...teamGetOptions({
      path: {
        tenant: tenant!.metadata.id,
        team: teamId,
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
