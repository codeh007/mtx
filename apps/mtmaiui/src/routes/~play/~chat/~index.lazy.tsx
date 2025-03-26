import { createLazyFileRoute } from "@tanstack/react-router";
import { DashContent } from "mtxuilib/mt/DashContent";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/play/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  setThreadId(undefined);
  return (
    <DashContent>
      {/* <TeamListView /> */}
      {/* <ThreadWelcome /> */}
    </DashContent>
  );
}
