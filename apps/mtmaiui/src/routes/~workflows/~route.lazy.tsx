"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { DashHeaders } from "../../components/DashHeaders";
import { WorkflowsProvider } from "../../stores/workflow-store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavWorkflow } from "./siderbar";
export const Route = createLazyFileRoute("/workflows")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkflowsProvider>
      <RootAppWrapper secondSidebar={<NavWorkflow />}>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>工作流</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <Outlet />
      </RootAppWrapper>
    </WorkflowsProvider>
  );
}
