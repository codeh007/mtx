import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/resource/create/res/platform_account")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/resource/create/res/platform_account"!</div>;
}
