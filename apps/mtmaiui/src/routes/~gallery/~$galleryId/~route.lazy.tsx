import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/gallery/$galleryId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { galleryId } = Route.useParams();
  return <>gallery Id: {galleryId}</>;
}
