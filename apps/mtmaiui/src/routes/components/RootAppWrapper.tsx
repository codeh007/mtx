"use client";

import { cn } from "mtxuilib/lib/utils";
import type { PropsWithChildren } from "react";

interface RootAppWrapperProps extends PropsWithChildren {
  className?: string;
}
export function RootAppWrapper({ children, className }: RootAppWrapperProps) {
  return (
    <div className={cn("fixed flex flex-1 top-0 left-0 w-full h-full z-30", className)}>{children}</div>
  );
}
