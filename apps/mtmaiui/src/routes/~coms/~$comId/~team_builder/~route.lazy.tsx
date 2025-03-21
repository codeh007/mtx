import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";

export const Route = createLazyFileRoute("/coms/$comId/team_builder")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  const selectedNode = useTeamBuilderStore((x) => x.selectedNode);
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
  const updateNode = useTeamBuilderStore((x) => x.updateNode);
  const handleSave = useTeamBuilderStore((x) => x.handleSave);
  return (
    <>
      <Outlet />
    </>
  );
}
