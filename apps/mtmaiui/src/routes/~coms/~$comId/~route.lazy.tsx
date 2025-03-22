import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ComponentEditProvider } from "../../../components/component-editor/ComponentEditor.store";
import { TeamBuilderV2Provider } from "../../../stores/TeamBuilderStoreV2";
import { ModalProvider } from "../../../stores/model.store";
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
        <TeamBuilderV2Provider componentId={comId}>
          <RootAppWrapper secondSidebar={<NavComsWithLibrary />}>
            <ComponentEditProvider>
              <ModalProvider>
                <TeamBuilderHeader comId={comId} />

                {/* <TeamBuilder /> */}

                <Outlet />
              </ModalProvider>
            </ComponentEditProvider>
          </RootAppWrapper>
        </TeamBuilderV2Provider>
      </TeamBuilderProvider>
    </WorkbrenchProvider>
  );
}
