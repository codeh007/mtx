import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/resource/$resId/platform_account/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>账号管理</div>;
}
