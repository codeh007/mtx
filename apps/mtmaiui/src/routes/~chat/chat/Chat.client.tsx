"use client";
import type { Message } from "ai";
import { useAnimate } from "framer-motion";
import { useSnapScroll } from "mtxuilib/hooks/useSnapScroll";
import { memo, useEffect, useRef } from "react";
import { ToastContainer, cssTransition } from "react-toastify";

import { Icons } from "mtxuilib/icons/icons";
import { usePromptEnhancer } from "../../../hooks/usePromptEnhancer";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { Route } from "../../~__root";
import { BaseChat } from "./BaseChat";
const toastAnimation = cssTransition({
  enter: "animated fadeInRight",
  exit: "animated fadeOutRight",
});

interface ChatProps {
  initialMessages?: Message[];
  storeMessageHistory?: (messages: Message[]) => Promise<void>;
  // outlet?: React.ReactNode;
}

export function ChatClient(props: ChatProps) {
  const threadId = useWorkbenchStore((x) => x.threadId);
  const nav = Route.useNavigate();
  const chatSessionId = useWorkbenchStore((x) => x.threadId);
  const chatStarted = useWorkbenchStore((x) => x.started);
  const isStreaming = useWorkbenchStore((x) => x.isStreaming);
  // console.log("ChatClient", threadId);
  useEffect(() => {
    console.log("ChatClient", threadId);
    if (threadId) {
      nav({
        to: `/chat/${threadId}`,
      });
    }
  }, [threadId, nav]);
  return (
    <>
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

  // const isLoading = useWorkbrenchStore((x) => x.aisdkIsLoading);
  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } =
    usePromptEnhancer();
  // const { parsedMessages, parseMessages } = useMessageParser();
  const started = useWorkbenchStore((x) => x.started);
  const TEXTAREA_MAX_HEIGHT = started ? 400 : 200;
  // const setStarted = useWorkbrenchStore((x) => x.setStarted);
  // const messages = useWorkbrenchStore((x) => x.messages);
  // const started = useMemo(() => {
  // 	return messages?.length > 0;
  // }, [messages]);
  // useEffect(() => {
  // 	setStarted(initialMessages?.length > 0 || false);
  // }, []);

  // const append = useWorkbrenchStore((x) => x.aisdkAppend);
  // const setAborted = useWorkbrenchStore((x) => x.setAborted);
  // const handleSubmit = useWorkbrenchStore((x) => x.handleSubmit);
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

    /**
     * @note (delm) Usually saving files shouldn't take long but it may take longer if there
     * many unsaved files. In that case we need to block user input and show an indicator
     * of some kind so the user is aware that something is happening. But I consider the
     * happy case to be no unsaved files and I would expect users to save their changes
     * before they send another message.
     */
    // await workbenchStore.saveAllFiles();

    // const fileModifications = workbenchStore.getFileModifcations();

    // chatStore.setKey("aborted", false);
    // setAborted(false);

    runAnimation();

    // if (fileModifications !== undefined) {
    //   const diff = fileModificationsToHTML(fileModifications);

    //   /**
    //    * If we have file modifications we append a new user message manually since we have to prefix
    //    * the user input with the file modifications and we don't want the new user input to appear
    //    * in the prompt. Using `append` is almost the same as `handleSubmit` except that we have to
    //    * manually reset the input and we'd have to manually pass in file attachments. However, those
    //    * aren't relevant here.
    //    */
    //   // append({ role: "user", content: `${diff}\n\n${_input}` });

    //   /**
    //    * After sending a new message we reset all modifications since the model
    //    * should now be aware of all the changes.
    //    */
    //   // workbenchStore.resetAllFileModifications();
    // } else {
    //   // append({ role: "user", content: _input });
    // }

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
      // chatStarted={chatStarted}
      isStreaming={false}
      enhancingPrompt={enhancingPrompt}
      promptEnhanced={promptEnhanced}
      sendMessage={sendMessage}
      messageRef={messageRef}
      scrollRef={scrollRef}
      // handleInputChange={handleAisdkInputChange}
      handleStop={abort}
      // workbrenchChildren={workbrenchChildren}
      // messages={messages.map((message, i) => {
      // 	if (message.role === "user") {
      // 		return message;
      // 	}

      // 	return {
      // 		...message,
      // 		// content: parsedMessages[i] || "",
      // 	};
      // })}
      // enhancePrompt={() => {
      //   enhancePrompt(input, (input) => {
      //     setInput(input);
      //     scrollTextArea();
      //   });
      // }}
    />
  );
});
