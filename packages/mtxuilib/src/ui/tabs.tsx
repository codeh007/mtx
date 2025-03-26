"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";

import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

const tabsListVariants = cva("", {
  variants: {
    layout: {
      default:
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
      underlined:
        "w-full justify-start rounded-none border-b bg-transparent p-0",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  layout = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  layout?: "default" | "underlined";
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      // className={cn(
      //   "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
      //   className,
      // )}
      className={cn(tabsListVariants({ layout }), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva("", {
  variants: {
    variant: {
      underlined:
        "relative rounded-none border-b-2 border-b-transparent bg-transparent px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none ",
      default:
        "data-[state=active]:bg-background data-[state=active]:text-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 inline-flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-invalid:focus-visible:ring-0 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
function TabsTrigger({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  variant?: "default" | "underlined";
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      // className={cn(
      //   "data-[state=active]:bg-background data-[state=active]:text-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 inline-flex items-center justify-center gap-2 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-invalid:focus-visible:ring-0 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      //   className,
      // )}
      {...props}
      className={cn(tabsTriggerVariants({ variant }), className)}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 flex-1 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
