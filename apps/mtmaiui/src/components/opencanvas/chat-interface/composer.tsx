"use client";

import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import type { FC } from "react";

import { SendHorizontalIcon } from "lucide-react";
import { TooltipIconButton } from "mtxuilib/assistant-ui/tooltip-icon-button";
import { CircleStopIcon } from "mtxuilib/icons/CircleStopIcon";

interface ComposerProps {
  chatStarted: boolean;
  userId: string | undefined;
}

export const Composer: FC<ComposerProps> = (props: ComposerProps) => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-aui-ring/20 flex w-full min-h-[64px] flex-wrap items-center rounded-lg border px-2.5 shadow-sm transition-colors ease-in bg-white">
      {/* <AssistantSelect userId={props.userId} chatStarted={props.chatStarted} /> */}
      <ComposerPrimitive.Input
        autoFocus
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </ComposerPrimitive.Root>
  );
};
