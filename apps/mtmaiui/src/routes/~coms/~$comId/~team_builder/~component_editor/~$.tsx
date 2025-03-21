import { createFileRoute } from "@tanstack/react-router";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useTeamBuilderStore } from "../../../../../stores/teamBuildStore";

export const Route = createFileRoute(
  "/coms/$comId/team_builder/component_editor/$",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const selectedNode = useTeamBuilderStore((x) => x.selectedNode);
  return (
    <div className="bg-red-200">
      <h1>unknown component</h1>
      <DebugValue data={selectedNode} />
    </div>
  );
}
