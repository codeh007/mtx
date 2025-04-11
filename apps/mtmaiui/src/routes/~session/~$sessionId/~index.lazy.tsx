import { createLazyFileRoute } from "@tanstack/react-router";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useEffect } from "react";
import { ChatClient } from "../../../components/chat/Chat.client";
import { AgStateView } from "../../../components/stateview/AgStateView";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const refetchTeamState = useWorkbenchStore((x) => x.refetchTeamState);
  const teamSate = useWorkbenchStore((x) => x.teamState);
  useEffect(() => {
    refetchTeamState();
  }, [refetchTeamState]);
  return (
    <>
      <DebugValue data={{ teamSate }} />
      {teamSate && <AgStateView state={teamSate} />}
      <ChatClient />
    </>
  );
}
