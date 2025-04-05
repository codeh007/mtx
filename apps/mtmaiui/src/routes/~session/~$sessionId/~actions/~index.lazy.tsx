import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/session/$sessionId/actions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SocialLoginAction />
    </div>
  );
}

const SocialLoginAction = () => {
  return (
    <div>
      <h1>SocialLoginAction</h1>
    </div>
  );
};
