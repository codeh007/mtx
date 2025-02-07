import { createFileRoute } from "@tanstack/react-router";
// import { sessionGetOptions } from 'mtmaiapi'
import { useTenant } from "../../hooks/useAuth";
// import path from 'path'

export const Route = createFileRoute("/chat/$chatSessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatSessionId } = Route.useParams();

  const tenant = useTenant();

  // const chatSession = useSuspenseQuery({
  //   ...sessionGetOptions({
  //     path: {
  //       tenant: tenant!.metadata.id,
  //       session: chatSessionId,
  //     },
  //   }),
  // })
  return (
    // <div>{chatSession.data && <ChatView session={chatSession.data} />}</div>
    <> </>
  );
}
