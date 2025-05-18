import { useTenantId } from "@mtmaiui/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { siteGetOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

export const Route = createFileRoute("/site/$siteId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  const tid = useTenantId();
  const site = useQuery({
    ...siteGetOptions({
      path: {
        site: siteId,
        tenant: tid,
      },
    }),
  });
  return (
    <div>
      <DebugValue data={site.data} />
      <Outlet />
    </div>
  );
}
