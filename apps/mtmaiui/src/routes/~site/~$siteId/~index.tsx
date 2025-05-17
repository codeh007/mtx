import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";

export const Route = createFileRoute("/site/$siteId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();

  const site = useQuery({
    queryKey: ["site", siteId],
    queryFn: async () => {
      const res = await fetch(`/api/sites/${siteId}`);
      return res.json();
    },
  });
  return (
    <div>
      <DebugValue data={site.data} />
      <Outlet />
    </div>
  );
}
