import { createLazyFileRoute } from "@tanstack/react-router";
import { useTeamBuilderStore } from "../../../stores/teamBuildStore";

import { TeamBuilder } from "../../components/views/team/builder/builder";
export const Route = createLazyFileRoute("/coms/$comId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const team = useTeamBuilderStore((x) => x.team);
  return (
    <>
      <TeamBuilder />
    </>
  );
}
