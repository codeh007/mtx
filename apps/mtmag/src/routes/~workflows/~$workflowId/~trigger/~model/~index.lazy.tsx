import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { useWorkbenchStore } from "../../../../../stores/workbrench.store";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/model/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const workflowRunCreate = useWorkbenchStore(
    (state) => state.workflowRunCreate,
  );
  const handleClick = async () => {
    workflowRunCreate(
      "model",
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
      <Button onClick={handleClick}>运行model</Button>!
    </div>
  );
}
