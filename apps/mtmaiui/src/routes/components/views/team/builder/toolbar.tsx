import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Cable,
  Code2,
  Grid,
  LayoutGrid,
  Map,
  Maximize2,
  Minimize2,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";
import { Button } from "mtxuilib/ui/button";
import type React from "react";

interface TeamBuilderToolbarProps {
  isJsonMode: boolean;
  isFullscreen: boolean;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  onToggleView: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onToggleGrid: () => void;
  onToggleFullscreen: () => void;
  onAutoLayout: () => void;
  onToggleMiniMap: () => void;
}

export const TeamBuilderToolbar: React.FC<TeamBuilderToolbarProps> = ({
  isJsonMode,
  isFullscreen,
  showGrid,
  canUndo,
  canRedo,
  isDirty,
  onToggleView,
  onUndo,
  onRedo,
  onSave,
  onToggleGrid,
  onToggleFullscreen,
  onAutoLayout,
  onToggleMiniMap,
}) => {
  const menuItems: any = [
    {
      key: "autoLayout",
      label: "Auto Layout",
      icon: <LayoutGrid size={16} />,
      onClick: onAutoLayout,
    },
    {
      key: "grid",
      label: "Show Grid",
      icon: <Grid size={16} />,
      onClick: onToggleGrid,
    },
    {
      key: "minimap",
      label: "Show Mini Map",
      icon: <Map size={16} />,
      onClick: onToggleMiniMap,
    },
  ];

  return (
    <div
      className={`${
        isFullscreen ? "fixed top-6 right-6" : "absolute top-2 right-2"
      } bg-secondary hover:bg-secondary rounded shadow-sm min-w-[200px] z-[60]`}
    >
      <div className="p-1 flex items-center gap-1">
        {!isJsonMode && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  // icon={}
                  // className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onUndo}
                  disabled={!canUndo}
                  size="sm"
                >
                  <Undo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Undo</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  // className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onRedo}
                  disabled={!canRedo}
                  size="sm"
                >
                  <Redo2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Redo</span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  // className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
                  onClick={onToggleFullscreen}
                  size="sm"
                >
                  {isFullscreen ? (
                    <Minimize2 className="size-4" />
                  ) : (
                    <Maximize2 className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                </span>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              // className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onSave}
              size="sm"
              // disabled={!isDirty}
            >
              <div className="relative">
                <Save size={18} />
                {isDirty && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Save Changes</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              // icon={isJsonMode ? <Cable size={18} /> : <Code2 size={18} />}
              // className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
              onClick={onToggleView}
              size="sm"
            >
              {isJsonMode ? (
                <Cable className="size-4" />
              ) : (
                <Code2 className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{isJsonMode ? "Switch to Visual" : "Switch to JSON"}</span>
          </TooltipContent>
        </Tooltip>

        {/* {!isJsonMode && (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            overlayStyle={{ zIndex: 1001 }}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreHorizontal size={18} />}
              className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
              title="More Options"
            />
          </Dropdown>
        )} */}
      </div>
    </div>
  );
};

export default TeamBuilderToolbar;
