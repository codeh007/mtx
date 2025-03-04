"use client";
import type { Message } from "ai";
import { useAnimate } from "framer-motion";
import { useSnapScroll } from "mtxuilib/hooks/useSnapScroll";
import { memo, useEffect, useRef } from "react";
import { ToastContainer, cssTransition } from "react-toastify";

import { Icons } from "mtxuilib/icons/icons";
import { cn } from "mtxuilib/lib/utils";
import { usePromptEnhancer } from "../../../../hooks/usePromptEnhancer";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { BaseChat } from "./BaseChat";
const toastAnimation = cssTransition({
  enter: "animated fadeInRight",
  exit: "animated fadeOutRight",
});

interface ChatProps {
  initialMessages?: Message[];
  storeMessageHistory?: (messages: Message[]) => Promise<void>;
}

export function ChatClient(props: ChatProps) {
  // 打开关闭 中间的聊天窗口的动画效果。
  const openChat = useWorkbenchStore((x) => x.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);
  const openWorkbench = useWorkbenchStore((x) => x.openWorkbench);
  useEffect(() => {
    setOpenChat(true);
  }, [setOpenChat]);
  return (
    <>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-w-min w-full",
          {
            "h-screen": true, //保持滚动条在容器内
            "w-0": !openChat,
          },
        )}
      >
        <div
          className={cn(
            "transition-all duration-300 ease-in-out h-full  border-gray-300/50 overflow-scroll mx-auto",
            {
              "opacity-100 visible": openChat,
              "opacity-0 invisible": !openChat,
              "border-r-[1px]": openWorkbench,
              // "overflow-hidden": true,
            },
          )}
          style={
            {
              width: openChat ? "100%" : "0",
              overflow: "hidden",
              "--chat-max-width": "52rem", // 根据实际情况设置 chat 视图的最大宽度
            } as React.CSSProperties
          }
        >
          <ChatImpl />
          <ToastContainer
            closeButton={({ closeToast }) => {
              return (
                <button
                  type="button"
                  className="Toastify__close-button"
                  onClick={closeToast}
                >
                  <Icons.X className="size-4" />
                </button>
              );
            }}
            icon={({ type }) => {
              /**
               * @todo Handle more types if we need them. This may require extra color palettes.
               */
              switch (type) {
                case "success": {
                  return (
                    <div className="i-ph:check-bold text-bolt-elements-icon-success text-2xl">
                      <Icons.check className="size-4" />
                    </div>
                  );
                }
                case "error": {
                  return (
                    <div className="i-ph:warning-circle-bold text-bolt-elements-icon-error text-2xl">
                      <Icons.warning className="size-4" />
                    </div>
                  );
                }
              }

              return undefined;
            }}
            position="bottom-right"
            pauseOnFocusLoss
            transition={toastAnimation}
          />
        </div>
      </div>
    </>
  );
}

export const ChatImpl = memo((props: ChatProps) => {
  // useShortcuts();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const showChat = useWorkbenchStore((x) => x.openChat);
  const [animationScope, animate] = useAnimate();
  const input = useWorkbenchStore((x) => x.input);
  const setInput = useWorkbenchStore((x) => x.setInput);
  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } =
    usePromptEnhancer();
  // const { parsedMessages, parseMessages } = useMessageParser();
  const started = useWorkbenchStore((x) => x.started);
  const TEXTAREA_MAX_HEIGHT = started ? 400 : 200;
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const scrollTextArea = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  const abort = () => {
    stop();
    // chatStore.setKey("aborted", true);
    // setAborted(true);
    // workbenchStore.abortAllActions();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";

      const scrollHeight = textarea.scrollHeight;

      textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
      textarea.style.overflowY =
        scrollHeight > TEXTAREA_MAX_HEIGHT ? "auto" : "hidden";
    }
  }, [input, textareaRef]);

  const runAnimation = async () => {
    if (started) {
      return;
    }

    // await Promise.all([
    //   animate(
    //     "#examples",
    //     { opacity: 0, display: "none" },
    //     { duration: 0.1 },
    //   ),
    //   animate(
    //     "#intro",
    //     { opacity: 0, flex: 1 },
    //     { duration: 0.2, ease: cubicEasingFn },
    //   ),
    // ]);
  };

  const sendMessage = async (messageInput?: string) => {
    // console.log("sendMessage", messageInput, input);
    const _input = messageInput || input;

    if (!_input) {
      return;
    }
    handleHumanInput({ content: _input });
    runAnimation();
    setInput("");
    resetEnhancer();
    textareaRef.current?.blur();
  };

  const [messageRef, scrollRef] = useSnapScroll();
  return (
    <BaseChat
      ref={animationScope}
      // textareaRef={textareaRef}
      input={input}
      showChat={!!showChat}
      isStreaming={false}
      enhancingPrompt={enhancingPrompt}
      promptEnhanced={promptEnhanced}
      sendMessage={sendMessage}
      messageRef={messageRef}
      scrollRef={scrollRef}
      handleStop={abort}
    />
  );
});
