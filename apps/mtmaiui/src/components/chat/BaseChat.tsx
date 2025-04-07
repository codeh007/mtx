"use client";
import type { Message } from "ai";
import type React from "react";
import { type RefCallback, forwardRef, useMemo } from "react";

import type { MtLlmMessage } from "mtmaiapi";
import { classNames } from "mtxuilib/lib/utils";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { ModelContextMessageView } from "./ModelContextMessageView";
import { BoltPromptBox } from "./prompt-input/BoltPromptBox";

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  // enhancingPrompt?: boolean;
  // promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (messageInput?: string) => void;
  enhancePrompt?: () => void;
  workbrenchChildren?: React.ReactNode;
}

export const BaseChat = forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      isStreaming = false,
      // enhancingPrompt = false,
      // promptEnhanced = false,
      input = "",
      sendMessage,
    },
    ref,
  ) => {
    const messages = useWorkbenchStore((x) => x.messages);
    const chatStarted = useMemo(() => {
      return messages?.length > 0;
    }, [messages]);

    const setInput = useWorkbenchStore((x) => x.setInput);
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    const userAgentState = useWorkbenchStore((x) => x.userAgentState);
    const messagesV2 = (userAgentState?.model_context as any)
      .messages as MtLlmMessage[];

    return (
      <>
        <div
          ref={ref}
          className={classNames(
            "relative flex h-full w-full bg-bolt-elements-background-depth-1 ",
          )}
          data-chat-visible={showChat}
        >
          <div ref={scrollRef} className="flex overflow-scroll w-full h-full">
            <div
              className={classNames(
                "flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full",
              )}
            >
              <div
                className={classNames("pt-2 px-1", {
                  "h-full flex flex-col": chatStarted,
                })}
              >
                {/* <DebugValue data={{ messages, userAgentState }} />                 */}
                <ModelContextMessageView
                  ref={messageRef}
                  messages={messagesV2}
                  elements={[]}
                  actions={[]}
                  indent={0}
                  isStreaming={isStreaming}
                  className="flex flex-col w-full flex-1 max-w-chat pb-3 mx-auto z-1 mb-6"
                />

                <BoltPromptBox
                  // enhancingPrompt={enhancingPrompt}
                  // promptEnhanced={promptEnhanced}
                  input={input}
                  sendMessage={sendMessage}
                  isStreaming={isStreaming}
                  chatStarted={chatStarted}
                  handleInputChange={(message) => setInput(message)}
                  // handleStop={handleStop}
                  textareaRef={textareaRef}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
