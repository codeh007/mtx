import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { type PlatformAccount, platformAccountListOptions } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import { get_default_social_team_component } from "../../components/autogen_views/team/inline_teams/teams";
import { useTenantId } from "../../hooks/useAuth";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export const Route = createLazyFileRoute("/platform-account/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tid = useTenantId();
  const query = useSuspenseQuery({
    ...platformAccountListOptions({
      path: {
        tenant: tid,
      },
    }),
  });

  const handleRunTeam = useWorkbenchStore((x) => x.handleRunTeam);
  return (
    <div className="flex flex-col h-full w-full ">
      <div>
        <div>
          <CustomLink to="create" className={cn(buttonVariants())}>
            新建
          </CustomLink>
        </div>
      </div>

      <div>
        {/* 响应式列表视图 */}
        {query.data?.rows?.map((item) => (
          <PlatformAccountListItem key={item.metadata?.id} item={item} />
        ))}
      </div>

      <div>
        <Button
          onClick={() => {
            const team = get_default_social_team_component();
            handleRunTeam({
              component: team,
              session_id: "123",
              task: "test",
              init_state: {},
            });
          }}
        >
          运行团队
        </Button>
      </div>
    </div>
  );
}

function PlatformAccountListItem({ item }: { item: PlatformAccount }) {
  return <div>{item.metadata?.id}</div>;
}
