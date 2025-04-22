import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatClient } from "../../../components/chat/Chat.client";

export const Route = createLazyFileRoute("/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const refetchTeamState = useWorkbenchStore((x) => x.refetchTeamState);
  // const teamSate = useWorkbenchStore((x) => x.teamState);
  // useEffect(() => {
  //   refetchTeamState();
  // }, [refetchTeamState]);

  return (
    <>
      {/* <DebugValue data={{ teamSate }} />
      {teamSate && <AgStateView state={teamSate} />} */}
      <ChatClient />
    </>
  );
}
