"use client";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cn } from "mtxuilib/lib/utils";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import type { PropsWithChildren } from "react";
import { DashSidebar } from "../../components/sidebar/siderbar";

interface RootAppWrapperProps extends PropsWithChildren {
  secondSidebar?: React.ReactNode;
  className?: string;
}
export function RootAppWrapper({
  children,
  className,
  secondSidebar,
}: RootAppWrapperProps) {
  return (
    <div
      className={cn(
        "fixed flex flex-1 top-0 left-0 w-full h-full z-30",
        className,
      )}
    >
      <DashSidebar secondSidebar={secondSidebar} />
      <SidebarInset>
        <MtSuspenseBoundary>{children}</MtSuspenseBoundary>
      </SidebarInset>
    </div>
  );
}
