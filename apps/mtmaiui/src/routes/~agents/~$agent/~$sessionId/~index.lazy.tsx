import { createLazyFileRoute } from "@tanstack/react-router";
import { CfAgentChatView } from "../../../../components/chatv2/CfAgentChatView";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/agents/$agent/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { agent, sessionId } = Route.useParams();
  const agentUrl = useWorkbenchStore((state) => state.agentUrl);
  const agentHost = new URL(agentUrl).host;
  return (
    <>
      <CfAgentChatView agentName={agent} agentId={sessionId} host={agentHost} />
    </>
  );
}

// const agentEndpoint = process.env.CF_AGENT_ENDPOINT!;

// const ButtonsAgentInfo = () => {
//   const handleClick = async () => {
//     const response = await fetch(`${agentEndpoint}/api/agent_info`, {
//       method: "POST",
//       body: JSON.stringify({
//         prompt: "Hello, how are you?",
//         agentId: "chat1",
//       }),
//     });
//     const data = await response.json();
//   };
//   return (
//     <>
//       <Button onClick={handleClick}>agent info</Button>
//     </>
//   );
// };
