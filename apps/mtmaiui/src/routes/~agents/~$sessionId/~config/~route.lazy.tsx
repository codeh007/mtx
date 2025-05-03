import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";

export const Route = createLazyFileRoute("/agents/$sessionId/config")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MtSuspenseBoundary>
      <Outlet />
    </MtSuspenseBoundary>
  );
}
