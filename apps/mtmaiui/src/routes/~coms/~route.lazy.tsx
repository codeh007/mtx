import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { ComponentsProvider } from "../../stores/componentsProvider";
import { WorkbrenchProvider } from "../../stores/workbrench.store";

export const Route = createLazyFileRoute("/coms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <ComponentsProvider>
        <MtSuspenseBoundary>
          <Outlet />
        </MtSuspenseBoundary>
      </ComponentsProvider>
    </WorkbrenchProvider>
  );
}
