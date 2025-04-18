import { BetterTooltip } from "mtxuilib/ui/tooltip";
import type { ComponentProps } from "react";
import { SidebarLeftIcon } from "../icons/aichatbot.icons";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { type SidebarTrigger, useSidebar } from "../ui/sidebar";

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <BetterTooltip content="Toggle Sidebar" align="start">
      <Button
        onClick={toggleSidebar}
        variant="outline"
        className={cn("md:px-2 md:h-fit", className)}
      >
        <SidebarLeftIcon size={16} />
      </Button>
    </BetterTooltip>
  );
}
