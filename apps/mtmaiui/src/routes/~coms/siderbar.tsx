"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type MtComponent, comsListOptions } from "mtmaiapi";
import { cn, generateUUID } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from "mtxuilib/ui/sidebar";

import { Switch } from "mtxuilib/ui/switch";
import { useMemo } from "react";
import { useTenantId } from "../../hooks/useAuth";

export function NavComs() {
  const tid = useTenantId();
  const comsQuery = useSuspenseQuery({
    ...comsListOptions({
      path: {
        tenant: tid!,
      },
    }),
  });

  const linkToNew = useMemo(() => {
    const newUUID = generateUUID();
    return `/coms/${newUUID}/new`;
  }, []);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">资源</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={linkToNew}
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
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {comsQuery.data?.rows?.map((item) => (
              <NavResourceItem key={item.metadata?.id} item={item} />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const NavResourceItem = ({ item }: { item: MtComponent }) => {
  const detailLink = useMemo(() => {
    return `${item.metadata?.id}/type/${item.type}`;
  }, [item.metadata?.id, item.type]);

  return (
    <>
      <CustomLink
        to={detailLink}
        key={item.metadata?.id}
        className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="flex w-full items-center gap-2">
          <span>{item.label}</span>{" "}
          {/* <span className="ml-auto text-xs">{chat.createdAt}</span> */}
        </div>
        <span className="font-medium">{item.label}</span>
        <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
          {item.description || item.metadata?.id}
        </span>
      </CustomLink>
    </>
  );
};
