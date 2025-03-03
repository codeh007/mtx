"use client";

import classNames from "classnames";
import { type AgentRunInput, workflowRunCreate } from "mtmaiapi";
import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { buttonVariants } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import { CustomLink } from "../../components/CustomLink";
import { useTenantId } from "../../hooks/useAuth";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export function HeaderActionButtons() {
  const openWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  const setOpenWorkbench = useWorkbenchStore((x) => x.setOpenWorkbench);

  // console.log("setOpenWorkbench", setOpenWorkbench);
  const openChat = useWorkbenchStore((x) => x.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);
  const canHideChat = openWorkbench || !openChat;

  const chatProfileId = useWorkbenchStore((x) => x.chatProfile);

  const tid = useTenantId();
  const handleAg2 = async () => {
    const response = await workflowRunCreate({
      path: {
        workflow: "ag2",
      },
      body: {
        input: {
          tenantId: tid,
          content: "hello",
          // teamId: teamId,
          // sessionId: threadId,
        } satisfies AgentRunInput,
        additionalMetadata: {
          // sessionId: threadId,
        },
      },
    });
  };
  return (
    <div className="flex">
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
        <Button onClick={handleAg2}>ag2</Button>

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
          // active={!!showWorkbench}
          className={cn(buttonVariants({ variant: "ghost" }))}
          to={`/chat/${chatProfileId}/edit`}
          onClick={() => {
            if (openWorkbench && !openChat) {
              setOpenChat(true);
            }
            setOpenWorkbench(!openWorkbench);
          }}
        >
          <Icons.settings className="size-4" />
        </CustomLink>
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
