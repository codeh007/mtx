import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { zUpsertModel } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";

export const Route = createLazyFileRoute("/model/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useZodForm({
    schema: zUpsertModel,
    defaultValues: {
      // name: "default openai model",
      // description: "",
      // provider: "",
      // apiKey: "",
      // apiBase: "",
    },
  });
  return (
    <ZForm form={form} onSubmit={form.handleSubmit}>
      <Outlet />
    </ZForm>
  );
}
