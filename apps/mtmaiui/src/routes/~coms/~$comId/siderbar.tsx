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
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
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
    return `/coms/${newUUID}/team_builder`;
  }, []);

  const setQueryParams = useComponentsStore((x) => x.setQueryParams);

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">组件</div>
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

  const editLink = useMemo(() => {
    return `/coms/${rowId}/team_builder`;
  }, [rowId]);

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
          "w-full",
          isOpen && "border-slate-400 border mb-2 rounded-md pt-1",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <PresetItem
            id={`${rowId}`}
            type={"agent"}
            config={item}
            label={item.label || ""}
            icon={<Bot className="w-4 h-4" />}
            className="w-full"
          />
          <DebugValue data={item} />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
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
              to={editLink}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <Edit className="w-4 h-4" />
            </CustomLink>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
