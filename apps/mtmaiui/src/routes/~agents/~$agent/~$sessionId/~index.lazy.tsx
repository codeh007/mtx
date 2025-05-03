import { createLazyFileRoute } from "@tanstack/react-router";
import { CfAgentChatView } from "../../../../components/chatv2/CfAgentChatView";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { WorkerAgentView } from "../../WorkerAgentView";

export const Route = createLazyFileRoute("/agents/$agent/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { agent, sessionId } = Route.useParams();
  const agentUrl = useWorkbenchStore((state) => state.agentUrl);
  const agentPathPrefix = useWorkbenchStore((state) => state.agentPathPrefix);
  return (
    <div className="flex h-full">
      <CfAgentChatView
        agentName={agent}
        agentId={sessionId}
        host={new URL(agentUrl).host}
        prefix={agentPathPrefix}
      />
      <WorkerAgentView />
    </div>
  );
}
