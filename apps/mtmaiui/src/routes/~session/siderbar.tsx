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
  SidebarInput,
} from "mtxuilib/ui/sidebar";

import { Icons } from "mtxuilib/icons/icons";
import { Label } from "mtxuilib/ui/label";
import { Switch } from "mtxuilib/ui/switch";
import { type ChangeEvent, useMemo } from "react";
// import { listPlateformAccountOptions } from "../../lib/mtmagapi/@tanstack/react-query.gen";

export function NavSession() {
  const linkToNew = useMemo(() => {
    return "new";
  }, []);

  // const listSessions = useQuery({
  //   // ...listPlateformAccountOptions(),
  // });

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
            todo list
            {/* <DebugValue data={{ data: listSessions.data }} /> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
