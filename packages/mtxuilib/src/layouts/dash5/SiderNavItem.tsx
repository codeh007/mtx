"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import type { NavProps } from "../types.tsx--";
import { IconX } from "../../icons/icons";

export function SiderNavItem({ items, isCollapsed }: NavProps) {
  const activatePath = useSelectedLayoutSegment();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {items.map((link, index) => {
          const isActive =
            link.url === activatePath ||
            link.url === `/${activatePath}` ||
            link.url === `/${activatePath}/`;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Fragment key={index}>
              {isCollapsed ? (
                <>
                  {/* biome-ignore lint/suspicious/noArrayIndexKey: <explanation> */}
                  <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className={cn(
                          buttonVariants({
                            variant: link.variant,
                            size: "icon",
                          }),
                          "h-9 w-9",
                          link.variant === "default" &&
                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                          isActive && "bg-blue-300",
                        )}
                      >
                        <IconX name={link.icon} className="h-5 w-5" />
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-4"
                    >
                      {link.title}
                      {link.label && (
                        <span className="ml-auto text-muted-foreground">
                          {link.label}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Link
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    href={link.url || "#"}
                    className={cn(
                      buttonVariants({
                        variant: link.variant,
                        size: "default",
                      }),
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                      "justify-start",
                      isActive && "bg-muted dark:bg-primary hover:shadow-sm",
                    )}
                  >
                    <IconX name={link.icon} className="mr-2 h-5 w-5" />
                    {link.title}
                    {link.label && (
                      <span
                        className={cn(
                          "ml-auto",
                          link.variant === "default" &&
                            "text-background dark:text-white",
                        )}
                      >
                        {link.label}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </Fragment>
          );
        })}
      </nav>
    </div>
  );
}
