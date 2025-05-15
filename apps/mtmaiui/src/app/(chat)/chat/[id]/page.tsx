// "use client";
import { useQuery } from "@tanstack/react-query";
import type { Attachment, UIMessage } from "ai";
import { notFound } from "next/navigation";
// import { cookies } from "next/headers";
import { Chat } from "../../../../aichatbot/chat";
import { DataStreamHandler } from "../../../../aichatbot/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "../../../../aichatbot/lib/ai/models";
import { getChatById } from "../../../../db/queries/queries";
// import { getChatById, getMessagesByChatId } from "../../../../db/queries/queries";
import type { DBChatMessage } from "../../../../db/schema";
import { MtmaiuiConfig } from "../../../../lib/config";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const chatQuery = useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const response = await fetch(`${MtmaiuiConfig.apiEndpoint}/api/chat?chatId=${id}`);
      return response.json();
    },
  });

  const chatMessageQuery = useQuery({
    queryKey: ["chatMessage", id],
    queryFn: async () => {
      const response = await fetch(`${MtmaiuiConfig.apiEndpoint}/api/chat_message?chatId=${id}`);
      return response.json();
    },
  });
  // const chat = await chatQuery.json();

  // const session = await auth();

  // if (!session) {
  //   redirect("/api/auth/guest");
  // }

  // if (chatQuery.data?.visibility === "private") {
  //   if (!session.user) {
  //     return notFound();
  //   }

  //   if (session.user.id !== chatQuery.data?.userId) {
  //     return notFound();
  //   }
  // }

  // const messagesFromDb = await getMessagesByChatId({
  //   id,
  // });

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

  // const cookieStore = await cookies();
  // const chatModelFromCookie = cookieStore.get("chat-model");

  // if (!chatModelFromCookie) {
  // return (
  //   <>
  //     <DebugValue data={chatQuery.data} />
  //     <Chat
  //       id={chat.id}
  //       initialMessages={convertToUIMessages(chatMessageQuery.data?.rows ?? [])}
  //       initialChatModel={DEFAULT_CHAT_MODEL}
  //       initialVisibilityType={chat.visibility}
  //       isReadonly={session?.user?.id !== chat.userId}
  //       session={session}
  //       autoResume={true}
  //     />
  //     <DataStreamHandler id={id} />
  //   </>
  // );
  // }

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(chatMessageQuery.data?.rows ?? [])}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType={chat.visibility}
        // isReadonly={session?.user?.id !== chat.userId}
        // session={session}
        autoResume={true}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
