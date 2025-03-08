import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/resource/create/res/platform_account",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/resource/create/res/platform_account"!</div>;
}
