"use client";
import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { DashHeaders } from "../../components/DashHeaders";
import { useTenant } from "../../hooks/useAuth";
import { WorkflowRunsTable } from "./components/workflow-runs-table";

export const Route = createLazyFileRoute("/workflow-runs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  return (
    <MtSuspenseBoundary>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>运行记录</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>
      <WorkflowRunsTable tenant={tenant!} showMetrics={true} />
    </MtSuspenseBoundary>
  );
}
