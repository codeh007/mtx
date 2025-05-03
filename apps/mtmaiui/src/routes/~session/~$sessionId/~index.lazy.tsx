import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { CfAgentChatView } from "../../../components/chatv2/CfAgentChatView";

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

      {/* <ChatClient /> */}
      <CfAgentChatView />
    </>
  );
}

const agentEndpoint = process.env.CF_AGENT_ENDPOINT!;

const ButtonsCallAgent = () => {
  const handleClick = async () => {
    const response = await fetch(`${agentEndpoint}/agents/chat/chat1`, {
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
    const response = await fetch(`${agentEndpoint}/api/agent_info`, {
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
    const response = await fetch(`${agentEndpoint}/api/agent_fetch/chat1`, {
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
