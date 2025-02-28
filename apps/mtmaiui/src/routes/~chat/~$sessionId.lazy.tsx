import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DashContent } from "../../components/DashContent";
import { ChatClient } from "../../components/chat/Chat.client";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { Header } from "./header";
export const Route = createLazyFileRoute("/chat/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  setThreadId(sessionId);
  return (
    <>
      <Header />
      <DashContent>
        <MtSuspenseBoundary>
          <ChatClient />
        </MtSuspenseBoundary>
      </DashContent>
    </>
  );
}
