import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";

export const Route = createLazyFileRoute("/session/$sessionId/config")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MtSuspenseBoundary>
      <Outlet />
    </MtSuspenseBoundary>
  );
}
