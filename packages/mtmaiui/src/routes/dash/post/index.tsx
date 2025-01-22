import { createFileRoute } from "@tanstack/react-router";
import { PostListView } from "../../../components/post/PostListView";

export const Route = createFileRoute("/dash/post/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PostListView />
    </>
  );
}
