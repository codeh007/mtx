import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { cn } from "mtxuilib/lib/utils";
import { DashHeaders, HeaderActionConainer } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button, buttonVariants } from "mtxuilib/ui/button";

export const Route = createLazyFileRoute("/coms/$comId/view/$subComId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>子组件</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActionConainer>
          <Button
            // to={`/coms/${comId}/new_session`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            保存
          </Button>
        </HeaderActionConainer>
      </DashHeaders>
      <Outlet />
    </>
  );
}
