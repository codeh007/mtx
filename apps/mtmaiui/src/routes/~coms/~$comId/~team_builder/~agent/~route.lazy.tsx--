import { useQuery } from "@tanstack/react-query";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { type Agent, agentListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { buttonVariants } from "mtxuilib/ui/button";
import { useTenantId } from "../../../../../hooks/useAuth";

export const Route = createLazyFileRoute("/coms/$comId/team_builder/agent")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  const tid = useTenantId();
  const agentsQuery = useQuery({
    ...agentListOptions({
      path: {
        tenant: tid,
      },
      query: {
        team: comId,
      },
    }),
  });
  return (
    <>
      <div className="flex items-center gap-2 justify-end mr-2 pt-2">
        <CustomLink
          to={`/coms/${comId}/team_builder/agent/new`}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <PlusIcon className="size-4" />
        </CustomLink>
        <DebugValue data={agentsQuery.data} />
      </div>
      <div className="flex flex-col gap-2">
        {agentsQuery.data?.rows?.map((agent) => (
          <AgentItem key={agent.metadata?.id} agent={agent} />
        ))}
      </div>
      <Outlet />
    </>
  );
}

function AgentItem({ agent }: { agent: Agent }) {
  const { comId } = Route.useParams();
  return (
    <div className="bg-blue-100 p-2 mb-2">
      <CustomLink
        to={`/coms/${comId}/team_builder/agent/${agent.metadata?.id}`}
      >
        {agent.name}
      </CustomLink>
    </div>
  );
}
