import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ComponentDndProvider } from "../../stores/ComponentDndProvider";
import { ComponentsProvider } from "../../stores/componentsProvider";
import { GalleryProvider } from "../../stores/gallerySstore";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavComs } from "./siderbar";

export const Route = createLazyFileRoute("/coms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <ComponentsProvider>
        <ComponentDndProvider>
          <RootAppWrapper secondSidebar={<NavComs />}>
            <GalleryProvider>
              <Outlet />
            </GalleryProvider>
          </RootAppWrapper>
        </ComponentDndProvider>
      </ComponentsProvider>
    </WorkbrenchProvider>
  );
}
