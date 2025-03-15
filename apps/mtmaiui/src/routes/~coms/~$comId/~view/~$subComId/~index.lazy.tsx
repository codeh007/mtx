import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "mtxuilib/ui/sheet";
import { useCallback, useState } from "react";
import { useNav, useParams } from "../../../../../hooks/useNav";
import { useTeamBuilderStore } from "../../../../../stores/teamBuildStore";
import { ComponentEditor } from "../../../../components/views/team/builder/component-editor/component-editor";

export const Route = createLazyFileRoute("/coms/$comId/view/$subComId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { subComId } = useParams();
  const nav = useNav();
  const [open, setOpen] = useState(true);
  const loadFromJson = useTeamBuilderStore((x) => x.loadFromJson);
  const team = useTeamBuilderStore((x) => x.team);
  const syncToJson = useTeamBuilderStore((x) => x.syncToJson);
  const nodes = useTeamBuilderStore((x) => x.nodes);
  const edges = useTeamBuilderStore((x) => x.edges);
  const updateNode = useTeamBuilderStore((x) => x.updateNode);
  const selectedNodeId = useTeamBuilderStore((x) => x.selectedNodeId);
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      const component = syncToJson();
      if (!component) {
        throw new Error("Unable to generate valid configuration(handleSave)");
      }

      // if (onChange) {
      //   const teamData: Partial<Team> = team
      //     ? {
      //         ...team,
      //         component,
      //         created_at: undefined,
      //         updated_at: undefined,
      //       }
      //     : { component };
      //   await onChange(teamData);
      //   resetHistory();
      // }
    } catch (error) {
      // messageApi.error(
      //   error instanceof Error
      //     ? error.message
      //     : "Failed to save team configuration",
      // );
    }
  }, [syncToJson]);

  // const handleClose = () => {
  //   setOpen(false);
  //   setSelectedNode(null);
  //   nav({ to: ".." });
  // };

  return (
    <>
      {/* sub component editor: {subComId} */}
      <Sheet
        open={!!selectedNodeId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNode(null);
          }
        }}
      >
        <SheetContent>
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
