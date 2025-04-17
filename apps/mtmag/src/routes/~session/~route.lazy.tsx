import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { NavSession } from "./siderbar";

export const Route = createLazyFileRoute("/session")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { comId } = Route.useSearch();
  return (
    <WorkbrenchProvider>
      <RootAppWrapper secondSidebar={<NavSession />}>
        <MtSuspenseBoundary>
          <Outlet />
        </MtSuspenseBoundary>
      </RootAppWrapper>
    </WorkbrenchProvider>
  );
}
