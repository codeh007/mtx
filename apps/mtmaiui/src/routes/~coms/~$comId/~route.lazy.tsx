import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { TeamBuilderProvider } from "../../../stores/teamBuildStore";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { NavComsWithLibrary } from "./siderbar";
import { TeamBuilderHeader } from "./~team_builder/header";

export const Route = createLazyFileRoute("/coms/$comId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();

  return (
    <WorkbrenchProvider>
      <TeamBuilderProvider componentId={comId}>
        <RootAppWrapper secondSidebar={<NavComsWithLibrary />}>
          <TeamBuilderHeader comId={comId} />

          <Outlet />
        </RootAppWrapper>
      </TeamBuilderProvider>
    </WorkbrenchProvider>
  );
}
