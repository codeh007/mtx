import {
  InfoIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { cn } from "mtxuilib/lib/utils";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import type React from "react";
import { CustomLink } from "../../components/CustomLink";
import { Team } from "../components/types/datamodel";

interface TeamSidebarProps {
  isOpen: boolean;
  teams: Team[];
  currentTeam: Team | null;
  onToggle: () => void;
  onCreateTeam: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: number) => void;
  isLoading?: boolean;
}

export const TeamSidebar: React.FC<TeamSidebarProps> = ({
  isOpen,
  teams,
  currentTeam,
  onToggle,
  onEditTeam,
  onDeleteTeam,
  isLoading = false,
}) => {
  // Render collapsed state
  if (!isOpen) {
    return (
      <div className="h-full border-r border-secondary">
        <div className="p-2 -ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={onToggle}
                className="p-2 rounded-md hover:bg-secondary hover:text-accent transition-colors focus:outline-hidden focus:ring-2 focus:ring-accent focus:ring-opacity-50"
              >
                <PanelLeftOpen strokeWidth={1.5} className="h-6 w-6" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <span>状态查看 ({teams.length})</span>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="mt-4 px-2 -ml-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                // type="text"
                className="w-full p-2 flex justify-center"
                // onClick={handleSaveTeam}
              >
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>创建团队</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  // Render expanded state
  return (
    <div className="h-full border-r border-secondary">
      {/* Header */}
      <div className="flex items-center justify-between pt-0 p-4 pl-2 pr-2 border-b border-secondary">
        <div className="flex items-center gap-2">
          <span className="text-primary font-medium">Teams</span>
          <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded">
            {teams.length}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={onToggle}
              className="p-2 rounded-md hover:bg-secondary hover:text-accent transition-colors focus:outline-hidden focus:ring-2 focus:ring-accent focus:ring-opacity-50"
            >
              <PanelLeftClose strokeWidth={1.5} className="h-6 w-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Close Sidebar</span>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Create Team Button */}

      <div className="my-4 flex text-sm  ">
        <div className=" mr-2 w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <CustomLink
                to="/ag/team/create"
                className={cn("w-full", buttonVariants())}
                // onClick={handleSaveTeam}
              >
                <Plus className="size-4" />
                未完成
              </CustomLink>
            </TooltipTrigger>
            <TooltipContent>
              <span>Create new team</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Section Label */}
      <div className="py-2 flex text-sm">
        <div className="flex">最近使用</div>
        {isLoading && <RefreshCcw className="size-4 ml-2 animate-spin" />}
      </div>

      {/* Teams List */}

      {!isLoading && teams.length === 0 && (
        <div className="p-2 mr-2 text-center text-sm border border-dashed rounded ">
          <InfoIcon className="size-4 inline-block mr-1.5 -mt-0.5" />
          No recent teams found
        </div>
      )}

      <div className="scroll overflow-y-auto h-[calc(100%-170px)]">
        TODO: agent 列表
      </div>
    </div>
  );
};
