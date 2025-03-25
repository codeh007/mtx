import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useZodForm } from "mtxuilib/mt/form/ZodForm.jsx";
import { RootAppWrapper } from "../components/RootAppWrapper";
import { NavTenantSettings } from "./sidebar";

export const Route = createLazyFileRoute("/tenant_settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useZodForm();
  return (
    <RootAppWrapper secondSidebar={<NavTenantSettings />}>
      <Outlet />
    </RootAppWrapper>
  );
}
