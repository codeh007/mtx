import { useMutation } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { modelUpsertMutation } from "mtmaiapi";
import { zUpsertModel } from "mtmaiapi/gomtmapi/zod.gen";
import { generateUUID } from "mtxuilib/lib/utils";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { useTenantId } from "../../../hooks/useAuth";

export const Route = createLazyFileRoute("/model/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const upsertModel = useMutation({
    ...modelUpsertMutation({}),
  });
  const tid = useTenantId();
  const form = useZodForm({
    schema: zUpsertModel,
    defaultValues: {
      name: "default openai model",
      // description: "",
      // provider: "",
      // apiKey: "",
      // apiBase: "",
    },
  });

  const handleSubmit = (values) => {
    upsertModel.mutate({
      path: {
        tenant: tid,
        model: generateUUID(),
      },
      body: { ...values },
    });
  };

  return (
    <ZForm form={form} handleSubmit={handleSubmit}>
      <Outlet />
      {/* {JSON.stringify(form.formState.errors)} */}
      <EditFormToolbar form={form} />
    </ZForm>
  );
}
