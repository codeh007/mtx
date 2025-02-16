"use client";
import {
  Bot,
  Copy,
  GalleryHorizontalEnd,
  InfoIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import type { MtComponent } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { cn } from "mtxuilib/lib/utils";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import type React from "react";
import { CustomLink } from "../../components/CustomLink";
import { getRelativeTimeString } from "../components/views/atoms";
import { useGalleryStore } from "../~gallery/store";

interface TeamSidebarProps {
  isOpen: boolean;
  teams: MtComponent[];
  currentTeam: MtComponent | null;
  onToggle: () => void;
  onCreateTeam: (team: MtComponent) => void;
  onEditTeam: (team: MtComponent) => void;
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
  const defaultGallery = useGalleryStore((state) => state.getDefaultGallery());
  // const [messageApi, contextHolder] = message.useMessage();

  // const tenant = useTenant();
  // const createTeamMutation = useMutation({
  //   ...teamCreateMutation({}),
  // });

  const handleSaveTeam = async () => {
    // const teamData = Object.assign({}, defaultTeamConfig);
    // const teamData = defaultTeamConfig;
    // teamData.version = undefined;
    // console.log("handleSaveTeam", teamData);
    // const sanitizedTeamData = {
    //   ...{
    //     teamData,
    //     component: {
    //       ...teamData,
    //       name: `new_team_${new Date().getTime()}`,
    //     },
    //   },
    //   created_at: undefined, // Remove these fields
    //   updated_at: undefined, // Let server handle timestamps
    // };
    // sanitizedTeamData.version = undefined;
    // console.log("defaultTeamConfig", defaultTeamConfig);
    // await createTeamMutation.mutateAsync({
    //   path: {
    //     tenant: tenant!.metadata.id,
    //   },
    //   body: {
    //     // ...teamData,
    //     // component: teamData,
    //     // component: {
    //     //   // ...defaultTeamConfig,
    //     //   // version: undefined,
    //     // },
    //     // ...sanitizedTeamData,
    //     // name: sanitizedTeamData.component.name,
    //     // component: {
    //     //   // ...defaultTeamConfig,
    //     //   ...sanitizedTeamData,
    //     //   // name: sanitizedTeamData.component.name,
    //     //   config: {
    //     //     // ...sanitizedTeamData.component.config,
    //     //     name: sanitizedTeamData.component.name,
    //     //   },
    //     // },
    //   },
    // });
    // messageApi.success(
    //   `Team ${teamData.id ? "updated" : "created"} successfully`,
    // );
    // Update teams list
    // if (teamData.id) {
    //   setTeams(teams.map((t) => (t.id === savedTeam.id ? savedTeam : t)));
    //   if (currentTeam?.id === savedTeam.id) {
    //     setCurrentTeam(savedTeam);
    //   }
    // } else {
    //   setTeams([savedTeam, ...teams]);
    //   setCurrentTeam(savedTeam);
    // }
  };

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
                className="p-2 rounded-md hover:bg-secondary hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
              >
                <PanelLeftOpen strokeWidth={1.5} className="h-6 w-6" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Teams ({teams.length})</span>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="mt-4 px-2 -ml-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                // type="text"
                className="w-full p-2 flex justify-center"
                onClick={handleSaveTeam}
              >
                <Plus className="w-4 h-4" />
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
              className="p-2 rounded-md hover:bg-secondary hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
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
                to="/team/create"
                className={cn("w-full", buttonVariants())}
                onClick={handleSaveTeam}
              >
                <Plus className="size-4" />
                新建团队
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
        {isLoading && <RefreshCcw className="w-4 h-4 ml-2 animate-spin" />}
      </div>

      {/* Teams List */}

      {!isLoading && teams.length === 0 && (
        <div className="p-2 mr-2 text-center text-sm border border-dashed rounded ">
          <InfoIcon className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          No recent teams found
        </div>
      )}

      <div className="scroll overflow-y-auto h-[calc(100%-170px)]">
        <>
          {teams.length > 0 && (
            <div
              key={"teams_title"}
              className={` ${isLoading ? "  pointer-events-none" : ""}`}
            >
              {teams.map((team) => (
                <div
                  key={team.metadata.id}
                  className="relative border-secondary"
                >
                  <DebugValue data={team} />
                  {
                    <div
                      className={` absolute top-1 left-0.5 z-50 h-[calc(100%-8px)]
               w-1 bg-opacity-80  rounded ${
                 currentTeam?.metadata.id === team.metadata.id
                   ? "bg-accent"
                   : "bg-tertiary"
               }`}
                    />
                  }
                  <div
                    className={`group ml-1 flex flex-col p-3 rounded-l cursor-pointer hover:bg-secondary   ${
                      currentTeam?.metadata.id === team.metadata.id
                        ? "border-accent bg-secondary"
                        : "border-transparent"
                    }`}
                    // onClick={() => onSelectTeam(team)}
                  >
                    <CustomLink to={`${team.metadata.id}`}>
                      {/* Team Name and Actions Row */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">
                          {team?.component?.label}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* <Tooltip title="Edit team">
                    <Button
                      type="text"
                      size="small"
                      className="p-0 min-w-[24px] h-6"
                      icon={<Edit className="w-4 h-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTeam(team);
                      }}
                    />
                  </Tooltip> */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="p-0 min-w-[24px] h-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (team.metadata.id)
                                    onDeleteTeam(team.metadata.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Delete team</span>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Team Metadata Row */}
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="bg-secondary/20  truncate   rounded">
                          {/* {team.component?.team_type} */}
                        </span>
                        <div className="flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          <span>
                            {team.component?.config?.participants?.length}{" "}
                            {team.component?.config?.participants?.length === 1
                              ? "agent"
                              : "agents"}
                          </span>
                        </div>
                      </div>
                    </CustomLink>

                    {/* Updated Timestamp */}
                    {team.metadata?.updatedAt && (
                      <div className="mt-1 flex items-center gap-1 text-xs">
                        {/* <Calendar className="w-3 h-3" /> */}
                        <span>
                          {getRelativeTimeString(team?.metadata.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gallery Teams Section */}
          <div key={"gallery_title"} className="py-2 text-sm mt-4">
            <GalleryHorizontalEnd className="w-4 h-4 inline-block mr-1.5" />
            From Gallery
          </div>
          <div key={"gallery_content"} className="scroll overflow-y-auto">
            {defaultGallery?.items.teams.map((galleryTeam) => (
              <div
                key={galleryTeam.name + galleryTeam.team_type}
                className="relative border-secondary"
              >
                <div
                  className={`absolute top-1 left-0.5 z-50 h-[calc(100%-8px)]
              w-1 bg-opacity-80 rounded bg-tertiary`}
                />
                <div className="group ml-1 flex flex-col p-3 rounded-l cursor-pointer hover:bg-secondary">
                  {/* Team Name and Use Template Action */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">
                      {galleryTeam.name}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            // type="text"
                            size="icon"
                            className="p-0 min-w-[24px] h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              galleryTeam.name = `${galleryTeam.name}_${new Date().getTime()}`;
                              onCreateTeam({
                                config: galleryTeam,
                              });
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Use as template</span>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Team Metadata Row */}
                  <div className="mt-1 flex items-center gap-2 text-xs ">
                    <span className="bg-secondary/20 truncate rounded">
                      {galleryTeam.team_type}
                    </span>
                    <div className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      <span>
                        {galleryTeam.participants.length}{" "}
                        {galleryTeam.participants.length === 1
                          ? "agent"
                          : "agents"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};
