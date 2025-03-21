import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ModalProvider } from "../../../stores/model.store";
import { TeamBuilderProvider } from "../../../stores/teamBuildStore";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";
import { RootAppWrapper } from "../../components/RootAppWrapper";
import { TeamBuilder } from "../../components/views/team/builder/builder";
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
          <ModalProvider>
            <TeamBuilderHeader comId={comId} />
            <TeamBuilder />

            <Outlet />
          </ModalProvider>
        </RootAppWrapper>
      </TeamBuilderProvider>
    </WorkbrenchProvider>
  );
}
