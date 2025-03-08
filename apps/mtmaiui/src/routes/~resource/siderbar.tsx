"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { Switch } from "@radix-ui/react-switch";

import { useSuspenseQuery } from "@tanstack/react-query";
import { resourceListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  useSidebar,
} from "mtxuilib/ui/sidebar";

import { useTenantId } from "../../hooks/useAuth";

export function NavPlatformAccount() {
  const { isMobile } = useSidebar();
  const tid = useTenantId();
  const platformAccountQuery = useSuspenseQuery({
    ...resourceListOptions({
      path: {
        tenant: tid!,
      },
    }),
  });

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">账号</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={"/platform-account/create"}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <span>+</span>
            </CustomLink>
            <Switch className="shadow-none" />
          </Label>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>
      <SidebarContent>
        {" "}
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {platformAccountQuery.data?.rows?.map((item) => (
              <CustomLink
                to={`/platform-account/${item.metadata?.id}`}
                key={item.metadata?.id}
                className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div className="flex w-full items-center gap-2">
                  <span>{item.email}</span>{" "}
                  {/* <span className="ml-auto text-xs">{chat.createdAt}</span> */}
                </div>
                <span className="font-medium">{item.email}</span>
                <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                  {item.email || item.metadata?.id}
                </span>
              </CustomLink>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
