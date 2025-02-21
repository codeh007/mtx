"use client";

import type { Message } from "ai";

import { useQuery } from "@tanstack/react-query";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ReactQueryDevtoolsProduction } from "mtxuilib/components/devtools/DevToolsView";
import { Button } from "mtxuilib/ui/button";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTenant } from "../hooks/useAuth";
import { useWorkbenchStore } from "../stores/workbrench.store";

interface ChatDevToolsProps {
  messages?: Message[];
  initialOpen?: boolean;
}
export const AssistantDevToolsPanel = ({
  messages,
  initialOpen = false,
}: ChatDevToolsProps) => {
  const [open, setOpen] = useState(initialOpen);
  useHotkeys("ctrl+0", () => {
    setOpen(!open);
  });
  // const workbench = workbenchStore;

  const openChat = useWorkbenchStore((x) => x.uiState.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);
  const threadId = useWorkbenchStore((x) => x.threadId);
  if (!open) {
    return null;
  }
  return (
    <div className="bg-red-200 p-2">
      <div>threadId:{threadId}</div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            // console.log(workbench);
          }}
        >
          workbench info
        </Button>
        <DevAgentNodeState />

        <ReactQueryDevtoolsProduction
          initialIsOpen={true}
          position="left"
          buttonPosition="bottom-left"
        />

        <Button onClick={() => setOpenChat(!openChat)}>toggle chat</Button>
      </div>
    </div>
  );
};

export const DevAgentNodeState = () => {
  const tenant = useTenant();
  const threadId = useWorkbenchStore((x) => x.threadId);
  const nodeStateQuery = useQuery(
    "get",
    "/api/v1/tenants/{tenant}/nodes/{node}",
    {
      path: {
        tenant: tenant?.metadata.id,
        node: threadId || "",
      },
    },
    {
      enabled: !!threadId,
    },
  );
  return (
    <>
      <DebugValue data={nodeStateQuery.data} />
      <Button onClick={() => nodeStateQuery.refetch()}>
        refetch agentNodeSate
      </Button>
    </>
  );
};
