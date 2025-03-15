import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import {
  DashHeaders,
  HeaderActionConainer,
} from "../../../../components/DashHeaders";
import { useParams } from "../../../../hooks/useNav";

export const Route = createLazyFileRoute("/coms/$comId/new_session")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = useParams();
  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <CustomLink to={`/coms/${comId}/view`}>组件</CustomLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>新任务</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <HeaderActionConainer>
          <Button>立即运行</Button>
        </HeaderActionConainer>
      </DashHeaders>
      <Outlet />
    </>
  );
}
