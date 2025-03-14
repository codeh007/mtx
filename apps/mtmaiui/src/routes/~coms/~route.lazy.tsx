import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

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

  // const tenant = useTenant();
  // if (!tenant) {
  //   null;
  // }
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
