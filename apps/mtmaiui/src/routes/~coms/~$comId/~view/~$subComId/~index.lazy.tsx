import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "mtxuilib/ui/sheet";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "../../../../../hooks/useNav";
import { useTeamBuilderStore } from "../../../../../stores/teamBuildStore";
import { ComponentEditor } from "../../../../components/views/team/builder/component-editor/component-editor";

export const Route = createLazyFileRoute("/coms/$comId/view/$subComId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { subComId } = useParams();

  const [open, setOpen] = useState(true);
  const loadFromJson = useTeamBuilderStore((x) => x.loadFromJson);
  const team = useTeamBuilderStore((x) => x.team);
  useEffect(() => {
    if (team) {
      const { nodes: initialNodes, edges: initialEdges } = loadFromJson(
        // team.component,
        team,
      );
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
    handleValidate();

    return () => {
      // console.log("cleanup component");
      setValidationResults(null);
    };
  }, [team, setNodes, setEdges]);
  const syncToJson = useTeamBuilderStore((x) => x.syncToJson);

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
  return (
    <div>
      sub component editor: {subComId}
      <Sheet open={open} onOpenChange={setOpen}>
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
    </div>
  );
}
