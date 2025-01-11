"use client";
import { ThreadPrimitive } from "@assistant-ui/react";
import type { Thread as ThreadType } from "@langchain/langgraph-sdk";
import { ArrowDownIcon, SquarePen } from "lucide-react";
import type { ProgrammingLanguageOptions } from "mtxuilib/types";
import type { Dispatch, FC, SetStateAction } from "react";
import { useGraphContext } from "../../stores/GraphContext";

import { TooltipIconButton } from "mtxuilib/assistant-ui/tooltip-icon-button";
import { TighterText } from "mtxuilib/mt/TighterText";
import { useToast } from "mtxuilib/ui/use-toast";
import { useLangSmithLinkToolUI } from "../tool-hooks/LangSmithLinkToolUI";
import { Composer } from "./composer";
import { AssistantMessage, UserMessage } from "./messages";
import ModelSelector from "./model-selector";
import { ThreadWelcome } from "./welcome";

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

export interface ThreadProps {
  userId: string | undefined;
  hasChatStarted: boolean;
  handleQuickStart: (
    type: "text" | "code",
    language?: ProgrammingLanguageOptions,
  ) => void;
  setChatStarted: Dispatch<SetStateAction<boolean>>;
  switchSelectedThreadCallback: (thread: ThreadType) => void;
}

export const Thread: FC<ThreadProps> = (props: ThreadProps) => {
  const {
    setChatStarted,
    hasChatStarted,
    handleQuickStart,
    switchSelectedThreadCallback,
  } = props;
  const { toast } = useToast();
  const {
    userData: { user },
    threadData: { createThread, modelName, setModelName },
    assistantsData: { selectedAssistant },
    graphData: { clearState, runId, feedbackSubmitted, setFeedbackSubmitted },
  } = useGraphContext();

  useLangSmithLinkToolUI();

  const handleCreateThread = async () => {
    if (!user) {
      toast({
        title: "User not found",
        description: "Failed to create thread without user",
        duration: 5000,
        variant: "destructive",
      });
      return;
    }
    setModelName(modelName);
    clearState();
    setChatStarted(false);
    const thread = await createThread(modelName, user.id);
    if (!thread) {
      toast({
        title: "Failed to create a new thread",
        duration: 5000,
        variant: "destructive",
      });
    }
  };

  return (
    <ThreadPrimitive.Root className="flex flex-col h-full">
      <div className="pr-3 pl-6 pt-3 pb-2 flex flex-row gap-4 items-center justify-between">
        <div className="flex items-center justify-start gap-2 text-gray-600">
          {/* <ThreadHistory
            switchSelectedThreadCallback={switchSelectedThreadCallback}
          /> */}
          <TighterText className="text-xl">Open Canvas</TighterText>
          {!hasChatStarted && (
            <ModelSelector
              chatStarted={false}
              modelName={modelName}
              setModelName={setModelName}
            />
          )}
        </div>
        {hasChatStarted ? (
          <TooltipIconButton
            tooltip="New chat"
            variant="ghost"
            className="w-fit h-fit p-2"
            delayDuration={400}
            onClick={handleCreateThread}
          >
            <SquarePen className="w-6 h-6 text-gray-600" />
          </TooltipIconButton>
        ) : (
          <div className="flex flex-row gap-2 items-center">
            {/* //不知为何出现这个错误：  const context = useDialogContext(TRIGGER_NAME, __scopeDialog); */}
            {/* <ReflectionsDialog selectedAssistant={selectedAssistant} /> */}
          </div>
        )}
      </div>
      <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto scroll-smooth bg-inherit px-4 pt-8">
        {!hasChatStarted && (
          <ThreadWelcome
            handleQuickStart={handleQuickStart}
            composer={<Composer chatStarted={false} userId={props.userId} />}
          />
        )}
        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            AssistantMessage: (prop) => (
              <AssistantMessage
                {...prop}
                feedbackSubmitted={feedbackSubmitted}
                setFeedbackSubmitted={setFeedbackSubmitted}
                runId={runId}
              />
            ),
          }}
        />
      </ThreadPrimitive.Viewport>
      <div className="mt-4 flex w-full flex-col items-center justify-end rounded-t-lg bg-inherit pb-4 px-4">
        <ThreadScrollToBottom />
        <div className="w-full max-w-2xl">
          {hasChatStarted && (
            <div className="flex flex-col space-y-2">
              {/* <ModelSelector
                chatStarted={true}
                modelName={modelName}
                setModelName={setModelName}
              /> */}
              <Composer chatStarted={true} userId={props.userId} />
            </div>
          )}
        </div>
      </div>
    </ThreadPrimitive.Root>
  );
};
