"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import type { MtComponent } from "mtmaiapi";
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

import { IconPlus } from "mtxuilib/icons/icons-ai";
import { Switch } from "mtxuilib/ui/switch";
import { type ChangeEvent, useMemo } from "react";
import { useComponentsStore } from "../../stores/componentsProvider";

export function NavComs() {
  // const { comId } = useParams();
  const components = useComponentsStore((x) => x.components);

  const linkToNew = useMemo(() => {
    const newUUID = generateUUID();
    return `/coms/${newUUID}/team_builder/team`;
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
  const detailLink = useMemo(() => {
    return `${rowId}`;
  }, [rowId]);
  return (
    <>
      <CustomLink
        to={detailLink}
        key={rowId}
        className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="flex w-full items-center gap-2">
          <span>{item.label}</span>
          {/* <span className="ml-auto text-xs">{chat.createdAt}</span> */}
        </div>
        <span className="font-medium">{item.label}</span>
        <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
          {item.description || rowId}
        </span>
      </CustomLink>
    </>
  );
};
