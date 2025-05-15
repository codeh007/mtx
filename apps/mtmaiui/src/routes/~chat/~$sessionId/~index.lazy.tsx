import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { Chat } from "../../../aichatbot/chat";
import { DataStreamHandler } from "../../../aichatbot/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "../../../aichatbot/lib/ai/models";

export const Route = createLazyFileRoute("/chat/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  //TODO: 从数据库中获取初始消息
  const initMessages = [];
  return (
    <>
      <MtSuspenseBoundary>{/* <AppSidebar /> */}</MtSuspenseBoundary>
      <MtSuspenseBoundary>
        <SidebarInset>
          sessionId:{sessionId}
          <Chat
            key={sessionId}
            id={sessionId}
            initialMessages={initMessages}
            initialChatModel={DEFAULT_CHAT_MODEL}
            initialVisibilityType="private"
            isReadonly={false}
            // session={session}
            autoResume={false}
            api="/api/chat"
          />
          <DataStreamHandler id={sessionId} />
        </SidebarInset>
      </MtSuspenseBoundary>
    </>
  );
}
