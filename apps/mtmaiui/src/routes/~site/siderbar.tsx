"use client";

import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "mtxuilib/ui/sidebar";

import { Icons } from "mtxuilib/icons/icons";
import { Label } from "mtxuilib/ui/label";
import { useMemo } from "react";

export function NavAdkSession() {
  //   const isDebug = useWorkbenchStore((x) => x.isDebug);

  const linkToNew = useMemo(() => {
    return "/adk/session";
  }, []);

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
            {/* <Switch className="shadow-none" /> */}
          </Label>
        </div>
        {/* <SidebarInput
          placeholder="Type to search..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => { }}
        /> */}
        {/* <AdkAppSelect /> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {/* {isDebug && <DebugValue data={{ data: adkSessionQuery.data }} />}
            {adkSessionQuery.data?.rows?.map((item) => (
              <NavAdkSessionItem key={item.id} item={item} rowId={item.id} />
            ))} */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
