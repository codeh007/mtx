"use client";
import type * as React from "react";
import { cn } from "../lib/utils";
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 使用范例：<div className="space-y-3">
            <div className="block bg-palette-400 border border-palette-300 shadow-lg rounded-lg overflow-hidden h-full transition-all duration-150 ease hover:border-brandtext-500 hover:shadow-xl p-4 space-y-4">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
 * @param param0
 * @returns
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-palette-300 h-5 w-2/5 animate-pulse rounded-lg",
        className,
      )}
      {...props}
    />
  );
}
