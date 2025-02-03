import type { MenuProps } from "antd";
import { Dropdown, Tooltip } from "antd";
import {
  ArrowDown,
  ArrowRight,
  Grid,
  Hash,
  MapIcon,
  Maximize2,
  MessageSquareIcon,
  MessageSquareOffIcon,
  Minimize2,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";
import { Button } from "mtxuilib/ui/button";
import type React from "react";
import { useGraphStore } from "../../../../stores/GraphContext";

interface AgentFlowToolbarProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView?: () => void;
}

export const AgentFlowToolbar: React.FC<AgentFlowToolbarProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onResetView,
}) => {
  // const { agentFlow: settings, setAgentFlowSettings } = useConfigStore();
  const settings = useGraphStore((x) => x.agentFlow);
  const setAgentFlowSettings = useGraphStore((x) => x.setAgentFlowSettings);

  const toggleSetting = (setting: keyof typeof settings) => () => {
    setAgentFlowSettings({
      [setting]: !settings[setting],
    });
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "grid",
      label: "Show Grid",
      icon: <Grid size={16} />,
      onClick: toggleSetting("showGrid"),
    },
    {
      key: "tokens",
      label: "Show Tokens",
      icon: <Hash size={16} />,
      onClick: toggleSetting("showTokens"),
    },
    // {
    //   key: "messages",
    //   label: "Show Messages",
    //   icon: <MessageSquare size={16} />,
    //   onClick: toggleSetting("showMessages"),
    // },
    {
      key: "miniMap",
      label: "Mini Map",
      icon: <MapIcon size={16} />,
      onClick: toggleSetting("showMiniMap"),
    },
    {
      type: "divider",
    },
    {
      key: "reset",
      label: "Reset View",
      icon: <RotateCcw size={16} />,
      onClick: onResetView,
      disabled: !onResetView,
    },
  ];

  return (
    <div className="absolute top-2 right-2 bg-secondary bg-opacity-70 hover:bg-secondary rounded backdrop-blur-sm z-50">
      <div className="p-1 flex items-center gap-1">
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
          <Button
            variant="ghost"
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
        </Tooltip>

        <Tooltip
          title={`Switch to ${
            settings.direction === "TB" ? "Horizontal" : "Vertical"
          } Layout`}
        >
          <Button
            variant="ghost"
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
            onClick={() =>
              setAgentFlowSettings({
                direction: settings.direction === "TB" ? "LR" : "TB",
              })
            }
          >
            {settings.direction === "TB" ? (
              <ArrowDown size={18} />
            ) : (
              <ArrowRight size={18} />
            )}
          </Button>
        </Tooltip>

        <Tooltip title={settings.showLabels ? "Hide Labels" : "Show Labels"}>
          <Button
            variant="ghost"
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
            onClick={toggleSetting("showLabels")}
          >
            {settings.showLabels ? (
              <MessageSquareIcon size={18} />
            ) : (
              <MessageSquareOffIcon size={18} />
            )}
          </Button>
        </Tooltip>

        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          getPopupContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
          overlayStyle={{ zIndex: 1000 }}
        >
          <Button
            variant="ghost"
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
            title="More Options" // Use native title instead of Tooltip
          >
            <MoreHorizontal size={18} />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};
