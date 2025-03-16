import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
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
        <GalleryProvider>
          <MtSuspenseBoundary>
            <Outlet />
          </MtSuspenseBoundary>
        </GalleryProvider>
      </ComponentsProvider>
    </WorkbrenchProvider>
  );
}
