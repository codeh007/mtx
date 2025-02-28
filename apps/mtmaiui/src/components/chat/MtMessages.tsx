"use client";

import type { ChatMessage } from "mtmaiapi";

interface MtMessagesProps {
  messages: ChatMessage[];
}
export const MtMessages = ({ messages }: MtMessagesProps) => {
  return (
    <div className="p-1">
      MtMessages
      {messages.map((message) => (
        <ChatMessageItemView key={message.metadata.id} message={message} />
      ))}
    </div>
  );
};

export const ChatMessageItemView = ({ message }: { message: ChatMessage }) => {
  return <div className="bg-red-200 p-1">{message.content}</div>;
};
