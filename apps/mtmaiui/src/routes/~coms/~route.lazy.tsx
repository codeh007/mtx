import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { useTenant } from "../../hooks/useAuth";
import { GalleryProvider } from "../../stores/gallerySstore";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavComs } from "./siderbar";

export const Route = createLazyFileRoute("/coms")({
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
      <RootAppWrapper secondSidebar={<NavComs />}>
        <GalleryProvider>
          <Outlet />
        </GalleryProvider>
      </RootAppWrapper>
    </WorkbrenchProvider>
  );
}
