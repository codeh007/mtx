import { createLazyFileRoute } from "@tanstack/react-router";
import { AgentEventType } from "mtmaiapi";
import { SocialTeamEditor } from "../../components/chat/SocialTeamEditor";
import { BoltPromptBox } from "../../components/chat/prompt-input/BoltPromptBox";
import { useWorkbenchStore } from "../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);
  const input = useWorkbenchStore((x) => x.input);
  const isStreaming = useWorkbenchStore((x) => x.isStreaming);
  const chatStarted = useWorkbenchStore((x) => x.chatStarted);
  const setInput = useWorkbenchStore((x) => x.setInput);

  return (
    <>
      {/* <ChatClient /> */}

      <SocialTeamEditor />

      <BoltPromptBox
        input={input}
        sendMessage={(message) => {
          if (!message) return;
          handleHumanInput({
            type: AgentEventType.CHAT_MESSAGE_INPUT,
            content: message,
          });
        }}
        isStreaming={isStreaming}
        chatStarted={chatStarted}
        handleInputChange={setInput}
        // handleStop={handleStop}
        // textareaRef={textareaRef}
      />
    </>
  );
}
