import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/resource/$resId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { resId } = Route.useParams();
  return (
    <>
      <Outlet />
    </>
  );
}
