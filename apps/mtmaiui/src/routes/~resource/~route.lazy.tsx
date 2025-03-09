import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { AgentRpc } from "mtmaiapi/mtmclient/mtmai/mtmpb/agent_worker_pb";
import { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { EventsService } from "mtmaiapi/mtmclient/mtmai/mtmpb/events_pb";
import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";
import { useGomtmClient } from "../../stores/TransportProvider";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavResource } from "./siderbar";

export const Route = createLazyFileRoute("/resource")({
  component: RouteComponent,
});

function RouteComponent() {
  const matches = useRouterState({ select: (s) => s.matches });
  const breadcrumbs = matches
    .filter((match) => match.context.getTitle)
    .map(({ pathname, context }) => {
      return {
        title: context.getTitle(),
        path: pathname,
      };
    });

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
      <RootAppWrapper secondSidebar={<NavResource />}>
        {/* <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>资源</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders> */}
        <Outlet />
      </RootAppWrapper>
    </WorkbrenchProvider>
  );
}
