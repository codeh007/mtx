import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { DashHeaders, HeaderActionConainer } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { buttonVariants } from "mtxuilib/ui/button";
import { useEffect } from "react";
import { useTenantId } from "../../../../hooks/useAuth";
import { useNav } from "../../../../hooks/useNav";
import { useTeamBuilderStore } from "../../../../stores/teamBuildStore";

export const Route = createLazyFileRoute("/coms/$comId/view")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  const tid = useTenantId();
  // const teamQuery = useSuspenseQuery({
  //   ...comsGetOptions({
  //     path: {
  //       tenant: tid,
  //     },
  //     query: {
  //       com: comId,
  //     },
  //   }),
  // });

  const nav = useNav();
  const selectedNodeId = useTeamBuilderStore((x) => x.selectedNodeId);
  useEffect(() => {
    if (selectedNodeId) {
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
