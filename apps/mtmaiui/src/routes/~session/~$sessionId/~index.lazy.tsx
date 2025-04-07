import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatClient } from "../../../components/chat/Chat.client";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ChatClient />
    </>
  );
}
