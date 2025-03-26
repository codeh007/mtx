import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { agentGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { Tabs, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
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
      <Tabs defaultValue="agent" className="w-full">
        <TabsList layout="underlined">
          <CustomLink to=".">
            <TabsTrigger variant="underlined" value="agent">
              agent
            </TabsTrigger>
          </CustomLink>
          <CustomLink to="model">
            <TabsTrigger variant="underlined" value="model">
              model
            </TabsTrigger>
          </CustomLink>
        </TabsList>
      </Tabs>
      <Outlet />
    </ZForm>
  );
}
