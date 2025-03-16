import {
  Outlet,
  createLazyFileRoute,
  useRouterState,
} from "@tanstack/react-router";

import { ComponentsProvider } from "../../stores/componentsProvider";
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

  return (
    <WorkbrenchProvider>
      <ComponentsProvider>
        <RootAppWrapper secondSidebar={<NavComs />}>
          <GalleryProvider>
            <Outlet />
          </GalleryProvider>
        </RootAppWrapper>
      </ComponentsProvider>
    </WorkbrenchProvider>
  );
}
