import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { agentGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { MtTabs, MtTabsList, MtTabsTrigger } from "mtxuilib/mt/tabs";
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

  const agentQuery = useSuspenseQuery({
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
      <DebugValue data={agentQuery.data} />
      <MtTabs defaultValue="agent" className="w-full">
        <MtTabsList layout="underlined">
          <CustomLink to="agent">
            <MtTabsTrigger variant="underlined" value="agent">
              agent
            </MtTabsTrigger>
          </CustomLink>
          <CustomLink to="model">
            <MtTabsTrigger variant="underlined" value="model">
              model
            </MtTabsTrigger>
          </CustomLink>
        </MtTabsList>
        <Outlet />
      </MtTabs>
    </ZForm>
  );
}
