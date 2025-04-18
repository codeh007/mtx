"use client";

import { BotIcon, ChevronDownIcon } from "lucide-react";

import { Thread } from "@assistant-ui/react";
import { forwardRef, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// const LzThread = dynamic(() => import("./thread.tsx--").then((mod) => mod.Thread), {
//   ssr: false,
// });
export const AssistantModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FloatingAssistantButton />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="h-[500px] w-[400px] rounded p-0"
      >
        <Thread />
      </PopoverContent>
    </Popover>
  );
};

type FloatingAssistantButton = { "data-state"?: "open" | "closed" };

const FloatingAssistantButton = forwardRef<
  HTMLButtonElement,
  FloatingAssistantButton
>(({ "data-state": state, ...rest }, forwardedRef) => {
  const tooltip = state === "open" ? "Close Assistant" : "Open Assistant";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed right-4 bottom-4 size-12 rounded-full shadow hover:scale-70"
          {...rest}
          ref={forwardedRef}
        >
          <BotIcon
            className={cn(
              "absolute size-6 transition-all",
              state === "open" && "rotate-90 scale-0",
              state === "closed" && "rotate-0 scale-100",
            )}
          />

          <ChevronDownIcon
            className={cn(
              "absolute size-6 transition-all",
              state === "open" && "rotate-0 scale-100",
              state === "closed" && "-rotate-90 scale-0",
            )}
          />
          <span className="sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">{tooltip}</TooltipContent>
    </Tooltip>
  );
});
