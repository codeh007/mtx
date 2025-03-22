import { createFileRoute } from "@tanstack/react-router";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import {
  ModelContent,
  ModelHeader,
  ModelTitle,
  MtModal,
} from "../../../../stores/model.store";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";

export const Route = createFileRoute("/coms/$comId/component_editor/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const selectedNode = useTeamBuilderStore((x) => x.selectedNode);
  return (
    <MtModal>
      <ModelContent>
        <ModelHeader>
          <ModelTitle>Unknown Component</ModelTitle>
        </ModelHeader>
        <div className="bg-red-200">
          <h1>unknown component</h1>
          <DebugValue data={selectedNode} />
        </div>
      </ModelContent>
    </MtModal>
  );
}
