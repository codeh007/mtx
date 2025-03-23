import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { MtTabs, MtTabsList, MtTabsTrigger } from "mtxuilib/mt/tabs";
import { ComponentEditProvider } from "../../../components/component-editor/ComponentEditor.store";
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
        {/* <TeamBuilderV2Provider componentId={comId}> */}
        <RootAppWrapper secondSidebar={<NavComsWithLibrary />}>
          <ComponentEditProvider>
            <ModalProvider>
              <TeamBuilderHeader comId={comId} />
              <MtTabs defaultValue="visualization" className="w-full">
                <MtTabsList layout="underlined">
                  <CustomLink to=".">
                    <MtTabsTrigger variant="underlined" value="visualization">
                      可视化
                    </MtTabsTrigger>
                  </CustomLink>
                  <CustomLink to="team_builder/team">
                    <MtTabsTrigger variant="underlined" value="team">
                      团队
                    </MtTabsTrigger>
                  </CustomLink>
                  <CustomLink to="team_builder/agent">
                    <MtTabsTrigger variant="underlined" value="agents">
                      agent
                    </MtTabsTrigger>
                  </CustomLink>
                </MtTabsList>
              </MtTabs>
              <TeamBuilder />
              <Outlet />
            </ModalProvider>
          </ComponentEditProvider>
        </RootAppWrapper>
        {/* </TeamBuilderV2Provider> */}
      </TeamBuilderProvider>
    </WorkbrenchProvider>
  );
}
