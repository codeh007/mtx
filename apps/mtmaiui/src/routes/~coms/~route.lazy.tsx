import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ComponentsProvider } from "../../stores/componentsProvider";
import { GalleryProvider } from "../../stores/gallerySstore";
import { WorkbrenchProvider } from "../../stores/workbrench.store";

export const Route = createLazyFileRoute("/coms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <ComponentsProvider>
        {/* <RootAppWrapper secondSidebar={<NavComs />}> */}
        <GalleryProvider>
          <Outlet />
        </GalleryProvider>
        {/* </RootAppWrapper> */}
      </ComponentsProvider>
    </WorkbrenchProvider>
  );
}
