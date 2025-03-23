import { createLazyFileRoute } from "@tanstack/react-router";
import { FlowNames } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useWorkbenchStore } from "../../../../../stores/workbrench.store";

export const Route = createLazyFileRoute(
  "/workflows/$workflowId/trigger/gallery/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const workflowRunCreate = useWorkbenchStore(
    (state) => state.workflowRunCreate,
  );
  const handleClick = async () => {
    workflowRunCreate(
      FlowNames.GALLERY,
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
    <>
      <Button onClick={handleClick}>运行 gallery</Button>
    </>
  );
}
