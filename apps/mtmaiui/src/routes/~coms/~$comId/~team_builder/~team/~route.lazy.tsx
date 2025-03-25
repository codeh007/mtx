import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { teamGetOptions, teamRunMutation } from "mtmaiapi";
import { zTeam } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { useTenantId } from "../../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/team")({
  component: RouteComponent,
});

function RouteComponent() {
  // const team = useTeamBuilderStoreV2((x) => x.team);
  const tid = useTenantId();
  const { comId } = Route.useParams();

  const teamQuery = useSuspenseQuery({
    ...teamGetOptions({
      path: {
        tenant: tid,
        team: comId,
      },
    }),
  });

  const form = useZodForm({
    schema: zTeam,
    defaultValues: {
      ...teamQuery.data,
    },
  });
  const handleSubmit = (values) => {
    form.handleSubmit(values);
  };
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
      <ZFormToolbar form={form} />
      <Button onClick={handleRun}>运行</Button>
    </ZForm>
  );
}
