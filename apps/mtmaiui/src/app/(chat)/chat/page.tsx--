import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { generateUUID } from "mtxuilib/lib/utils";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { redirect } from "next/navigation";
import { AppSidebar } from "../../../aichatbot/app-sidebar";
import { Chat } from "../../../aichatbot/chat";
import { DataStreamHandler } from "../../../aichatbot/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "../../../aichatbot/lib/ai/models";
import { auth } from "../../../lib/auth/auth";
import { WorkbrenchProvider } from "../../../stores/workbrench.store";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  const id = generateUUID();
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
              initialMessages={[]}
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
