"use client";

import { Label } from "@radix-ui/react-dropdown-menu";

import { PlusIcon } from "lucide-react";
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
import { Switch } from "mtxuilib/ui/switch";
import { ModelListView } from "./ModelList";
export function NavModel() {
  const { isMobile } = useSidebar();
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">运行历史</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={"/model/new"}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <PlusIcon className="size-4" />
            </CustomLink>
            <Switch className="shadow-none" />
          </Label>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <ModelListView />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
