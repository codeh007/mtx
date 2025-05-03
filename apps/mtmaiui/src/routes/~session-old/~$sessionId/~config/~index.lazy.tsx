import { createLazyFileRoute } from "@tanstack/react-router";
import { SocialTeamEditor } from "../../../../components/chat/SocialTeamEditor";

export const Route = createLazyFileRoute("/session-old/$sessionId/config/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SocialTeamEditor />
    </>
  );
}
