"use client";
import { createFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DashContent } from "../../components/DashContent";
import { DashHeaders } from "../../components/DashHeaders";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { useTenant } from "../../hooks/useAuth";
export const Route = createFileRoute("/workflows/")({
  component: RouteComponent,
});

const WorkflowTableLazy = dynamic(
  () =>
    import("../../components/workflow/workflow-table").then(
      (x) => x.WorkflowTable,
    ),
  {
    ssr: false,
  },
);

function RouteComponent() {
  const tenant = useTenant();

  if (!tenant) return null;

  return (
    <div className="flex flex-col top-0 left-0 w-full h-full bg-blue-100 p-2">
      <DashSidebar />
      <div className="fixed top-0 left-0 w-full h-full bg-blue-200">
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
              <WorkflowTableLazy />
            </Suspense>
          </DashContent>
        </SidebarInset>
      </div>
    </div>
  );
}
