"use client";

import { Download, Save } from "lucide-react";
import { DashHeaders, HeaderActionConainer } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";

export function PlatformAccountHeader() {
  //   const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  //   const componentId = useTeamSessionStore((x) => x.componentId);
  //   const sessionId = useWorkbenchStore((x) => x.threadId);
  //   const search = useSearch();
  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
          {/* <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <CustomLink to={`${platformAccountId}`}>社媒账号</CustomLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator /> */}
          <BreadcrumbItem>
            <BreadcrumbPage>社媒账号</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeaderActionConainer className="gap-2 flex text-xs rounded border-dashed items-center">
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
              <Button size="icon" variant="outline">
                <div className="relative">
                  <Save className="size-4" />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Save Team</span>
            </TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <CustomLink
                to={`/session/${sessionId}/team_state`}
                search={search}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <Icons.code className="size-4" />
              </CustomLink>
            </TooltipTrigger>
            <TooltipContent>
              <span>state</span>
            </TooltipContent>
          </Tooltip> */}

          {/* <Tooltip>
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
          </Tooltip> */}
        </div>
      </HeaderActionConainer>
    </DashHeaders>
  );
}
