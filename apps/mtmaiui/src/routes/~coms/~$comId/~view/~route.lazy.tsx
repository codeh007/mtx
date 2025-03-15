import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { buttonVariants } from "mtxuilib/ui/button";
import {
    DashHeaders,
    HeaderActionConainer,
} from "../../../../components/DashHeaders";

export const Route = createLazyFileRoute("/coms/$comId/view")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  // const nav = useNav();
  // const { toast } = useToast();

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
        <HeaderActionConainer>

          
          <CustomLink
            to={`/coms/${comId}/new_session`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            新任务
          </CustomLink>
        </HeaderActionConainer>
      </DashHeaders>
      <Outlet />
    </>
  );
}
