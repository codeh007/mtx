"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { DashContent } from "../../components/DashContent";
import { DashHeaders } from "../../components/DashHeaders";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { useTenant } from "../../hooks/useAuth";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
export const Route = createLazyFileRoute("/workflows")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();

  if (!tenant) return null;

  return (
    <RootAppWrapper>
      <DashSidebar />
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
          <MtSuspenseBoundary>
            <Outlet />
          </MtSuspenseBoundary>
        </DashContent>
      </SidebarInset>
    </RootAppWrapper>
  );
}
