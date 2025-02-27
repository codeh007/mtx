"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import { Handle, type NodeProps, Position, useEdges } from "@xyflow/react";
import { useWorkflowPanelStore } from "../../../../../store/WorkflowPanelStore";
import type { NodeAdderNode } from "./types";

export function NodeAdderNode({ id, parentId }: NodeProps<NodeAdderNode>) {
	const edges = useEdges();
	const setWorkflowPanelState = useWorkflowPanelStore(
		(state) => state.setWorkflowPanelState,
	);

	return (
		<div>
			<Handle
				type="source"
				position={Position.Bottom}
				id="a"
				className="opacity-0"
			/>
			<Handle
				type="target"
				position={Position.Top}
				id="b"
				className="opacity-0"
			/>
			<div
				className="rounded-full bg-slate-50 p-2"
				onClick={() => {
					const previous = edges.find((edge) => edge.target === id)?.source;
					const disableLoop = Boolean(parentId);
					setWorkflowPanelState({
						active: true,
						content: "nodeLibrary",
						data: {
							previous: previous ?? null,
							next: id,
							parent: parentId,
							connectingEdgeType: "default",
							disableLoop,
						},
					});
				}}
			>
				<PlusIcon className="h-12 w-12 text-slate-950" />
			</div>
		</div>
	);
}
