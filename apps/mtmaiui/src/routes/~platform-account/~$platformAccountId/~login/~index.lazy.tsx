import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/platform-account/$platformAccountId/login/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>登录社交媒体</h1>
    </div>
  );
}
