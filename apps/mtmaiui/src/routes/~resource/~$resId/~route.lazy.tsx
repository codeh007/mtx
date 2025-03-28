import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { ResourceHeader } from "./header";

export const Route = createLazyFileRoute("/resource/$resId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { resId } = Route.useParams();
  return (
    <>
      <ResourceHeader resId={resId} />
      <Outlet />
    </>
  );
}
