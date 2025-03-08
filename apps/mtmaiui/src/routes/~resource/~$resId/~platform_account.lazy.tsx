import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/resource/$resId/platform_account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>账号</h1>
    </div>
  );
}
