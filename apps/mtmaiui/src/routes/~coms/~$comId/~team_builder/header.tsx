"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Download, ListCheck, Play, Save } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import {
  DashHeaders,
  HeaderActionConainer,
} from "../../../../components/DashHeaders";
import { useNav } from "../../../../hooks/useNav";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";
import { ValidationErrors } from "../../../components/views/team/builder/validationerrors";

interface TeamBuilderHeaderProps {
  comId: string;
}
export function TeamBuilderHeader({ comId }: TeamBuilderHeaderProps) {
  const isDirty = useTeamBuilderStore((x) => x.isDirty);
  const validationResults = useTeamBuilderStore((x) => x.validationResults);
  const teamValidated = useTeamBuilderStore((x) => x.teamValidated);
  const syncToJson = useTeamBuilderStore((x) => x.syncToJson);
  const handleSave = useTeamBuilderStore((x) => x.handleSave);
  const handleValidate = useTeamBuilderStore((x) => x.handleValidate);
  const nav = useNav();
  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>编辑团队</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeaderActionConainer className="gap-2 flex gap-2 text-xs rounded border-dashed items-center">
        <div className="flex items-center gap-2">
          {validationResults && !validationResults.is_valid && (
            <div className="inline-block mr-2">
              <ValidationErrors validation={validationResults} />
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  const json = JSON.stringify(syncToJson(), null, 2);
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
              <span>Download Team</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                // className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                variant="outline"
                // disabled={!isDirty}
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
                // loading={validationLoading}
                // className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleValidate}
                variant="outline"
              >
                <div className="relative">
                  <ListCheck size={18} />
                  {validationResults && (
                    <div
                      className={` ${
                        teamValidated ? "bg-green-500" : "bg-red-500"
                      } absolute top-0 right-0 w-2 h-2  rounded-full`}
                    />
                  )}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                Validate Team
                {validationResults && (
                  <div className="text-xs text-center my-1">
                    {/* {teamValidated ? (
              <span>
                <CheckCircle className="w-3 h-3 text-green-500 inline-block mr-1" />
                success
              </span>
            ) : (
              <div className="">
                <CircleX className="w-3 h-3 text-red-500 inline-block mr-1" />
                errors
              </div>
            )} */}
                  </div>
                )}
              </div>
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
