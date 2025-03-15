import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { comsGetOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { buttonVariants } from "mtxuilib/ui/button";
import { useEffect } from "react";
import {
  DashHeaders,
  HeaderActionConainer,
} from "../../../../components/DashHeaders";
import { useTenantId } from "../../../../hooks/useAuth";
import { useNav } from "../../../../hooks/useNav";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";

export const Route = createLazyFileRoute("/coms/$comId/view")({
  component: RouteComponent,
});

function RouteComponent() {
  // const nav = useNav();
  // const { toast } = useToast();

  // const workflowRunId = useWorkbenchStore((x) => x.workflowRunId);

  const { comId } = Route.useParams();
  const tid = useTenantId();
  const teamQuery = useSuspenseQuery({
    ...comsGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        com: comId,
      },
    }),
  });

  const nav = useNav();
  const selectedNodeId = useTeamBuilderStore((x) => x.selectedNodeId);
  useEffect(() => {
    if (selectedNodeId) {
      // setSelectedNode(selectedNodeId);
      nav({ to: `${selectedNodeId}` });
    }
  }, [selectedNodeId, nav]);

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
