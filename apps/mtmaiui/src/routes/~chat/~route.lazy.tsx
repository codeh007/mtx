import { createLazyFileRoute } from "@tanstack/react-router";
import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";

import { Outlet } from "@tanstack/react-router";
import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { AgentRpc } from "mtmaiapi/mtmclient/mtmai/mtmpb/agent_worker_pb";
import { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { EventsService } from "mtmaiapi/mtmclient/mtmai/mtmpb/events_pb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
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
  const dispatcherClient = useGomtmClient(Dispatcher);
  return (
    <RootAppWrapper className="flex w-full h-full flex-1">
      <DashSidebar />

      <SidebarInset>
        {/* <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

        </DashHeaders> */}
        <WorkbrenchProvider
          agClient={mtmAgClient}
          eventClient={eventClient}
          dispatcherClient={dispatcherClient}
          runtimeClient={agrpcClient}
          backendUrl={selfBackendend!}
          tenant={tenant!}
        >
          <Outlet />
        </WorkbrenchProvider>
      </SidebarInset>
    </RootAppWrapper>
  );
}
