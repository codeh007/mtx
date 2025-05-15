import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { Chat } from "../../../../aichatbot/chat";
import { DataStreamHandler } from "../../../../aichatbot/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "../../../../aichatbot/lib/ai/models";
import { getChatById, getMessagesByChatId } from "../../../../db/queries";
import { convertToUIMessages } from "../../../../lib/aisdk_utils";
import { auth } from "../../../../lib/auth/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  if (chat.visibility === "private") {
    if (!session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");

  const chatModel = chatModelFromCookie ? chatModelFromCookie.value : DEFAULT_CHAT_MODEL;
  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        initialChatModel={chatModel}
        initialVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
        session={session}
        autoResume={true}
        api="/api/chat/chat_v2"
      />
      <DataStreamHandler id={id} />
    </>
  );
}
