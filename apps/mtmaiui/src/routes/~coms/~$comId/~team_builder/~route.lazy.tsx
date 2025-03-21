import { Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/coms/$comId/team_builder")({
  component: RouteComponent,
});

function RouteComponent() {
  const { comId } = Route.useParams();
  return (
    <>
      {/* <TeamBuilderHeader comId={comId} /> */}
      <Outlet />
    </>
  );
}
