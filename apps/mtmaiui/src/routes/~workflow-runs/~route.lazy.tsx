"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { WorkflowRunProvider } from "../../stores/workflowRunStore";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavWorkflowRuns } from "./siderbar";
export const Route = createLazyFileRoute("/workflow-runs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkflowRunProvider>
      <RootAppWrapper secondSidebar={<NavWorkflowRuns />}>
        <MtSuspenseBoundary>
          <Outlet />
        </MtSuspenseBoundary>
      </RootAppWrapper>
    </WorkflowRunProvider>
  );
}
