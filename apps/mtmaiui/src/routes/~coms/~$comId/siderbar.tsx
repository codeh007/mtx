"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import type { MtComponent } from "mtmaiapi";
import { cn, generateUUID } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from "mtxuilib/ui/sidebar";

import { Bot, ChevronsUpDown, Edit } from "lucide-react";
import { IconPlus } from "mtxuilib/icons/icons-ai";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "mtxuilib/ui/collapsible";
import { Switch } from "mtxuilib/ui/switch";
import { type ChangeEvent, useMemo, useState } from "react";
import { useComponentsStore } from "../../../stores/componentsProvider";
import { PresetItem } from "../../components/views/team/builder/library";

export function NavComsWithLibrary() {
  const components = useComponentsStore((x) => x.components);

  const linkToNew = useMemo(() => {
    const newUUID = generateUUID();
    return `${newUUID}/new`;
  }, []);

  const setQueryParams = useComponentsStore((x) => x.setQueryParams);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">资源</div>
          <Label className="flex items-center gap-2 text-sm">
            <CustomLink
              to={linkToNew}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <IconPlus />
            </CustomLink>
            <Switch className="shadow-none" />
          </Label>
        </div>
        <SidebarInput
          placeholder="Type to search..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            // console.log("sidebar input", e.target.value);
            setQueryParams({
              label: e.target.value,
            });
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {components?.map((item) => (
              <NavTeamItem
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

const NavTeamItem = ({ item, rowId }: { item: MtComponent; rowId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const detailLink = useMemo(() => {
    return `/coms/${rowId}`;
  }, [rowId]);

  return (
    <div className="w-full">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(isOpen && "border-green-400 border mb-2 rounded-md pt-1")}
      >
        <div className="flex items-center justify-between px-2">
          <PresetItem
            id={`${rowId}`}
            type={"agent"}
            config={item.config}
            label={item.label || ""}
            icon={<Bot className="w-4 h-4" />}
            className="w-full"
          />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        {/* <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/primitives
        </div> */}
        <CollapsibleContent className="space-y-1">
          <div
            // to={detailLink}
            key={rowId}
            // className="flex flex-col items-start gap-2 whitespace-nowrap p-2 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <div className="flex w-full items-center gap-2">
              <span>{item.label}</span>
            </div>
            {/* <span className="text-sm">{item.provider}</span> */}
            <span className="text-xs">{item.description || rowId}</span>
          </div>
          <div className="flex gap-2 justify-end px-1.5">
            <CustomLink
              to={detailLink}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <Edit className="w-4 h-4" />
            </CustomLink>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
