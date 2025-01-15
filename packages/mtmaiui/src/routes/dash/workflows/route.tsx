"use client";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { DashContent } from "../../../components/DashContent";
import { DashHeaders } from "../../../components/DashHeaders";
import { DashSidebar } from "../../../components/sidebar/siderbar";
import { WorkflowTable } from "../../../components/workflow/workflow-table";
import { useTenant } from "../../../hooks/useAuth";
export const Route = createFileRoute("/dash/workflows")({
  component: RouteComponent,
});

// const WorkflowTableLazy = dynamic(
//   () =>
//     import('../../components/workflow/workflow-table').then(
//       (x) => x.WorkflowTable,
//     ),
//   {
//     ssr: false,
//   },
// )

function RouteComponent() {
  const tenant = useTenant();

  if (!tenant) return null;

  return (
    <>
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
          <Suspense fallback={<div>Loading...</div>}>
            <WorkflowTable />
            <Outlet />
          </Suspense>
        </DashContent>
      </SidebarInset>
    </>
  );
}
