import type { MenuProps } from "antd";
import { Dropdown, Tooltip } from "antd";
import {
  Cable,
  Code2,
  Grid,
  LayoutGrid,
  Map,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";
import { Button } from "mtxuilib/ui/button";

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

export const TeamBuilderToolbar = ({
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
}: TeamBuilderToolbarProps) => {
  const menuItems: MenuProps["items"] = [
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
            <Tooltip title="Undo">
              <Button
                variant="ghost"
                className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 size={18} />
              </Button>
            </Tooltip>

            <Tooltip title="Redo">
              <Button
                variant="ghost"
                className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 size={18} />
              </Button>
            </Tooltip>
            <Tooltip
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              <Button
                variant="ghost"
                className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
                onClick={onToggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 size={18} />
                ) : (
                  <Maximize2 size={18} />
                )}
              </Button>
            </Tooltip>
          </>
        )}

        <Tooltip title="Save Changes">
          <Button
            variant="ghost"
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSave}
            // disabled={!isDirty}
          >
            <div className="relative">
              <Save size={18} />
              {isDirty && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
          </Button>
        </Tooltip>

        <Tooltip title={isJsonMode ? "Switch to Visual" : "Switch to JSON"}>
          <Button
            variant="ghost"
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
            onClick={onToggleView}
          >
            {isJsonMode ? <Cable size={18} /> : <Code2 size={18} />}
          </Button>
        </Tooltip>

        {!isJsonMode && (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            overlayStyle={{ zIndex: 1001 }}
            placement="bottomRight"
          >
            <Button
              variant="ghost"
              className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
              title="More Options"
            >
              <MoreHorizontal size={18} />
            </Button>
          </Dropdown>
        )}
      </div>
    </div>
  );
};
