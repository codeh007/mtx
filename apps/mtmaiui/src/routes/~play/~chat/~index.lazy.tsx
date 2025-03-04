import { createLazyFileRoute } from "@tanstack/react-router";
import { DashContent } from "../../../components/DashContent";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/play/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const setThreadId = useWorkbenchStore((x) => x.setThreadId);
  setThreadId(undefined);
  return (
    <DashContent>
      <h1>create new chat view</h1>
      <div className="bg-blue-100 p-2"> teams list</div>
    </DashContent>
  );
}
