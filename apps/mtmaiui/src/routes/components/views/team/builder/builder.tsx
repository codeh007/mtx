import { DragOverlay } from "@dnd-kit/core";
import {
  Background,
  type Connection,
  MiniMap,
  ReactFlow,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MonacoEditor } from "mtxuilib/mt/monaco";
import { Button } from "mtxuilib/ui/button";
import { useCallback, useEffect, useRef } from "react";
import { useTeamBuilderStore } from "../../../../../stores/teamBuildStore";
import type { Team } from "../../types/datamodel";
import "./builder.css";
import { edgeTypes, nodeTypes } from "./nodes";
import { TeamBuilderToolbar } from "./toolbar";
import type { CustomEdge } from "./types";

interface TeamBuilderProps {
  onChange?: (team: Partial<Team>) => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
}

export const TeamBuilder = ({
  onChange,
  onDirtyStateChange,
}: TeamBuilderProps) => {
  const nodes = useTeamBuilderStore((state) => state.nodes);
  const setNodes = useTeamBuilderStore((state) => state.setNodes);
  const edges = useTeamBuilderStore((state) => state.edges);
  const setEdges = useTeamBuilderStore((state) => state.setEdges);
  const showGrid = useTeamBuilderStore((x) => x.showGrid);
  const setShowGrid = useTeamBuilderStore((x) => x.setShowGrid);
  const showMiniMap = useTeamBuilderStore((x) => x.showMiniMap);
  const setShowMiniMap = useTeamBuilderStore((x) => x.setShowMiniMap);
  const editorRef = useRef(null);
  const isJsonMode = useTeamBuilderStore((x) => x.isJsonMode);
  const setIsJsonMode = useTeamBuilderStore((x) => x.setIsJsonMode);
  const isFullscreen = useTeamBuilderStore((x) => x.isFullscreen);
  const setIsFullscreen = useTeamBuilderStore((x) => x.setIsFullscreen);
  // const validationLoading = useTeamBuilderStore((x) => x.validationLoading);
  const setValidationLoading = useTeamBuilderStore(
    (x) => x.setValidationLoading,
  );
  // const validationResults = useTeamBuilderStore((x) => x.validationResults);
  const setValidationResults = useTeamBuilderStore(
    (x) => x.setValidationResults,
  );
  const {
    undo,
    redo,
    loadFromJson,
    syncToJson,
    addNode,
    layoutNodes,
    resetHistory,
    history,
    updateNode,
  } = useTeamBuilderStore();

  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
  const addToHistory = useTeamBuilderStore((x) => x.addToHistory);
  const team = useTeamBuilderStore((x) => x.team);
  const isDirty = useTeamBuilderStore((x) => x.isDirty);
  const currentHistoryIndex = useTeamBuilderStore(
    (state) => state.currentHistoryIndex,
  );

  // Compute undo/redo capability from history state
  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;
  const activeDragItem = useTeamBuilderStore((x) => x.activeDragItem);
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds: CustomEdge[]) => addEdge(params, eds)),
    [setEdges],
  );

  // Need to notify parent whenever isDirty changes
  useEffect(() => {
    onDirtyStateChange?.(isDirty);
  }, [isDirty, onDirtyStateChange]);

  // Add beforeunload handler when dirty
  useEffect(() => {
    if (isDirty) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [isDirty]);

  // Load initial config
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

  // Handle JSON changes
  // const handleJsonChange = useCallback(
  //   debounce((value: string) => {
  //     try {
  //       const config = JSON.parse(value);
  //       // Always consider JSON edits as changes that should affect isDirty state
  //       loadFromJson(config, false);
  //       // Force history update even if nodes/edges appear same
  //       addToHistory();
  //     } catch (error) {
  //       console.error("Invalid JSON:", error);
  //     }
  //   }, 1000),
  //   [loadFromJson],
  // );

  // Cleanup debounced function
  // useEffect(() => {
  //   return () => {
  //     handleJsonChange.cancel();
  //     setValidationResults(null);
  //   };
  // }, [handleJsonChange]);

  const handleValidate = useCallback(async () => {
    const component = syncToJson();
    if (!component) {
      throw new Error("Unable to generate valid configuration(handleValidate)");
    }

    try {
      setValidationLoading(true);
      // const validationResult = await validationAPI.validateComponent(component);

      // setValidationResults(validationResult);
      // if (validationResult.is_valid) {
      //   messageApi.success("Validation successful");
      // }
    } catch (error) {
      console.error("Validation error:", error);
      // messageApi.error("Validation failed");
    } finally {
      setValidationLoading(false);
    }
  }, [syncToJson, setValidationLoading]);

  // Handle save
  const handleSave = useCallback(async () => {
    const component = syncToJson();
    if (!component) {
      throw new Error("Unable to generate valid configuration(handleSave)");
    }

    if (onChange) {
      const teamData: Partial<Team> = team
        ? {
            ...team,
            component,
            created_at: undefined,
            updated_at: undefined,
          }
        : { component };
      await onChange(teamData);
      resetHistory();
    }
  }, [syncToJson, onChange, resetHistory, team]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, [setIsFullscreen]);

  // TODO: 这里需要注意,暂时删除了. subscribe
  // React.useEffect(() => {
  //   const unsubscribe = useTeamBuilderStore.subscribe((state) => {
  //     setNodes(state.nodes);
  //     setEdges(state.edges);
  //     // console.log("nodes updated", state);
  //   });
  //   return unsubscribe;
  // }, [setNodes, setEdges]);

  // const validateDropTarget = (
  //   draggedType: ComponentTypes,
  //   targetType: ComponentTypes,
  // ): boolean => {
  //   const validTargets: Record<ComponentTypes, ComponentTypes[]> = {
  //     model: ["team", "agent"],
  //     tool: ["agent"],
  //     agent: ["team"],
  //     team: [],
  //     termination: ["team"],
  //   };
  //   return validTargets[draggedType]?.includes(targetType) || false;
  // };

  return (
    <div className="h-full flex-1">
      <div className=" relative h-[calc(100vh-239px)] flex-1">
        <div className=" rounded bg-amber-100 w-full h-full">
          <div className="relative rounded w-full h-full">
            <div
              className={`w-full h-full transition-all duration-200 ${
                isFullscreen
                  ? "fixed inset-4 z-50 shadow bg-tertiary  backdrop-blur-sm"
                  : ""
              }`}
            >
              {isJsonMode ? (
                <MonacoEditor
                  value={JSON.stringify(syncToJson(), null, 2)}
                  onChange={handleJsonChange}
                  editorRef={editorRef}
                  language="json"
                  minimap={false}
                />
              ) : (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  // onNodesChange={onNodesChange}
                  // onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={(_, node) => setSelectedNode(node.id)}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  onDrop={(event) => event.preventDefault()}
                  onDragOver={(event) => event.preventDefault()}
                  className="rounded"
                  fitView
                  fitViewOptions={{ padding: 10 }}
                >
                  {showGrid && <Background />}
                  {showMiniMap && <MiniMap />}
                </ReactFlow>
              )}
            </div>
            {isFullscreen && (
              <Button
                variant="ghost"
                className="fixed inset-0 -z-10 bg-background bg-opacity-80 backdrop-blur-sm"
                onClick={handleToggleFullscreen}
              />
            )}
            <TeamBuilderToolbar
              isJsonMode={isJsonMode}
              isFullscreen={isFullscreen}
              showGrid={showGrid}
              onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
              canUndo={canUndo}
              canRedo={canRedo}
              isDirty={isDirty}
              onToggleView={() => setIsJsonMode(!isJsonMode)}
              onUndo={undo}
              onRedo={redo}
              onSave={handleSave}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onToggleFullscreen={handleToggleFullscreen}
              onAutoLayout={layoutNodes}
            />
          </div>
        </div>
      </div>
      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeDragItem ? (
          <div className="p-1 h-full rounded bg-slate-100 border border-dashed border-slate-400">
            <div className="flex items-center gap-2">
              {activeDragItem.icon}
              <span className="text-sm">{activeDragItem.label}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </div>
  );
};
