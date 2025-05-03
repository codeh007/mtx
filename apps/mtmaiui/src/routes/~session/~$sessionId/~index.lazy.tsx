import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { ChatClient } from "../../../components/chat/Chat.client";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <ButtonsCallAgent />
        <ButtonsAgentInfo />
        <ButtonsAgentFetch />
      </div>

      <ChatClient />
    </>
  );
}

const agentEndpointBase = "https://mtmag.yuepa8.com";

const ButtonsCallAgent = () => {
  const handleClick = async () => {
    const agentEndpoint = `${agentEndpointBase}/agents/chat/chat1`;
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

const ButtonsAgentInfo = () => {
  const handleClick = async () => {
    const agentEndpoint = `${agentEndpointBase}/api/agent_info`;
    const response = await fetch(agentEndpoint, {
      method: "POST",
      body: JSON.stringify({
        prompt: "Hello, how are you?",
        agentId: "chat1",
      }),
    });
    const data = await response.json();
  };
  return (
    <>
      <Button onClick={handleClick}>agent info</Button>
    </>
  );
};

const ButtonsAgentFetch = () => {
  const handleClick = async () => {
    const agentEndpoint = `${agentEndpointBase}/api/agent_fetch/chat1`;
    const response = await fetch(agentEndpoint, {
      method: "POST",
      body: JSON.stringify({
        prompt: "Hello, how are you?",
      }),
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <>
      <Button onClick={handleClick}>agent fetch</Button>
    </>
  );
};
