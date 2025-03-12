import { createLazyFileRoute } from "@tanstack/react-router";
import { DashContent } from "../../../components/DashContent";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
// import { TeamListView } from "../../~team/TeamListView";

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
