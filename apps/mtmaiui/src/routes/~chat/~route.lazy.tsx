import { createLazyFileRoute } from "@tanstack/react-router";
import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";

import { Outlet } from "@tanstack/react-router";
import { AgService } from "mtmaiapi/mtmclient/mtm/sppb/ag_pb";
import { AgentRpc } from "mtmaiapi/mtmclient/mtm/sppb/agent_worker_pb";
import { EventsService } from "mtmaiapi/mtmclient/mtm/sppb/events_pb";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { DashContent } from "../../components/DashContent";
import { DashHeaders } from "../../components/DashHeaders";
import { DashSidebar } from "../../components/sidebar/siderbar";
import { useGomtmClient } from "../../stores/TransportProvider";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { RootAppWrapper } from "../components/RootAppWrapper";

export const Route = createLazyFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();
  if (!tenant) {
    null;
  }
  const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  if (!selfBackendend) {
    null;
  }

  const mtmAgClient = useGomtmClient(AgService);
  const agrpcClient = useGomtmClient(AgentRpc);
  const eventClient = useGomtmClient(EventsService);
  return (
    <RootAppWrapper className="flex w-full h-full flex-1">
      <DashSidebar />

      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <MtSuspenseBoundary>
            <WorkbrenchProvider
              agClient={mtmAgClient}
              eventClient={eventClient}
              runtimeClient={agrpcClient}
              backendUrl={selfBackendend!}
              // accessToken={accessToken}
              // chatProfile={chatProfile}
              // autoConnectWs={false}
              // threadId={threadId}
              tenant={tenant!}
            >
              {/* <GraphProvider agentEndpointBase={selfBackendend!} tenant={tenant!}> */}
              <Outlet />
              {/* </GraphProvider> */}
            </WorkbrenchProvider>
          </MtSuspenseBoundary>
        </DashContent>
      </SidebarInset>
    </RootAppWrapper>
  );
}
