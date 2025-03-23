import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { useWorkbenchStore } from "../../../../../stores/workbrench.store";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/FlowSubDemo/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const workflowRunCreate = useWorkbenchStore(
    (state) => state.workflowRunCreate,
  );
  const handleClick = async () => {
    workflowRunCreate(
      "FlowSubDemo",
      {
        content: "你好",
        topic: "default",
        source: "web",
      },
      {
        hello: "world",
      },
    );
  };
  return (
    <div>
      <Button onClick={handleClick}>运行</Button>
    </div>
  );
}
