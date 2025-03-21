import { createFileRoute } from "@tanstack/react-router";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import {
  ModelContent,
  ModelHeader,
  ModelTitle,
  MtModal,
} from "../../../../stores/model.store";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";
import { ComponentEditor } from "../../../components/views/team/builder/component-editor/component-editor";

export const Route = createFileRoute(
  "/coms/$comId/component_editor/AssistantAgent",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const selectedNode = useTeamBuilderStore((x) => x.selectedNode);
  const handleChange = useTeamBuilderStore((x) => x.updateNode);
  return (
    <MtModal>
      <ModelContent>
        <ModelHeader>
          <ModelTitle>assistant agent</ModelTitle>
        </ModelHeader>
        <DebugValue data={selectedNode?.data.component} />
        <ComponentEditor
          component={selectedNode?.data.component}
          onChange={handleChange}
        />
      </ModelContent>
    </MtModal>
  );
}
