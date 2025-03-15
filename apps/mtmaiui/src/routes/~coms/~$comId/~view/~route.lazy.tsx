import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { useToast } from "mtxuilib/ui/use-toast";
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

  // const workflowRunId = useWorkbenchStore((x) => x.workflowRunId);

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
        <CustomLink to={`/coms/${comId}/new_session`}>新任务</CustomLink>
      </DashHeaders>
      <Outlet />
    </>
  );
}
