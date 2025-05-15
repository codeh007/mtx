import { notFound, redirect } from "next/navigation";

import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { AppSidebar } from "../../../../aichatbot/app-sidebar";
import { Chat } from "../../../../aichatbot/chat";
import { DataStreamHandler } from "../../../../aichatbot/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "../../../../aichatbot/lib/ai/models";
import { getChatById, getMessagesByChatId } from "../../../../db/queries";
import { convertToUIMessages } from "../../../../lib/aisdk_utils";
import { auth } from "../../../../lib/auth/auth";
import { WorkbrenchProvider } from "../../../../stores/workbrench.store";

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
  return (
    <>
      <WorkbrenchProvider>
        <MtSuspenseBoundary>
          <AppSidebar user={session?.user} />
        </MtSuspenseBoundary>
        <MtSuspenseBoundary>
          <SidebarInset>
            <Chat
              key={id}
              id={id}
              initialMessages={convertToUIMessages(messagesFromDb)}
              initialChatModel={DEFAULT_CHAT_MODEL}
              initialVisibilityType="private"
              isReadonly={false}
              session={session}
              autoResume={false}
              api="/api/chat"
            />
            <DataStreamHandler id={id} />
          </SidebarInset>
        </MtSuspenseBoundary>
      </WorkbrenchProvider>
    </>
  );
}
