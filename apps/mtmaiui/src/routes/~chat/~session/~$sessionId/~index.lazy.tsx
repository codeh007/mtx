import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import type { Attachment, UIMessage } from "ai";
import { Chat } from "../../../../aichatbot/chat";
import { DataStreamHandler } from "../../../../aichatbot/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "../../../../aichatbot/lib/ai/models";
import type { DBChatMessage } from "../../../../db/schema";
import { MtmaiuiConfig } from "../../../../lib/config";

export const Route = createLazyFileRoute("/chat/session/$sessionId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const chatQuery = useQuery({
    queryKey: ["chat", sessionId],
    queryFn: async () => {
      const response = await fetch(`${MtmaiuiConfig.apiEndpoint}/api/chat?chatId=${sessionId}`);
      return response.json();
    },
  });

  const chatMessageQuery = useQuery({
    queryKey: ["chatMessage", sessionId],
    queryFn: async () => {
      const response = await fetch(
        `${MtmaiuiConfig.apiEndpoint}/api/chat_message?chatId=${sessionId}`,
      );
      return response.json();
    },
  });

  function convertToUIMessages(messages: Array<DBChatMessage>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: "",
      createdAt: message.createdAt,
      experimental_attachments: (message.attachments as Array<Attachment>) ?? [],
    }));
  }
  return (
    <>
      <Chat
        id={chatQuery.data?.id}
        initialMessages={convertToUIMessages(chatMessageQuery.data?.rows ?? [])}
        initialChatModel={DEFAULT_CHAT_MODEL}
        // initialVisibilityType={chat.visibility}
        // isReadonly={session?.user?.id !== chat.userId}
        // session={session}
        initialVisibilityType={"private"}
        autoResume={true}
      />
      <DataStreamHandler id={sessionId} />
    </>
  );
}
