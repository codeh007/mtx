import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { z } from "zod";
import { NavTenantSettings } from "./sidebar";
import { RootAppWrapper } from "../../components/RootAppWrapper";

export const Route = createLazyFileRoute("/tenant/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useZodForm({
    schema: z.any(),
    defaultValues: {},
  });
  const handleSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <RootAppWrapper secondSidebar={<NavTenantSettings />}>
      <ZForm form={form} handleSubmit={handleSubmit}>
        <Outlet />
      </ZForm>
    </RootAppWrapper>
  );
}
