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
        <ButtonsCallAgent2 />
        <ButtonsCallAgent3 />
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

const ButtonsCallAgent2 = () => {
  const handleClick = async () => {
    const agentEndpoint = `${agentEndpointBase}/api/query`;
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
      <Button onClick={handleClick}>Hello2</Button>
    </>
  );
};

const ButtonsCallAgent3 = () => {
  const handleClick = async () => {
    const agentEndpoint = `${agentEndpointBase}/agents/step_cb`;
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
      <Button onClick={handleClick}>call step cb</Button>
    </>
  );
};
