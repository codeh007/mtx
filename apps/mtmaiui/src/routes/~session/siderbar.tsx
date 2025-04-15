"use client";

import {
  type AdkSession,
  type ChatSession,
  adkSessionListOptions,
  chatSessionListOptions,
} from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
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

import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import { Icons } from "mtxuilib/icons/icons";
import { RelativeDate } from "mtxuilib/mt/relative-date";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "mtxuilib/ui/collapsible";
import { Label } from "mtxuilib/ui/label";
import { Switch } from "mtxuilib/ui/switch";
import { type ChangeEvent, useMemo, useState } from "react";
import { useTenantId } from "../../hooks/useAuth";
import { useSearch } from "../../hooks/useNav";

export function NavSession() {
  const linkToNew = useMemo(() => {
    // const newUUID = generateUUID();
    return "new";
  }, []);

  const tid = useTenantId();
  const chatQuery = useQuery({
    ...chatSessionListOptions({
      path: {
        tenant: tid,
      },
    }),
  });

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
            {chatQuery.data?.rows?.map((item) => (
              <NavChatSessionItem
                key={item.metadata?.id}
                item={item}
                rowId={item.metadata?.id || ""}
              />
            ))}

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

const NavChatSessionItem = ({
  item,
  rowId,
}: { item: ChatSession; rowId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const search = useSearch();
  const detailLink = useMemo(() => {
    return `/session/${rowId}`;
  }, [rowId]);

  // const editLink = useMemo(() => {
  //   return `/session/${rowId}/edit`;
  // }, [rowId]);

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
          {/* <PresetItem
            id={`${rowId}`}
            type={"agent"}
            config={item.config}
            label={item.label || ""}
            icon={<Bot className="w-4 h-4" />}
            className="w-full"
          /> */}
          <CustomLink to={detailLink} search={search}>
            {item.title}
          </CustomLink>
          <RelativeDate date={item.metadata?.updatedAt} />
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
            <div className="flex w-full items-center gap-2">{item.title}</div>
          </div>
          <div className="flex gap-2 justify-end px-1.5">
            {/* <CustomLink
              to={editLink}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <Edit className="w-4 h-4" />
            </CustomLink> */}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

const NavAdkSessionItem = ({
  item,
  rowId,
}: { item: AdkSession; rowId: string }) => {
  return (
    <div className="bg-slate-100 border px-2 mb-2 rounded-md flex flex-col">
      <div className="flex items-center justify-between">
        <CustomLink to={`/session/${item.id}`}>
          <div>{item.id}</div>
        </CustomLink>
        <div>{item.app_name}</div>
      </div>
    </div>
  );
};
