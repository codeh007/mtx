import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { MtSessionProvider } from "../../stores/SessionProvider";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { NavSession } from "./siderbar";

export const Route = createLazyFileRoute("/session")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <RootAppWrapper secondSidebar={<NavSession />}>
        <MtSuspenseBoundary>
          <MtSessionProvider>
            <Outlet />
          </MtSessionProvider>
        </MtSuspenseBoundary>
      </RootAppWrapper>
    </WorkbrenchProvider>
  );
}
