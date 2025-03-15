import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useEffect } from "react";
import { useNav, useParams } from "../../../../hooks/useNav";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/coms/$comId/new_session/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const toast = useToast();
  const nav = useNav();
  const workflowRunId = useWorkbenchStore((x) => x.workflowRunId);
  const { comId } = useParams();
  const handleRun = () => {
    handleHumanInput({
      content: "你好",
      componentId: comId,
    });
  };

  useEffect(() => {
    if (workflowRunId) {
      toast.toast({
        title: "操作成功",
        description: (
          <div className="mt-1 w-[240px] rounded-md p-4 flex justify-center items-center">
            <Button
              onClick={() => {
                toast.dismiss();
                nav({ to: `/workflow-runs/${workflowRunId}` });
              }}
            >
              <span>查看运行</span>
            </Button>
          </div>
        ),
      });
    }
  }, [workflowRunId, toast, nav]);
  return (
    <div>
      <h1>new run session</h1>
      <Button onClick={handleRun}>运行</Button>
    </div>
  );
}
