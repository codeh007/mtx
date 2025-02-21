"use client";

import { forwardRef } from "react";

import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export type TooltipIconButtonProps = React.ComponentProps<typeof Button> & {
  tooltip: string | React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  /**
   * @default 700
   */
  delayDuration?: number;
};

export const TooltipIconButton = forwardRef<
  HTMLButtonElement,
  TooltipIconButtonProps
>(
  (
    { children, tooltip, side = "bottom", className, delayDuration, ...rest },
    ref,
  ) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={delayDuration ?? 700}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              {...rest}
              className={cn("size-6 p-1", className)}
              ref={ref}
            >
              {children}
              <span className="sr-only">{tooltip}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

TooltipIconButton.displayName = "TooltipIconButton";
