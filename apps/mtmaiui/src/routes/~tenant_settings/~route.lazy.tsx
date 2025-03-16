import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavTenantSettings } from "./sidebar";

export const Route = createLazyFileRoute("/tenant_settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <RootAppWrapper secondSidebar={<NavTenantSettings />}>
        <Outlet />
      </RootAppWrapper>
    </>
  );
}
