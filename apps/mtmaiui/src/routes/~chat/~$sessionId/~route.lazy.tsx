import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DashContent } from "../../../components/DashContent";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { ChatClient } from "../chat/Chat.client";
export const Route = createLazyFileRoute("/chat/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  setThreadId(sessionId);
  return (
    <>
      <DashContent>
        <MtSuspenseBoundary>
          <ChatClient outlet={<Outlet />} />
        </MtSuspenseBoundary>
      </DashContent>
    </>
  );
}
