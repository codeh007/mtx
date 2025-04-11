import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { DashHeaders } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { RootAppWrapper } from "../../components/RootAppWrapper";

export const Route = createLazyFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootAppWrapper>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>系统管理</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <Outlet />
    </RootAppWrapper>
  );
}
