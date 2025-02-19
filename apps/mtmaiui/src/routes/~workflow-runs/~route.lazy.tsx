"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { useTenant } from "../../hooks/useAuth";
import { useBasePath } from "../../hooks/useBasePath";
import { RootAppWrapper } from "../components/RootAppWrapper";
export const Route = createLazyFileRoute("/workflow-runs")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    return <div>require tenant</div>;
  }
  return (
    <RootAppWrapper>
      <DashSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>workflow runs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col">
          <Suspense fallback={<SkeletonListview />}>
            <MtErrorBoundary>              
              <Outlet />
            </MtErrorBoundary>
          </Suspense>
        </div>
      </SidebarInset>
    </RootAppWrapper>
  );
}
