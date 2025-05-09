"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "mtxuilib/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "mtxuilib/ui/sidebar";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export function NavDevtools() {
  const openChat = useWorkbenchStore((x) => x.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);

  const openWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  const setOpenWorkbench = useWorkbenchStore((x) => x.setOpenWorkbench);

  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>调试工具</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={false} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"调试工具"}>
                <span>调试工具</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    onClick={() => {
                      setOpenChat(!openChat);
                    }}
                  >
                    togoogle chat
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    onClick={() => {
                      setOpenWorkbench(!openWorkbench);
                    }}
                  >
                    togoogle workbench
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
