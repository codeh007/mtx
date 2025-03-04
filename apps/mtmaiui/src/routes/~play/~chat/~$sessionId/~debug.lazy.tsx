import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  type AgentRunInput,
  chatSessionGetOptions,
  workflowRunCreate,
} from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { useTenantId } from "../../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
export const Route = createLazyFileRoute("/play/chat/$sessionId/debug")({
  component: RouteComponent,
});

function RouteComponent() {
  const chatStarted = useWorkbenchStore((x) => x.chatStarted);
  const isStreaming = useWorkbenchStore((x) => x.isStreaming);
  const tid = useTenantId();

  const { sessionId } = Route.useParams();

  const handleAg2 = async () => {
    const response = await workflowRunCreate({
      path: {
        workflow: "ag2",
      },
      body: {
        input: {
          tenantId: tid,
          content: "hello",
          // teamId: teamId,
          // sessionId: threadId,
        } satisfies AgentRunInput,
        additionalMetadata: {
          // sessionId: threadId,
        },
      },
    });
  };
  const chatQuery = useSuspenseQuery({
    ...chatSessionGetOptions({
      path: {
        tenant: tid,
        session: sessionId,
      },
    }),
  });

  const teamId = chatQuery.data?.team;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button onClick={handleAg2}>runag2</Button>
      </div>
      <div>teamId:{teamId}</div>
      <div>
        <pre>{JSON.stringify(chatQuery.data, null, 2)}</pre>
      </div>
    </div>
  );
}
