import { createLazyFileRoute } from "@tanstack/react-router";
import { useTeamBuilderStore } from "../../../../../stores/teamBuildStore";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/component")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const componentId = useTeamBuilderStore((x) => x.componentId);
  return <>component editor {componentId}</>;
}
