"use client";

import {
  ActionBarPrimitive,
  MessagePrimitive,
  useMessage,
} from "@assistant-ui/react";
import React, { type FC } from "react";

import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { TighterText } from "mtxuilib/mt/TighterText";
import { Avatar, AvatarFallback } from "mtxuilib/ui/avatar";
import { useFeedback } from "../../../hooks/useFeedback";
import { FeedbackButton } from "./feedback";

const MarkdownText = makeMarkdownText({});

interface AssistantMessageProps {
  runId: string | undefined;
  feedbackSubmitted: boolean;
  setFeedbackSubmitted: (feedbackSubmitted: boolean) => void;
}

export const AssistantMessage: FC<AssistantMessageProps> = ({
  runId,
  feedbackSubmitted,
  setFeedbackSubmitted,
}) => {
  const isLast = useMessage().isLast;
  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
      <Avatar className="col-start-1 row-span-full row-start-1 mr-4">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>

      <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
        {isLast && runId && (
          <MessagePrimitive.If lastOrHover assistant>
            <AssistantMessageBar
              feedbackSubmitted={feedbackSubmitted}
              setFeedbackSubmitted={setFeedbackSubmitted}
              runId={runId}
            />
          </MessagePrimitive.If>
        )}
      </div>
    </MessagePrimitive.Root>
  );
};

export const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <div className="bg-muted text-foreground col-start-2 row-start-1 max-w-xl break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
};

interface AssistantMessageBarProps {
  runId: string;
  feedbackSubmitted: boolean;
  setFeedbackSubmitted: (feedbackSubmitted: boolean) => void;
}

const AssistantMessageBarComponent = ({
  runId,
  feedbackSubmitted,
  setFeedbackSubmitted,
}: AssistantMessageBarProps) => {
  const { isLoading, sendFeedback } = useFeedback();
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex items-center mt-2"
    >
      {feedbackSubmitted ? (
        <TighterText className="text-gray-500 text-sm">
          Feedback received! Thank you!
        </TighterText>
      ) : (
        <>
          <ActionBarPrimitive.FeedbackPositive asChild>
            <FeedbackButton
              isLoading={isLoading}
              sendFeedback={sendFeedback}
              setFeedbackSubmitted={setFeedbackSubmitted}
              runId={runId}
              feedbackValue={1.0}
              icon="thumbs-up"
            />
          </ActionBarPrimitive.FeedbackPositive>
          <ActionBarPrimitive.FeedbackNegative asChild>
            <FeedbackButton
              isLoading={isLoading}
              sendFeedback={sendFeedback}
              setFeedbackSubmitted={setFeedbackSubmitted}
              runId={runId}
              feedbackValue={0.0}
              icon="thumbs-down"
            />
          </ActionBarPrimitive.FeedbackNegative>
        </>
      )}
    </ActionBarPrimitive.Root>
  );
};

const AssistantMessageBar = React.memo(AssistantMessageBarComponent);
