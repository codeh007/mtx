import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { AgentRpc } from "mtmaiapi/mtmclient/mtmai/mtmpb/agent_worker_pb";
import { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { EventsService } from "mtmaiapi/mtmclient/mtmai/mtmpb/events_pb";
import { useTenant } from "../../../hooks/useAuth";
import { useMtmaiV2 } from "../../../stores/StoreProvider";
import { useGomtmClient } from "../../../stores/TransportProvider";

export const Route = createLazyFileRoute("/resource/$resId")({
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
    <>
      <Outlet />
    </>
  );
}
