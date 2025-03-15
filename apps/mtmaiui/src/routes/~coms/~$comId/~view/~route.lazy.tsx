import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useEffect } from "react";
import { DashHeaders } from "../../../../components/DashHeaders";
import { useNav } from "../../../../hooks/useNav";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/coms/$comId/view")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  const nav = useNav();
  const { toast } = useToast();

  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const handleRun = () => {
    handleHumanInput({
      content: "你好",
      componentId: comId,
    });
  };

  const workflowRunId = useWorkbenchStore((x) => x.workflowRunId);

  useEffect(() => {
    if (workflowRunId) {
      toast({
        title: "操作成功",
        description: (
          <div className="mt-1 w-[240px] rounded-md p-4 flex justify-center items-center">
            <Button
              onClick={() => {
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
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>查看</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button onClick={handleRun}>运行</Button>
        <CustomLink
          to={"/workflow-runs"}
          search={{
            backTo: `/coms/${comId}/view`,
            metadataFilter: [`componentId:${comId}`],
          }}
        >
          运行记录, workflowRunId: {workflowRunId}
        </CustomLink>
      </DashHeaders>
      <Outlet />
    </>
  );
}
