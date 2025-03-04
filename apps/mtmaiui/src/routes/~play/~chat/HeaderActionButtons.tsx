"use client";

import classNames from "classnames";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import { Separator, Separator } from "mtxuilib/ui/separator";

import { useWorkbenchStore } from "../../../stores/workbrench.store";

export function HeaderActionButtons() {
  const openWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  const setOpenWorkbench = useWorkbenchStore((x) => x.setOpenWorkbench);
  const openChat = useWorkbenchStore((x) => x.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);
  const canHideChat = openWorkbench || !openChat;

  const chatSessionId = useWorkbenchStore((x) => x.threadId);

  return (
    <div className="flex">
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
        <Button
          active={!!openChat}
          disabled={!canHideChat}
          onClick={() => {
            if (canHideChat) {
              setOpenChat(!openChat);
            }
          }}
        >
          <Icons.messageSquare className="size-5" />
        </Button>
        <div className="w-[1px] bg-bolt-elements-borderColor" />
        <Button
          active={!!openWorkbench}
          onClick={() => {
            console.log("openWorkbench", openWorkbench);
            // if (openWorkbench && !openChat) {
            //   setOpenChat(true);
            // }
            setOpenWorkbench(!openWorkbench);
          }}
        >
          <Icons.code />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <CustomLink
          to={`/play/chat/${chatSessionId}/debug`}
          className={cn(buttonVariants({ variant: "ghost" }))}
          activeProps={{
            className: "outline outline-1 outline-offset-2 outline-red-500",
          }}
        >
          D
        </CustomLink>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <CustomLink
          to={`/play/chat/${chatSessionId}/state`}
          className={cn(buttonVariants({ variant: "ghost" }))}
          activeProps={{
            className: "outline outline-1 outline-offset-2 outline-red-500",
          }}
        >
          ST
        </CustomLink>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <CustomLink
          to={`/play/chat/${chatSessionId}/team`}
          className={cn(buttonVariants({ variant: "ghost" }))}
          activeProps={{
            className: "outline outline-1 outline-offset-2 outline-red-500",
          }}
        >
          team
        </CustomLink>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <CustomLink
          to={`/play/chat/${chatSessionId}/edit`}
          className={cn(buttonVariants({ variant: "ghost" }))}
          activeProps={{
            className: "outline outline-1 outline-offset-2 outline-red-500",
          }}
        >
          <Icons.settings className="size-4" />
        </CustomLink>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <CustomLink
          to={`/play/chat/${chatSessionId}/result`}
          className={cn(buttonVariants({ variant: "ghost" }))}
          activeProps={{
            className: "outline outline-1 outline-offset-2 outline-red-500",
          }}
        >
          result
        </CustomLink>
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* <CustomLink
          className={cn(buttonVariants({ variant: "ghost" }))}
          to={`/play/chat/${chatSessionId}/edit`}
          onClick={() => {
            if (openWorkbench && !openChat) {
              setOpenChat(true);
            }
            setOpenWorkbench(!openWorkbench);
          }}
        >
          <Icons.settings className="size-4" />
        </CustomLink> */}
      </div>
    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  children?: any;
  onClick?: VoidFunction;
}

function Button({
  active = false,
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={classNames("flex items-center p-1.5", {
        "bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary":
          !active,
        "bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent":
          active && !disabled,
        "bg-bolt-elements-item-backgroundDefault text-alpha-gray-20 dark:text-alpha-white-20 cursor-not-allowed":
          disabled,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
