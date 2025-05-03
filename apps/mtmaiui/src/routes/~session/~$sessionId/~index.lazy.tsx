import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { ChatClient } from "../../../components/chat/Chat.client";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ButtonsCallAgent />
      <ChatClient />
    </>
  );
}

const ButtonsCallAgent = () => {
  const handleClick = async () => {
    const agentEndpoint = "https://mtmag.yuepa8.com/agents/chat/chat1";
    console.log("hello");
    const response = await fetch(agentEndpoint, {
      method: "POST",
      body: JSON.stringify({
        message: "Hello, how are you?",
      }),
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <>
      <Button onClick={handleClick}>Hello</Button>
    </>
  );
};
