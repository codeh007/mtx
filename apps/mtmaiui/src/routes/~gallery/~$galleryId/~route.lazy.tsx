import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { galleryGetOptions } from "mtmaiapi";
import { useTenantId } from "../../../hooks/useAuth";

export const Route = createLazyFileRoute("/gallery/$galleryId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { galleryId } = Route.useParams();
  const tid = useTenantId();
  const galleryQuery = useQuery({
    ...galleryGetOptions({
      path: {
        tenant: tid,
        gallery: galleryId,
      },
    }),
  });
  return (
    <>
      gallery Id: {galleryId}
      <div>
        <pre>{JSON.stringify(galleryQuery.data, null, 2)}</pre>
      </div>
    </>
  );
}
