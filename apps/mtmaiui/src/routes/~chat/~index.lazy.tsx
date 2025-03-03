import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DashContent } from "../../components/DashContent";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { ChatClient } from "./chat/Chat.client";

export const Route = createLazyFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  setThreadId(undefined);
  return (
    <>
      <DashContent>
        <MtSuspenseBoundary>
          <ChatClient />
        </MtSuspenseBoundary>
      </DashContent>
    </>
  );
}
