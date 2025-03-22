import { useQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { agentGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { z } from "zod";
import { useTenantId } from "../../../../../../hooks/useAuth";

export const Route = createLazyFileRoute(
  "/coms/$comId/team_builder/agent/$agentId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { agentId } = Route.useParams();
  const tid = useTenantId();

  const agentQuery = useQuery({
    ...agentGetOptions({
      path: {
        tenant: tid,
        agent: agentId,
      },
    }),
  });

  const form = useZodForm({
    schema: z.any(),
    defaultValues: agentQuery.data,
  });

  const handleSubmit = (data) => {
    console.log(data);
  };

  return (
    <ZForm form={form} handleSubmit={handleSubmit}>
      <Outlet />
      {/* <AgentForm agentId={agentId} /> */}
      <DebugValue data={agentQuery.data} />
    </ZForm>
  );
}
