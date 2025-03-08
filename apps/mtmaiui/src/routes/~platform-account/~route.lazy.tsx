import { Outlet } from "@tanstack/react-router";

import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { DashContent } from "../../components/DashContent";
import { DashHeaders } from "../../components/DashHeaders";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavPlatformAccount } from "./siderbar";

export const Route = createLazyFileRoute("/platform-account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      className="min-h-none"
      style={
        {
          "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
        } as React.CSSProperties
      }
    >
      <RootAppWrapper>
        <DashSidebar secondSidebar={<NavPlatformAccount />} />
        <SidebarInset>
          <DashHeaders>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Workflows</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DashHeaders>
          <DashContent>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashContent>
        </SidebarInset>
      </RootAppWrapper>
    </SidebarProvider>
  );
}
