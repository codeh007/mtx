import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { modelListQueryKey, modelUpsertMutation } from "mtmaiapi";
import { zUpsertModel } from "mtmaiapi/gomtmapi/zod.gen";
import { generateUUID } from "mtxuilib/lib/utils";
import { ZForm, ZFormToolbar, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { useToast } from "mtxuilib/ui/use-toast";
import { useTenantId } from "../../../hooks/useAuth";

export const Route = createLazyFileRoute("/model/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const upsertModel = useMutation({
    ...modelUpsertMutation({}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: modelListQueryKey({
          path: {
            tenant: tid,
          },
        }),
      });
      toast.toast({
        title: "model created",
        description: "model created",
      });
    },
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
      <ZFormToolbar form={form} />
    </ZForm>
  );
}
