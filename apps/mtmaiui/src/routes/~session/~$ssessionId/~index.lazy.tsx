import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/session/$ssessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { ssessionId } = Route.useParams();
  return (
    <>
      <h1>session home : {ssessionId}</h1>
    </>
  );
}
