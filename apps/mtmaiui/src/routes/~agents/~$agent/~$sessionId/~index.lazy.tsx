import { createLazyFileRoute } from "@tanstack/react-router";
import { CfAgentChatView } from "../../../../components/chatv3/CfAgentChatView";
import { ChatAgentProvider } from "../../../../components/chatv3/agentStore";
import { RemotionNextDemo1 } from "../../../../components/remotion/RemotionNextDemo1";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/agents/$agent/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { agent, sessionId } = Route.useParams();
  const agentUrl = useWorkbenchStore((state) => state.agentUrl);
  const agentPathPrefix = useWorkbenchStore((state) => state.agentPathPrefix);
  return (
    <div className="flex h-full">
      <ChatAgentProvider>
        <CfAgentChatView
          agentName={agent}
          agentId={sessionId}
          host={new URL(agentUrl).host}
          prefix={agentPathPrefix}
        />
        {/* <WorkerAgentView /> */}
        <RemotionNextDemo1 title={"一些文字333"} />
      </ChatAgentProvider>
    </div>
  );
}
