import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/coms/$comId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <Outlet />
    </WorkbrenchProvider>
  );
}
