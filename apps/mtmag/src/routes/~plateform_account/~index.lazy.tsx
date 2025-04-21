import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/plateform_account/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/plateform_account/"!</div>;
}
