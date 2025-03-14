import { createLazyFileRoute } from "@tanstack/react-router";

import { Outlet } from "@tanstack/react-router";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/play/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  // const tenant = useTenant();
  // if (!tenant) {
  //   null;
  // }
  // const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  // if (!selfBackendend) {
  //   null;
  // }

  // const mtmAgClient = useGomtmClient(AgService);
  // const agrpcClient = useGomtmClient(AgentRpc);
  // const eventClient = useGomtmClient(EventsService);
  // const dispatcherClient = useGomtmClient(Dispatcher);

  // const nav = Route.useNavigate();

  return (
    <WorkbrenchProvider>
      <Outlet />
    </WorkbrenchProvider>
  );
}
