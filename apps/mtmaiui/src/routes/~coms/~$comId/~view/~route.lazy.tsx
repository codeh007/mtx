import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { comsGetOptions } from "mtmaiapi";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { DashHeaders } from "../../../../components/DashHeaders";
import { useTenantId } from "../../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { TeamBuilder } from "../../../components/views/team/builder/builder";

export const Route = createLazyFileRoute("/coms/$comId/view")({
  component: RouteComponent,
});

function RouteComponent() {
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

  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const handleRun = () => {
    handleHumanInput({
      content: "你好",
      componentId: comId,
    });
  };
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
          to={`/workflow-runs`}
          search={{
            backTo: "/coms/$comId/view",
            metadataFilter: [`componentId:${comId}`],
          }}
        >
          运行记录
        </CustomLink>
      </DashHeaders>
      <div className="flex flex-col gap-4 w-full h-full">
        <TeamBuilder team={teamQuery.data} />
      </div>
    </>
  );
}
