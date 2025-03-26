import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

import { DashHeaders } from "mtxuilib/mt/DashContent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavModel } from "./sidebar";

export const Route = createLazyFileRoute("/model")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RootAppWrapper secondSidebar={<NavModel />}>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>模型</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <Outlet />
    </RootAppWrapper>
  );
}
