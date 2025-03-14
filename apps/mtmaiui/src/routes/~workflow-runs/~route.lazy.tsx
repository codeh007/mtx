"use client";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useTenant } from "../../hooks/useAuth";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavWorkflowRuns } from "./siderbar";
export const Route = createLazyFileRoute("/workflow-runs")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    return null;
  }
  return (
    <RootAppWrapper secondSidebar={<NavWorkflowRuns />}>
      <MtSuspenseBoundary>
        <Outlet />
      </MtSuspenseBoundary>
    </RootAppWrapper>
  );
}
