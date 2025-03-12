import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  return (
    <div>
      <div>comid: {comId}</div>
      <Outlet />
    </div>
  );
}
