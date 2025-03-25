import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { modelGetOptions, modelUpsertMutation } from "mtmaiapi";
import { zUpsertModel } from "mtmaiapi/gomtmapi/zod.gen";
import { ZFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { ModelClientForm } from "../../../components/model/ModelForm";
import { useTenantId } from "../../../hooks/useAuth";

export const Route = createLazyFileRoute("/model/$modelId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { modelId } = Route.useParams();
  const tid = useTenantId();
  const modelQuery = useSuspenseQuery({
    ...modelGetOptions({
      path: {
        tenant: tid,
        model: modelId,
      },
    }),
  });
  const form = useZodForm({
    schema: zUpsertModel,
    defaultValues: modelQuery.data,
  });
  const modelUpdate = useMutation({
    ...modelUpsertMutation({}),
  });
  const handleSubmit = (values) => {
    modelUpdate.mutate({
      path: {
        tenant: tid,
        model: modelId,
      },
      body: values,
    });
  };
  return (
    <>
      <ZForm form={form} handleSubmit={handleSubmit} className="space-y-4">
        <h1>编辑 model: {modelId}</h1>
        <ModelClientForm />
      </ZForm>
      <ZFormToolbar form={form} />
    </>
  );
}
