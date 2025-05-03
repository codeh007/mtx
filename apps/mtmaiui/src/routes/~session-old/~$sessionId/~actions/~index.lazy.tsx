import { createLazyFileRoute } from "@tanstack/react-router";
import { SocialAddFollowersAction } from "./SocialAddFollowersAction";
import { SocialLoginAction } from "./SocialLoginAction";

export const Route = createLazyFileRoute("/session-old/$sessionId/actions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SocialAddFollowersAction />
      <SocialLoginAction />
    </div>
  );
}