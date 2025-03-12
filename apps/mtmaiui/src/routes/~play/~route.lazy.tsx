import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { AgentRpc } from "mtmaiapi/mtmclient/mtmai/mtmpb/agent_worker_pb";
import { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { EventsService } from "mtmaiapi/mtmclient/mtmai/mtmpb/events_pb";
import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";
import { useGomtmClient } from "../../stores/TransportProvider";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavPlayground } from "./sidebar";

export const Route = createLazyFileRoute("/play")({
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
  const nav = Route.useNavigate();
  return (
    <WorkbrenchProvider
      agClient={mtmAgClient}
      eventClient={eventClient}
      dispatcherClient={dispatcherClient}
      runtimeClient={agrpcClient}
      backendUrl={selfBackendend!}
      tenant={tenant!}
      nav={nav}
    >
      {/* <SidebarProvider
        className="min-h-none"
        style={
          {
            "--sidebar-width": "350px", //如果需要左侧双侧边栏 就设置为 350px
          } as React.CSSProperties
        }
      > */}
      <RootAppWrapper secondSidebar={<NavPlayground />}>
        <Outlet />
      </RootAppWrapper>
      {/* </SidebarProvider> */}
    </WorkbrenchProvider>
  );
}
