"use client";

import { Download, Play, Save } from "lucide-react";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Switch } from "mtxuilib/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import {
  DashHeaders,
  HeaderActionConainer,
} from "../../components/DashHeaders";
import { useTeamSessionStore } from "../../stores/teamSessionProvider";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export function SessionHeader() {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const componentId = useTeamSessionStore((x) => x.componentId);
  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
          {/* <GoBack to={".."} /> */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <CustomLink to={`/coms/${componentId}/view`}>组件</CustomLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>对话</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeaderActionConainer className="gap-2 flex text-xs rounded border-dashed items-center">
        <div className="flex-1 gap-2">
          <Switch
            onChange={() => {
              // setIsJsonMode(!isJsonMode);
            }}
            className="mr-2"
            //   defaultChecked={!isJsonMode}
          />
          {/* {isJsonMode ? "View JSON" : <>Visual Builder</>}{" "} */}
        </div>

        <div className="flex items-center gap-2">
          {/* {validationResults && !validationResults.is_valid && (
              <div className="inline-block mr-2">
                <ValidationErrors validation={validationResults} />
              </div>
            )} */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                //   onClick={() => {
                //     const json = JSON.stringify(syncToJson(), null, 2);
                //     const blob = new Blob([json], {
                //       type: "application/json",
                //     });
                //     const url = URL.createObjectURL(blob);
                //     const a = document.createElement("a");
                //     a.href = url;
                //     a.download = "team-config.json";
                //     a.click();
                //     URL.revokeObjectURL(url);
                //   }}
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
                size="icon"
                variant="outline"
                // className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                //   onClick={handleSave}
                // disabled={!isDirty}
              >
                <div className="relative">
                  <Save className="size-4" />
                  {/* {isDirty && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                    )} */}
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
                onClick={() => {
                  handleHumanInput({
                    content: "你好",
                    componentId: componentId,
                  });
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
