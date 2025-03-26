import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Tabs, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
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
              <Tabs defaultValue="visualization" className="w-full">
                <TabsList layout="underlined">
                  <CustomLink to=".">
                    <TabsTrigger variant="underlined" value="visualization">
                      可视化
                    </TabsTrigger>
                  </CustomLink>
                  <CustomLink to="team_builder/team">
                    <TabsTrigger variant="underlined" value="team">
                      团队
                    </TabsTrigger>
                  </CustomLink>
                  <CustomLink to="team_builder/agent">
                    <TabsTrigger variant="underlined" value="agents">
                      agent
                    </TabsTrigger>
                  </CustomLink>
                </TabsList>
              </Tabs>
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
