import { createFileRoute } from "@tanstack/react-router";
import { PostCreateView } from "../../../../components/post/PostCreateView";

export const Route = createFileRoute("/dash/site/post/create")({
  component: CreatePostRouteComponent,
});

function CreatePostRouteComponent() {
  const { siteId } = Route.useSearch();
  return (
    <div>
      create post : {siteId}
      <PostCreateView />
    </div>
  );
}
