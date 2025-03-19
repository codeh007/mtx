import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "mtxuilib/ui/sheet";
import { useState } from "react";
import { useParams } from "../../../../../hooks/useNav";
import { useTeamBuilderStore } from "../../../../../stores/teamBuildStore";
import { ComponentEditor } from "../../../../components/views/team/builder/component-editor/component-editor";

export const Route = createLazyFileRoute("/coms/$comId/view/$subComId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { subComId } = useParams();
  const nav = Route.useNavigate();
  const [open, setOpen] = useState(true);
  const loadFromJson = useTeamBuilderStore((x) => x.loadFromJson);
  const team = useTeamBuilderStore((x) => x.component);
  const syncToJson = useTeamBuilderStore((x) => x.syncToJson);
  const nodes = useTeamBuilderStore((x) => x.nodes);
  const edges = useTeamBuilderStore((x) => x.edges);
  const updateNode = useTeamBuilderStore((x) => x.updateNode);
  const selectedNodeId = useTeamBuilderStore((x) => x.selectedNodeId);
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
  const handleSave = useTeamBuilderStore((x) => x.handleSave);

  const handleClose = () => {
    setOpen(false);
    setSelectedNode(null);
    nav({ to: ".." });
  };

  return (
    <>
      <Sheet open={!!selectedNodeId} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-5xl">
          <SheetHeader>
            <SheetTitle>Edit Component</SheetTitle>
          </SheetHeader>
          {nodes.find((n) => n.id === subComId)?.data.component && (
            <ComponentEditor
              component={nodes.find((n) => n.id === subComId)!.data.component}
              onChange={(updatedComponent) => {
                // console.log("builder updating component", updatedComponent);
                if (selectedNodeId) {
                  updateNode(selectedNodeId, {
                    component: updatedComponent,
                  });
                  handleSave();
                }
              }}
              // onClose={() => setSelectedNode(null)}
              navigationDepth={true}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
