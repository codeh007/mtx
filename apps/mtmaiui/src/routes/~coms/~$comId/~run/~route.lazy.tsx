import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { DashHeaders } from "../../../../components/DashContent";
import { GoBack } from "../../../../components/GoBack";

export const Route = createLazyFileRoute("/coms/$comId/run")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <GoBack to={".."} />
            <BreadcrumbItem>
              <BreadcrumbPage>运行记录</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <Outlet />
    </>
  );
}
