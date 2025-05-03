import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { CfAgentChatView } from "../../../components/chatv2/CfAgentChatView";

export const Route = createLazyFileRoute("/agents/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  return (
    <>
      <div className="absolute top-0 right-0 flex flex-col gap-2">
        <ButtonsAgentInfo />
      </div>

      <CfAgentChatView agentName="chat" agentId={sessionId} />
    </>
  );
}

const agentEndpoint = process.env.CF_AGENT_ENDPOINT!;

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
