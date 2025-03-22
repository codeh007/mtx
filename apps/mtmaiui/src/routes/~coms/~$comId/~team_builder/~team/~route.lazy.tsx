import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { z } from "zod";
import { useTeamBuilderStoreV2 } from "../../../../../stores/TeamBuilderStoreV2";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/team")({
  component: RouteComponent,
});

function RouteComponent() {
  const team = useTeamBuilderStoreV2((x) => x.team);

  const form = useZodForm({
    schema: z.object({
      label: z.string().optional(),
      provider: z.string().optional(),
    }),
    defaultValues: {
      ...team,
    },
  });
  const handleSubmit = (values) => {
    // console.log("(handleSubmit)", values);
    form.handleSubmit(values);
  };

  return (
    <ZForm form={form} handleSubmit={handleSubmit} className="px-4 space-y-4">
      <Outlet />
      <EditFormToolbar form={form} />
    </ZForm>
  );
}
