import { createLazyFileRoute } from "@tanstack/react-router";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/$sessionId/state/")({
  component: RouteComponent,
});

function RouteComponent() {
  const agState = useWorkbenchStore((x) => x.teamState);
  return (
    <div>
      <DebugValue data={{ agState }} />
      agent state view
    </div>
  );
}
