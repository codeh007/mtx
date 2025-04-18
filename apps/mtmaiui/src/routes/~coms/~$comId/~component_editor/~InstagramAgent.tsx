import { createFileRoute } from "@tanstack/react-router";
import { ComponentEditor } from "../../../../components/component-editor/component-editor";
import {
  ModelContent,
  ModelHeader,
  ModelTitle,
  MtModal,
  useModelStore,
} from "../../../../stores/model.store";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";

export const Route = createFileRoute(
  "/coms/$comId/component_editor/InstagramAgent",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const selectedNode = useTeamBuilderStore((x) => x.selectedNode);
  const updateNode = useTeamBuilderStore((x) => x.updateNode);
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
  const setOpen = useModelStore((x) => x.setOpen);
  if (!selectedNode?.data.component) {
    return <div>no component selected</div>;
  }
  return (
    <MtModal>
      <ModelContent>
        <ModelHeader>
          <ModelTitle>instagram agent</ModelTitle>
        </ModelHeader>
        <ComponentEditor
          component={selectedNode?.data.component}
          onChange={(updatedComponent) => {
            if (selectedNode?.id) {
              updateNode(selectedNode.id, {
                component: updatedComponent,
              });
            }
          }}
          onClose={() => {
            setSelectedNode(null);
            setOpen(false);
            // nav({
            //   to: `/coms/${comId}`,
            // });
            window.history.back();
          }}
          navigationDepth={true}
        />
      </ModelContent>
    </MtModal>
  );
}
