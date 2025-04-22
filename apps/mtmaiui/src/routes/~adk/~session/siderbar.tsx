"use client";

import { type AdkSession, adkSessionListOptions } from "mtmaiapi";
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
} from "mtxuilib/ui/sidebar";

import { useQuery } from "@tanstack/react-query";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Icons } from "mtxuilib/icons/icons";
import { Label } from "mtxuilib/ui/label";
import { Switch } from "mtxuilib/ui/switch";
import { type ChangeEvent, useMemo } from "react";
import { useTenantId } from "../../../hooks/useAuth";

export function NavAdkSession() {
  const linkToNew = useMemo(() => {
    return "new";
  }, []);

  const tid = useTenantId();
  const adkSessionQuery = useQuery({
    ...adkSessionListOptions({
      path: {
        tenant: tid,
      },
    }),
  });

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">对话</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={linkToNew}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <Icons.plus className="size-4" />
            </CustomLink>
            <Switch className="shadow-none" />
          </Label>
        </div>
        <SidebarInput
          placeholder="Type to search..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            // console.log("sidebar input", e.target.value);
            // setQueryParams({
            //   label: e.target.value,
            // });
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <DebugValue data={{ data: adkSessionQuery.data }} />
            {adkSessionQuery.data?.rows?.map((item) => (
              <NavAdkSessionItem
                key={item.metadata?.id}
                item={item}
                rowId={item.metadata?.id || ""}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const NavAdkSessionItem = ({ item, rowId }: { item: AdkSession; rowId: string }) => {
  return (
    <div className="bg-slate-100 border px-2 mb-2 rounded-md flex flex-col">
      <div className="flex items-center justify-between">
        <CustomLink to={`/adk/session/${item.id}`}>
          <div>{item.title || item.id}</div>
        </CustomLink>
        <div>{item.app_name}</div>
      </div>
    </div>
  );
};
