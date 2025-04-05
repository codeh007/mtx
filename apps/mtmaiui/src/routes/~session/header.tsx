"use client";

import { Download, PlusIcon, Save } from "lucide-react";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { DashHeaders, HeaderActionConainer } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "mtxuilib/ui/breadcrumb";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import { useSidebar } from "mtxuilib/ui/sidebar";
import {
  BetterTooltip,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "mtxuilib/ui/tooltip";
import { useWindowSize } from "usehooks-ts";
import { useSearch } from "../../hooks/useNav";
import { ChatDescription } from "../../lib/persistence/ChatDescription.client";
import { useTeamSessionStore } from "../../stores/teamSessionProvider";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export function SessionHeader() {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const componentId = useTeamSessionStore((x) => x.componentId);
  const sessionId = useWorkbenchStore((x) => x.threadId);
  const search = useSearch();
  const started = useWorkbenchStore((x) => x.started);
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  const openWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  const setOpenWorkbench = useWorkbenchStore((x) => x.setOpenWorkbench);
  const openChat = useWorkbenchStore((x) => x.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);
  const canHideChat = openWorkbench || !openChat;

  const chatSessionId = useWorkbenchStore((x) => x.threadId);
  return (
    <DashHeaders>
      <Breadcrumb>
        <BreadcrumbList>
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
          <Tooltip>
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
          </Tooltip>

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
          {(!open || windowWidth < 768) && (
            <BetterTooltip content="New Chat">
              <Button
                variant="outline"
                className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
                onClick={() => {
                  // router.push("/");
                  // router.refresh();
                }}
              >
                <PlusIcon />
                <span className="md:sr-only">New Chat</span>
              </Button>
            </BetterTooltip>
          )}
          <Button
            className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto"
            asChild
          >
            mtmai
          </Button>

          <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
            <div className="i-ph:sidebar-simple-duotone text-xl" />
            <a
              href="/"
              className="text-2xl font-semibold text-accent flex items-center"
            >
              <span className="i-bolt:logo-text?mask w-[46px] inline-block" />
            </a>
          </div>

          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ChatDescription />
          </span>
          <div className="flex">
            <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
              <Button
                disabled={!canHideChat}
                variant={"ghost"}
                onClick={() => {
                  if (canHideChat) {
                    setOpenChat(!openChat);
                  }
                }}
              >
                <Icons.messageSquare className="size-5" />
              </Button>
              <div className="w-[1px] bg-bolt-elements-borderColor" />
              <Button
                disabled={!openWorkbench}
                variant={"ghost"}
                onClick={() => {
                  setOpenWorkbench(!openWorkbench);
                }}
              >
                <Icons.code className="size-4" />
              </Button>
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* <CustomLink
          to={`/play/chat/${chatSessionId}/debug`}
          className={cn(buttonVariants({ variant: "ghost" }))}
          activeProps={{
            className: "outline outline-1 outline-offset-2 outline-red-500",
          }}
        >
          D
        </CustomLink>
        <Separator orientation="vertical" className="mr-2 h-4" /> */}
              {/* <CustomLink
          to={`/play/chat/${chatSessionId}/state`}
          className={cn(buttonVariants({ variant: "ghost" }))}
          activeProps={{
            className: "outline outline-1 outline-offset-2 outline-red-500",
          }}
        >
          ST
        </CustomLink> */}
              {/* <Separator orientation="vertical" className="mr-2 h-4" />
        <CustomLink
          to={`/play/chat/${chatSessionId}/team`}
          className={cn(buttonVariants({ variant: "ghost" }))}
          activeProps={{
            className: "outline outline-1 outline-offset-2 outline-red-500",
          }}
        >
          team
        </CustomLink> */}
              <CustomLink
                to={`/play/chat/${chatSessionId}/edit`}
                className={cn(buttonVariants({ variant: "ghost" }))}
                activeProps={{
                  className:
                    "outline outline-1 outline-offset-2 outline-red-500",
                }}
              >
                <Icons.settings className="size-4" />
              </CustomLink>
              {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
              <CustomLink
                to={`/play/chat/${chatSessionId}/result`}
                className={cn(buttonVariants({ variant: "ghost" }))}
                activeProps={{
                  className:
                    "outline outline-1 outline-offset-2 outline-red-500",
                }}
              >
                result
              </CustomLink>
              {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
            </div>
          </div>
        </div>
      </HeaderActionConainer>
    </DashHeaders>
  );
}
