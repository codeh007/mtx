"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Download, Play, Save } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { useNav } from "../../../../hooks/useNav";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";
import { TeamBuilderToolbar } from "../../../components/views/team/builder/toolbar";
import { ValidationErrors } from "../../../components/views/team/builder/validationerrors";
import {
  DashHeaders,
  HeaderActionConainer,
} from "../../../../components/DashContent";

interface TeamBuilderHeaderProps {
  comId: string;
}
export function TeamBuilderHeader({ comId }: TeamBuilderHeaderProps) {
  const isDirty = useTeamBuilderStore((x) => x.isDirty);
  const validationResults = useTeamBuilderStore((x) => x.validationResults);
  const handleSave = useTeamBuilderStore((x) => x.handleSave);
  const nav = useNav();
  const isJsonMode = useTeamBuilderStore((x) => x.isJsonMode);
  const isFullscreen = useTeamBuilderStore((x) => x.isFullscreen);
  const showGrid = useTeamBuilderStore((x) => x.showGrid);
  const showMiniMap = useTeamBuilderStore((x) => x.showMiniMap);
  const currentHistoryIndex = useTeamBuilderStore((x) => x.currentHistoryIndex);
  const history = useTeamBuilderStore((x) => x.history);
  const setShowMiniMap = useTeamBuilderStore((x) => x.setShowMiniMap);
  const setIsJsonMode = useTeamBuilderStore((x) => x.setIsJsonMode);
  const undo = useTeamBuilderStore((x) => x.undo);
  const redo = useTeamBuilderStore((x) => x.redo);
  const layoutNodes = useTeamBuilderStore((x) => x.layoutNodes);
  const setShowGrid = useTeamBuilderStore((x) => x.setShowGrid);
  const setIsFullscreen = useTeamBuilderStore((x) => x.setIsFullscreen);
  const component = useTeamBuilderStore((x) => x.component);

  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>编辑团队</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeaderActionConainer className="flex gap-2 text-xs rounded border-dashed items-center">
        <div className="flex items-center gap-2">
          {validationResults && !validationResults.is_valid && (
            <div className="inline-block mr-2">
              <ValidationErrors validation={validationResults} />
            </div>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const json = JSON.stringify(component, null, 2);
                  const blob = new Blob([json], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "team-config.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>下载</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSave}
                variant="outline"
                disabled={!isDirty}
                size="icon"
              >
                <div className="relative">
                  <Save className="size-4" />
                  {isDirty && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Save Team</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="w-16"
                // className="p-1.5 ml-2 px-2.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
                onClick={() => {
                  nav({ to: "/session", search: { comId } });
                }}
              >
                <Play className="size-4" /> Run
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Run Team</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </HeaderActionConainer>
    </DashHeaders>
  );
}
