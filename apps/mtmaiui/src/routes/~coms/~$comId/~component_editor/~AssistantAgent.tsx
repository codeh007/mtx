import { createFileRoute } from "@tanstack/react-router";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useNav } from "../../../../hooks/useNav";
import {
  ModelContent,
  ModelHeader,
  ModelTitle,
  MtModal,
  useModelStore,
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
  const updateNode = useTeamBuilderStore((x) => x.updateNode);
  // const handleSave = useTeamBuilderStore((x) => x.handleSave);
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
  const comId = useTeamBuilderStore((x) => x.componentId);

  // const open = useModelStore((x) => x.open);
  const setOpen = useModelStore((x) => x.setOpen);
  const nav = useNav();
  if (!selectedNode?.data.component) {
    return <div>no component selected</div>;
  }
  return (
    <MtModal>
      <ModelContent>
        <ModelHeader>
          <ModelTitle>assistant agent</ModelTitle>
        </ModelHeader>
        <DebugValue data={selectedNode?.data.component} />
        <ComponentEditor
          component={selectedNode?.data.component}
          onChange={(updatedComponent) => {
            // console.log("builder updating component", updatedComponent);
            if (selectedNode?.id) {
              updateNode(selectedNode.id, {
                component: updatedComponent,
              });
              // handleSave();
            }
          }}
          onClose={() => {
            setSelectedNode(null);
            setOpen(false);
            nav({
              to: `/coms/${comId}`,
            });
          }}
          navigationDepth={true}
        />
      </ModelContent>
    </MtModal>
  );
}
