"use client";

import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../../ui/skeleton";

interface MtSkeletonProps {
  variants: "default" | "fullpage" | "screenCenter" | "card" | "mainListView";
  className?: string;
}

/**
 * 通用块状占位符界面，通常用于页面加载，列表加载等面积较大组件中
 * @param param0
 * @returns
 */
export const MtSkeleton = ({ children, className, variants }: PropsWithChildren<MtSkeletonProps>) => {
  if (variants === "default") {
    return (
      <div className={cn("flex items-center space-x-4", className)}>
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        {children}
      </div>
    );
  }

  if (variants === "fullpage") {
    return (
      <div className={cn("flex flex-col items-center justify-center h-screen w-screen", className)}>
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="mt-4 h-8 w-[300px]" />
        {children}
      </div>
    );
  }

  if (variants === "screenCenter") {
    return (
      <div className={cn("flex items-center justify-center min-h-screen", className)}>
        <Skeleton className="h-12 w-12 rounded-full" />
        {children}
      </div>
    );
  }

  if (variants === "card") {
    return (
      <div className={cn("p-4 border rounded-lg space-y-4", className)}>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        {children}
      </div>
    );
  }

  if (variants === "mainListView") {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        {children}
      </div>
    );
  }

  return null;
};
