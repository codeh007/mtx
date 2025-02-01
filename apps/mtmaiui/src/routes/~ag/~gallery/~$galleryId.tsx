import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ag/gallery/$galleryId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { galleryId } = Route.useParams();
  return <>gallery Id: {galleryId}</>;
}
