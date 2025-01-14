import { createFileRoute } from "@tanstack/react-router";
import { PostCreateView } from "../../../../components/post/PostCreateView";
import { useTenant } from "../../../../hooks/useAuth";

export const Route = createFileRoute("/dash/site/post/create")({
  component: CreatePostRouteComponent,
});

function CreatePostRouteComponent() {
  const { siteId } = Route.useSearch();
  const tenant = useTenant();
  return (
    <>
      <PostCreateView tenant={tenant!} siteId={siteId} />
    </>
  );
}
