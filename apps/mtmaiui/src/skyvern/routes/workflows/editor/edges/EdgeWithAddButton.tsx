"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  useNodes,
} from "@xyflow/react";
import { Button } from "mtxuilib/ui/button";
import { useWorkflowPanelStore } from "../../../../store/WorkflowPanelStore";
import { REACT_FLOW_EDGE_Z_INDEX } from "../constants";

export function EdgeWithAddButton({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const nodes = useNodes();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const setWorkflowPanelState = useWorkflowPanelStore(
    (state) => state.setWorkflowPanelState,
  );
  const sourceNode = nodes.find((node) => node.id === source);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
            zIndex: REACT_FLOW_EDGE_Z_INDEX + 1, // above the edge
          }}
          className="nodrag nopan"
        >
          <Button
            size="icon"
            className="h-4 w-4 rounded-full transition-all hover:scale-150"
            onClick={() => {
              const disableLoop = Boolean(sourceNode?.parentId);
              setWorkflowPanelState({
                active: true,
                content: "nodeLibrary",
                data: {
                  previous: source,
                  next: target,
                  parent: sourceNode?.parentId,
                  disableLoop,
                },
              });
            }}
          >
            <PlusIcon />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const edgeTypes = {
  edgeWithAddButton: EdgeWithAddButton,
};
