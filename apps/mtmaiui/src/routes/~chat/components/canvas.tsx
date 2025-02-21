"use client";

import {
  type AppendMessage,
  AssistantRuntimeProvider,
  type ThreadMessage,
  useExternalMessageConverter,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  type ChatMessage,
  type ProgrammingLanguageOptions,
  chatMessagesListOptions,
} from "mtmaiapi";
// import { Thread } from "mtxuilib/assistant-ui/thread";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { cn } from "mtxuilib/lib/utils";
import { useToast } from "mtxuilib/ui/use-toast";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTenantId, useUser } from "../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { Route } from "../../~__root";
import { WorkflowRunView } from "../../~workflow-runs/components/WorkflowRunView";
import { Thread } from "./chat-interface/thread";

const LZArtifactRenderer = dynamic(
  () =>
    import("./artifacts/ArtifactRenderer").then((mod) => mod.ArtifactRenderer),
  {
    ssr: false,
  },
);

export function CanvasComponent() {
  const { toast } = useToast();
  const chatStarted = useWorkbenchStore((x) => x.chatStarted);
  const setChatStarted = useWorkbenchStore((x) => x.setChatStarted);
  const openWorkBench = useWorkbenchStore((x) => x.openWorkBench);
  const [isEditing, setIsEditing] = useState(false);
  const runId = useWorkbenchStore((x) => x.runId);

  const handleQuickStart = (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => {
    if (type === "code" && !language) {
      toast({
        title: "Language not selected",
        description: "Please select a language to continue",
        duration: 5000,
      });
      return;
    }
    setChatStarted(true);

    // let artifactContent: ArtifactCodeV3 | ArtifactMarkdownV3;
    // if (type === "code" && language) {
    //   artifactContent = {
    //     index: 1,
    //     type: "code",
    //     title: `Quick start ${type}`,
    //     code: getLanguageTemplate(language),
    //     language,
    //   };
    // } else {
    //   artifactContent = {
    //     index: 1,
    //     type: "text",
    //     title: `Quick start ${type}`,
    //     fullMarkdown: "",
    //   };
    // }

    // const newArtifact: ArtifactV3 = {
    //   currentIndex: 1,
    //   contents: [artifactContent],
    // };
    // Do not worry about existing items in state. This should
    // never occur since this action can only be invoked if
    // there are no messages/artifacts in the thread.
    // setArtifact(newArtifact);
    setIsEditing(true);
  };
  const threadId = useWorkbenchStore((x) => x.threadId);
  const nav = Route.useNavigate();
  useEffect(() => {
    if (!threadId) return;
    console.log("CanvasComponent", {
      threadId: threadId,
    });
    nav({ to: `/chat/${threadId}` });
  }, [threadId, nav]);

  const user = useUser();
  const [isRunning, setIsRunning] = useState(false);
  const messages = useWorkbenchStore((x) => x.messages);
  const setMessages = useWorkbenchStore((x) => x.setMessages);
  const submitHumanInput = useWorkbenchStore((x) => x.submitHumanInput);
  async function onNew(message: AppendMessage): Promise<void> {
    if (message.content?.[0]?.type !== "text") {
      toast({
        title: "Only text messages are supported",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    // props.setChatStarted(true);
    setIsRunning(true);

    try {
      submitHumanInput(message.content[0].text);
    } finally {
      setIsRunning(false);
      // Re-fetch threads so that the current thread's title is updated.
      // await getUserThreads(user.id);
    }
  }
  const tid = useTenantId();
  // const threadId = useWorkbenchStore((x) => x.threadId);
  const messagesQuery = useQuery({
    ...chatMessagesListOptions({
      path: {
        tenant: tid,
        chat: threadId!,
      },
    }),
    enabled: !!threadId,
  });

  const messages2 = useMemo(() => {
    const messages3 = messagesQuery.data?.rows?.map((x) => {
      console.log("map message:", x);
      return {
        role: x.role === "user" ? "user" : "assistant",
        id: x.metadata?.id,
        content: x.content,
      };
    });

    setMessages(messages3 ?? []);
  }, [messagesQuery.data]);

  /**
   * 原因:
   *  zustand 的 messages 内部刷新了，但是 useExternalMessageConverter 依赖 callback 的更新来刷新消息。
   *  如果使用官方范例的 convertToChatMessage ，则会导致 zustand 的 messages 内部刷新不及时，只看到前面几个token。
   */
  const callback: useExternalMessageConverter.Callback<ChatMessage> =
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useCallback(
      (message): ThreadMessage | ThreadMessage[] => {
        return {
          role: message.role,
          id: message.metadata?.id,
          content: [{ type: "text", text: message.content }],
          //   metadata: message.metadata,
        };
      },
      [messages],
    );

  const threadMessages = useExternalMessageConverter<ChatMessage>({
    // callback: convertToChatMessage,
    callback,
    messages: messages,
    isRunning,
  });

  const runtime = useExternalStoreRuntime({
    messages: threadMessages,
    isRunning,
    onNew,
  });

  return (
    <main className="flex flex-row h-full">
      <div
        className={cn(
          "transition-all duration-700",
          openWorkBench ? "w-[35%]" : "w-full",
          "h-full mr-auto bg-gray-50/70 shadow-inner-right",
        )}
      >
        <div className="h-full">
          <AssistantRuntimeProvider runtime={runtime}>
            <Thread
              // userId={userData?.user?.id}
              userId={user?.metadata.id}
              setChatStarted={setChatStarted}
              handleQuickStart={handleQuickStart}
              hasChatStarted={chatStarted}
              switchSelectedThreadCallback={() => {}}
            />
          </AssistantRuntimeProvider>
        </div>
      </div>

      {openWorkBench && (
        <MtSuspenseBoundary>
          <div className="w-full ml-auto">
            <LZArtifactRenderer
              setIsEditing={setIsEditing}
              isEditing={isEditing}
            />
          </div>
        </MtSuspenseBoundary>
      )}
      {runId && (
        <MtSuspenseBoundary>
          <div className="w-full ml-auto">
            <WorkflowRunView runId={runId} />
          </div>
        </MtSuspenseBoundary>
      )}
    </main>
  );
}

export const Canvas = React.memo(CanvasComponent);
