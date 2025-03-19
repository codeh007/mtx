import { DragOverlay } from "@dnd-kit/core";
import { Background, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MonacoEditor } from "mtxuilib/mt/monaco";
import { Button } from "mtxuilib/ui/button";
import { useRef } from "react";
import { useTeamBuilderStore } from "../../../../../stores/teamBuildStore";
import "./builder.css";
import { edgeTypes, nodeTypes } from "./nodes";
import { TeamBuilderToolbar } from "./toolbar";

export const TeamBuilder = () => {
  const nodes = useTeamBuilderStore((state) => state.nodes);
  const edges = useTeamBuilderStore((state) => state.edges);
  const showGrid = useTeamBuilderStore((x) => x.showGrid);
  const setShowGrid = useTeamBuilderStore((x) => x.setShowGrid);
  const showMiniMap = useTeamBuilderStore((x) => x.showMiniMap);
  const setShowMiniMap = useTeamBuilderStore((x) => x.setShowMiniMap);
  const editorRef = useRef(null);
  const isJsonMode = useTeamBuilderStore((x) => x.isJsonMode);
  const setIsJsonMode = useTeamBuilderStore((x) => x.setIsJsonMode);
  const isFullscreen = useTeamBuilderStore((x) => x.isFullscreen);
  const setIsFullscreen = useTeamBuilderStore((x) => x.setIsFullscreen);
  const history = useTeamBuilderStore((x) => x.history);
  const undo = useTeamBuilderStore((x) => x.undo);
  const redo = useTeamBuilderStore((x) => x.redo);
  const layoutNodes = useTeamBuilderStore((x) => x.layoutNodes);
  const teamJson = useTeamBuilderStore((x) => x.teamJson);
  const setSelectedNode = useTeamBuilderStore((x) => x.setSelectedNode);
  const isDirty = useTeamBuilderStore((x) => x.isDirty);
  const currentHistoryIndex = useTeamBuilderStore((x) => x.currentHistoryIndex);
  const activeDragItem = useTeamBuilderStore((x) => x.activeDragItem);
  const handleJsonChange = useTeamBuilderStore((x) => x.handleJsonChange);
  const onConnect = useTeamBuilderStore((x) => x.onConnect);
  const handleSave = useTeamBuilderStore((x) => x.handleSave);
  const onNodesChange = useTeamBuilderStore((x) => x.onNodesChange);
  const onEdgesChange = useTeamBuilderStore((x) => x.onEdgesChange);
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
                  value={teamJson}
                  onChange={handleJsonChange}
                  editorRef={editorRef}
                  language="json"
                  minimap={false}
                />
              ) : (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
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
                onClick={() => setIsFullscreen(!isFullscreen)}
              />
            )}
            <TeamBuilderToolbar
              isJsonMode={isJsonMode}
              isFullscreen={isFullscreen}
              showGrid={showGrid}
              onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
              canUndo={currentHistoryIndex > 0}
              canRedo={currentHistoryIndex < history.length - 1}
              isDirty={isDirty}
              onToggleView={() => setIsJsonMode(!isJsonMode)}
              onUndo={undo}
              onRedo={redo}
              onSave={handleSave}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
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
