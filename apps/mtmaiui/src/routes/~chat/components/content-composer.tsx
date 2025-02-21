"use client";

import {
  type AppendMessage,
  AssistantRuntimeProvider,
  type ThreadMessage,
  useExternalMessageConverter,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import {
  type ChatMessage,
  type ChatSession,
  type ProgrammingLanguageOptions,
  chatMessagesListOptions,
} from "mtmaiapi";

import { useQuery } from "@tanstack/react-query";
import { Toaster } from "mtxuilib/ui/toaster";
import { useToast } from "mtxuilib/ui/use-toast";
import React, { useCallback, useMemo, useState } from "react";
import { useTenantId, useUser } from "../../../hooks/useAuth";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { Thread } from "./chat-interface/thread";

export interface ContentComposerChatInterfaceProps {
  switchSelectedThreadCallback: (thread: ChatSession) => void;

  setChatStarted: (chatStarted: boolean) => void;
  hasChatStarted: boolean;
  handleQuickStart: (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => void;
}

export function ContentComposerChatInterfaceComponent(
  props: ContentComposerChatInterfaceProps,
): React.ReactElement {
  const { toast } = useToast();
  const user = useUser();
  const [isRunning, setIsRunning] = useState(false);
  const messages = useWorkbenchStore((x) => x.messages);
  const setMessages = useWorkbenchStore((x) => x.setMessages);
  const submitHumanInput = useWorkbenchStore((x) => x.submitHumanInput);

  // const setTeamId = useWorkbenchStore((x) => x.setTeamId);

  async function onNew(message: AppendMessage): Promise<void> {
    if (message.content?.[0]?.type !== "text") {
      toast({
        title: "Only text messages are supported",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    props.setChatStarted(true);
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
  const threadId = useWorkbenchStore((x) => x.threadId);
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
    <div className="h-full">
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread
          // userId={userData?.user?.id}
          userId={user?.metadata.id}
          setChatStarted={props.setChatStarted}
          handleQuickStart={props.handleQuickStart}
          hasChatStarted={props.hasChatStarted}
          switchSelectedThreadCallback={props.switchSelectedThreadCallback}
        />
      </AssistantRuntimeProvider>
      <Toaster />
    </div>
  );
}

export const ContentComposerChatInterface = React.memo(
  ContentComposerChatInterfaceComponent,
);
