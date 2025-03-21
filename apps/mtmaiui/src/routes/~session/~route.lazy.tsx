import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { TeamSessionProvider } from "../../stores/teamSessionProvider";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavSession } from "./siderbar";

export const Route = createLazyFileRoute("/session")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useSearch();
  return (
    <WorkbrenchProvider componentId={comId}>
      <TeamSessionProvider componentId={comId}>
        <RootAppWrapper secondSidebar={<NavSession />}>
          <MtSuspenseBoundary>
            <Outlet />
          </MtSuspenseBoundary>
        </RootAppWrapper>
      </TeamSessionProvider>
    </WorkbrenchProvider>
  );
}
