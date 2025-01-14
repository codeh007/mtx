"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { CustomLink } from "../../../components/CustomLink";
import { DashSidebar } from "../../../components/sidebar/siderbar";
import { useTenant } from "../../../hooks/useAuth";
import { useBasePath } from "../../../hooks/useBasePath";
export const Route = createLazyFileRoute("/dash/workflow-runs")({
  component: RouteComponent,
});

function RouteComponent() {
  const basePath = useBasePath();
  const tenant = useTenant();
  if (!tenant) {
    return <div>require tenant</div>;
  }
  return (
    <>
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<SkeletonListview />}>
            <MtErrorBoundary>
              <div>
                <CustomLink to={`${basePath}/create/oneshot`}>
                  <Button>
                    <PlusIcon className="size-4" />
                    oneshot
                  </Button>
                </CustomLink>
              </div>
              <Outlet />
            </MtErrorBoundary>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}
