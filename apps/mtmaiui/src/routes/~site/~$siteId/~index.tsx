import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/site/$siteId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { siteId } = Route.useParams();
  return (
    <div>
      site home
      <Outlet />
    </div>
  );
}
