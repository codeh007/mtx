import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CfAgentChatView } from "../../../../components/chatv3/CfAgentChatView";
import { WorkbenchWrapper } from "../../../../components/workbench/WorkbenchWrapper";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/agents/$agent/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { agent, sessionId } = Route.useParams();
  const agentUrl = useWorkbenchStore((state) => state.agentUrl);
  const agentPathPrefix = useWorkbenchStore((state) => state.agentPathPrefix);

  const setOpenWorkbench = useWorkbenchStore((x) => x.setOpenWorkbench);

  useEffect(() => {
    setOpenWorkbench(true);
  }, [setOpenWorkbench]);

  return (
    <WorkbenchWrapper>
      <CfAgentChatView
        agentName={agent}
        agentId={sessionId}
        host={new URL(agentUrl).host}
        prefix={agentPathPrefix}
      />
    </WorkbenchWrapper>
  );
}
