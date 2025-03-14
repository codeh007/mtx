import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { WorkbrenchProvider } from "../../stores/workbrench.store";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavPlayground } from "./sidebar";

export const Route = createLazyFileRoute("/play")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkbrenchProvider>
      <RootAppWrapper secondSidebar={<NavPlayground />}>
        <Outlet />
      </RootAppWrapper>
    </WorkbrenchProvider>
  );
}
