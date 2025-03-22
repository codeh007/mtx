import { useMutation } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { teamRunMutation } from "mtmaiapi";
import { EditFormToolbar } from "mtxuilib/mt/form/EditFormToolbar";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { z } from "zod";
import { useTenantId } from "../../../../../hooks/useAuth";
import { useTeamBuilderStoreV2 } from "../../../../../stores/TeamBuilderStoreV2";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/team")({
  component: RouteComponent,
});

function RouteComponent() {
  const team = useTeamBuilderStoreV2((x) => x.team);
  const { comId } = Route.useParams();

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
    form.handleSubmit(values);
  };
  const tid = useTenantId();
  const runTeamMu = useMutation({
    ...teamRunMutation({}),
  });
  const handleRun = () => {
    console.log("handleRun");
    runTeamMu.mutate({
      path: {
        tenant: tid,
        team: comId,
      },
      body: {
        task: "hello123",
      },
    });
  };

  return (
    <ZForm form={form} handleSubmit={handleSubmit} className="px-4 space-y-4">
      <Outlet />
      <EditFormToolbar form={form} />
      <Button onClick={handleRun}>运行</Button>
    </ZForm>
  );
}
