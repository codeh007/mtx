"use client";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import type { ChatMessage } from "mtmaiapi";

interface MtMessagesProps {
  messages: ChatMessage[];
}
export const MtMessages = ({ messages }: MtMessagesProps) => {
  return (
    <div className="p-1">
      {messages.map((message) => (
        <ChatMessageItemView key={message.metadata.id} message={message} />
      ))}
    </div>
  );
};

export const ChatMessageItemView = ({ message }: { message: ChatMessage }) => {
  return (
    <div className="bg-slate-100 p-1">
      {message.role === "user" ? (
        <UserMessage msg={message} />
      ) : (
        <AssistantMessage msg={message} />
      )}
    </div>
  );
};

export interface UserMessageProps {
  msg: ChatMessage;
}
export const UserMessage = ({ msg }: UserMessageProps) => {
  return (
    <div className="relative flex w-full max-w-2xl gap-3 pb-12">
      <Avatar>
        <AvatarFallback>Y</AvatarFallback>
      </Avatar>

      <div className="flex-grow">
        <p className="font-semibold">You</p>

        <p className="whitespace-pre-line text-foreground">{msg.content}</p>
      </div>
    </div>
  );
};

export const AssistantMessage = ({ msg }: { msg: ChatMessage }) => {
  return <div className="bg-blue-200 p-1">{msg.content}</div>;
};
