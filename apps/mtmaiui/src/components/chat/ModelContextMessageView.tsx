"use client";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import type { AssistantMessage, MtLlmMessage, UserMessage } from "mtmaiapi";
import { Markdown } from "mtxuilib/markdown/Markdown";

interface MtMessagesProps {
  messages: MtLlmMessage[];
}
export const ModelContextMessageView = ({ messages }: MtMessagesProps) => {
  return (
    <div className="p-1">
      {/* <DebugValue data={{ messages }} /> */}
      {messages.map((message, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <ChatMessageItemView key={i} message={message} />
      ))}
    </div>
  );
};

export const ChatMessageItemView = ({ message }: { message: MtLlmMessage }) => {
  return (
    <div className="bg-slate-100 p-1">
      {message.type === "UserMessage" ? (
        <UserMessageView msg={message} />
      ) : message.type === "AssistantMessage" ? (
        <AssistantMessageView msg={message} />
      ) : (
        <div>unknown message type: {message.type}</div>
      )}
    </div>
  );
};

export interface UserMessageProps {
  msg: UserMessage;
}
export const UserMessageView = ({ msg }: UserMessageProps) => {
  return (
    <div className="relative flex w-full max-w-2xl gap-3 pb-12">
      <Avatar>
        <AvatarFallback>Y</AvatarFallback>
      </Avatar>

      <div className="flex-grow">
        <p className="font-semibold">You</p>

        <div className="whitespace-pre-line text-foreground">
          <Markdown>{msg.content}</Markdown>
        </div>
      </div>
    </div>
  );
};

export const AssistantMessageView = ({ msg }: { msg: AssistantMessage }) => {
  return (
    <div className="bg-slate-200 p-1">
      <div className="text-sm text-slate-500">
        {msg.type}/{msg.source}
      </div>
      <Markdown>{msg.content}</Markdown>
    </div>
  );
};
