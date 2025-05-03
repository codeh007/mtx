import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatClient } from "../../components/chat/Chat.client";
import { SocialTeamEditor } from "../../components/chat/SocialTeamEditor";

export const Route = createLazyFileRoute("/session-old/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SocialTeamEditor />
      <ChatClient />
    </>
  );
}
