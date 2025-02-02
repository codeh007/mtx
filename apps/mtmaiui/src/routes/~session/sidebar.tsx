'use client'
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Edit,
  InfoIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { Session, sessionListOptions } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import { CustomLink } from "../../components/CustomLink";
import { useTenant } from "../../hooks/useAuth";
import { getRelativeTimeString } from "../components/views/atoms";

interface SidebarProps {
  isOpen: boolean;
  currentSession: Session | null;
  onToggle: () => void;
  onSelectSession: (session: Session) => void;
  onEditSession: (session?: Session) => void;
  onDeleteSession: (sessionId: number) => void;
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  // sessions,
  currentSession,
  onToggle,
  onSelectSession,
  onEditSession,
  onDeleteSession,
  isLoading = false,
}) => {

  const tenant = useTenant()
  const sessionQuery = useSuspenseQuery({
    ...sessionListOptions({
      path:{
        tenant: tenant!.metadata.id,
      }
    })
  })

  const sessions = sessionQuery.data?.rows ?? []
  if (!isOpen) {
    return (
      <div className="h-full  border-r border-secondary">
        <div className="p-2 -ml-2 ">
          <Tooltip>
            <TooltipTrigger asChild>
            <Button
              onClick={onToggle}
              className="p-2 rounded-md hover:bg-secondary hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
            >
              <PanelLeftOpen strokeWidth={1.5} className="h-6 w-6" />
            </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                Sessions{" "}
                <span className="text-accent mx-1"> {sessions.length} </span>
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="mt-4 px-2 -ml-1">
          <Tooltip>
            <TooltipTrigger asChild>
            <Button
              className="w-full p-2 flex justify-center"
              onClick={() => onEditSession()}
            >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Create new session</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border-r border-secondary ">
      <div className="flex items-center justify-between pt-0 p-4 pl-2 pr-2 border-b border-secondary">
        <div className="flex items-center gap-2">
          <span className="text-primary font-medium">Sessions</span>
          <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded">
            {sessions.length}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"ghost"}
              onClick={onToggle}
              className="p-2 rounded-md hover:bg-secondary hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
          >
              <PanelLeftClose strokeWidth={1.5} className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Close Sidebar</span>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="my-4 flex text-sm  ">
        <div className=" mr-2 w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full" onClick={() => onEditSession()}>
                <Plus className="w-4 h-4" />
                新建会话
            </Button>
            </TooltipTrigger  >
            <TooltipContent>
              <span>新建会话</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="py-2 flex text-sm">
        最近{" "}
        {isLoading && (
          <RefreshCcw className="w-4 h-4 inline-block ml-2 animate-spin" />
        )}
      </div>

      {/* no sessions found */}

      {!isLoading && sessions.length === 0 && (
        <div className="p-2 mr-2 text-center text-sm border border-dashed rounded ">
          <InfoIcon className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          No recent sessions found
        </div>
      )}

      <div className="overflow-y-auto   h-[calc(100%-150px)]">
        {sessions.map((s) => (
          <div key={s.metadata.id} className="relative">
            <div
              className={`bg-accent absolute top-1 left-0.5 z-50 h-[calc(100%-8px)]
               w-1 bg-opacity-80  rounded ${
                 currentSession?.metadata.id === s.metadata.id ? "bg-accent" : "bg-tertiary"
               }`}
            >
            </div>
            <CustomLink to={`${s.metadata.id}`}>
            <div
              className={`group ml-1 flex items-center justify-between rounded-l p-2 py-1 text-sm cursor-pointer hover:bg-tertiary ${
                currentSession?.metadata.id === s.metadata.id
                  ? "  border-accent bg-secondary"
                  : ""
              }`}
              // onClick={() => onSelectSession(s)}
            >
              <span className="truncate text-sm flex-1">{s.name}</span>
              <span className="ml-2 truncate text-xs flex-1">
                {getRelativeTimeString(s.metadata.updatedAt || "")}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip>
                  <TooltipTrigger asChild>
                  <Button size="sm"
                    className="p-0 min-w-[24px] h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSession(s);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Edit session</span>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="p-0 min-w-[24px] h-6"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      // if (s.metadata.id) onDeleteSession(s.metadata.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4  text-red-500" />
                  </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Delete session</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            </CustomLink>
          </div>
        ))}
      </div>
    </div>
  );
};
