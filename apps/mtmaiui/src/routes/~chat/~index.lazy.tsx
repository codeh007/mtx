import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { generateUUID } from "mtxuilib/lib/utils";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { Chat } from "../../aichatbot/chat";
import { DataStreamHandler } from "../../aichatbot/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "../../aichatbot/lib/ai/models";
import { useNav } from "../../hooks/useNav";

export const Route = createLazyFileRoute("/chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  const nav = useNav();
  const sessionId = generateUUID();
  return (
    <>
      <MtSuspenseBoundary>{/* <AppSidebar /> */}</MtSuspenseBoundary>
      <MtSuspenseBoundary>
        <SidebarInset>
          <Chat
            key={sessionId}
            id={sessionId}
            initialMessages={[]}
            initialChatModel={DEFAULT_CHAT_MODEL}
            initialVisibilityType="private"
            isReadonly={false}
            // session={session}
            autoResume={false}
            api="/api/chat/sse"
          />
          <DataStreamHandler id={sessionId} />
        </SidebarInset>
      </MtSuspenseBoundary>
    </>
  );
}
