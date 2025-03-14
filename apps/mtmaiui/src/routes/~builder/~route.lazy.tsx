import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { useTenant } from "../../hooks/useAuth";
import { useMtmaiV2 } from "../../stores/StoreProvider";
import { GalleryProvider } from "../../stores/gallerySstore";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavBuilder } from "./siderbar";

export const Route = createLazyFileRoute("/builder")({
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
  return (
    <WorkbrenchProvider>
      <RootAppWrapper secondSidebar={<NavBuilder />}>
        <GalleryProvider>
          <Outlet />
        </GalleryProvider>
      </RootAppWrapper>
    </WorkbrenchProvider>
  );
}
