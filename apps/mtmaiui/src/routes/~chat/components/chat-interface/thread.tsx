"use client";
import { ArrowDownIcon, SendHorizonalIcon, SquarePen } from "lucide-react";
import type { FC } from "react";

import { ComposerPrimitive, ThreadPrimitive } from "@assistant-ui/react";
import type { ChatSession, ProgrammingLanguageOptions } from "mtmaiapi";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { cn } from "mtxuilib/lib/utils";
import { TooltipIconButton } from "mtxuilib/mt/tooltip-icon-button";
import { useToast } from "mtxuilib/ui/use-toast";
import { useWorkbenchStore } from "../../../../stores/workbrench.store";
import { TeamCombo } from "../../../~team/TeamCombo";
import { AssistantMessage, UserMessage } from "./messages";
import { ThreadWelcome } from "./welcome";
const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="flex w-[calc(100%-32px)] max-w-[40rem] items-end rounded-lg border p-0.5 transition-shadow focus-within:shadow-sm">
      <ComposerPrimitive.Input
        placeholder="Write a message..."
        className="h-12 max-h-40 flex-grow resize-none bg-transparent p-3.5 text-sm outline-none placeholder:text-foreground/50"
      />
      <ComposerPrimitive.Send className="m-2 flex h-8 w-8 items-center justify-center rounded-md bg-foreground font-bold text-2xl shadow transition-opacity disabled:opacity-10">
        <SendHorizonalIcon className="size-4 text-background" />
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
};

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
  setChatStarted: (chatStarted: boolean) => void;
  // switchSelectedThreadCallback: (thread: ThreadType) => void;
  switchSelectedThreadCallback: (thread: ChatSession) => void;
}

export const Thread = (props: ThreadProps) => {
  const {
    setChatStarted,
    hasChatStarted,
    handleQuickStart,
    switchSelectedThreadCallback,
  } = props;
  const { toast } = useToast();
  // const {
  //   userData: { user },
  //   threadData: { createThread, modelName, setModelName },
  //   assistantsData: { selectedAssistant },
  //   graphData: { clearState, runId, feedbackSubmitted, setFeedbackSubmitted },
  // } = useGraphContext();

  // useLangSmithLinkToolUI();

  const handleCreateThread = async () => {
    // if (!user) {
    //   toast({
    //     title: "User not found",
    //     description: "Failed to create thread without user",
    //     duration: 5000,
    //     variant: "destructive",
    //   });
    //   return;
    // }
    // setModelName(modelName);
    // clearState();
    // setChatStarted(false);
    // const thread = await createThread(modelName, user.id);
    // if (!thread) {
    //   toast({
    //     title: "Failed to create a new thread",
    //     duration: 5000,
    //     variant: "destructive",
    //   });
    // }
  };

  const feedbackSubmitted = useWorkbenchStore((x) => x.feedbackSubmitted);
  const setFeedbackSubmitted = useWorkbenchStore((x) => x.setFeedbackSubmitted);
  const runId = useWorkbenchStore((x) => x.runId);
  const setTeamId = useWorkbenchStore((x) => x.setTeamId);

  const messages = useWorkbenchStore((x) => x.messages);

  return (
    <ThreadPrimitive.Root className="flex flex-col h-full">
      <div className="pr-3 pl-6 pt-3 pb-2 flex flex-row gap-4 items-center justify-between ">
        {/* 聊天窗体顶部工具栏 */}
        <div className="flex items-center justify-start gap-2 text-gray-600">
          {/* <ThreadHistory
            switchSelectedThreadCallback={switchSelectedThreadCallback}
          /> */}
          {/* <div className="bg-red-100 w-full">
            <CustomLink to="/ag_state">查看状态</CustomLink>
          </div> */}
          <MtErrorBoundary>
            <TeamCombo
              onChange={(value) => {
                setTeamId(value as string);
              }}
            />
          </MtErrorBoundary>
          {/* {!hasChatStarted && (
            <ModelSelector
              chatStarted={false}
              modelName={modelName}
              setModelName={setModelName}
            />
          )} */}
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
      <ThreadPrimitive.Viewport
        className={cn(
          "flex-1 overflow-y-auto scroll-smooth bg-inherit px-2 pt-2 justify-center mx-auto",
          hasChatStarted ? "bg-amber-100" : "bg-inherit",
          "max-h-[calc(100vh-200px)]",
        )}
      >
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
