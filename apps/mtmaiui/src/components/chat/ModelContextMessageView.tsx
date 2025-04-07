"use client";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import type {
  AssistantMessage,
  FunctionCall,
  FunctionExecutionResultMessage,
  MtLlmMessage,
  UserMessage,
} from "mtmaiapi";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Markdown } from "mtxuilib/markdown/Markdown";

interface MtMessagesProps {
  messages: MtLlmMessage[];
}
export const ModelContextMessageView = ({ messages }: MtMessagesProps) => {
  return (
    <div className="p-1 px-2">
      <DebugValue data={{ messages }} />
      {messages.map((message, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <MtSuspenseBoundary key={i}>
          <ChatMessageItemView message={message} />
        </MtSuspenseBoundary>
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
      ) : message.type === "FunctionExecutionResultMessage" ? (
        <FunctionExecutionResultMessageView msg={message} />
      ) : (
        <div className="text-sm text-slate-500">
          unknown message type: {message.type}
        </div>
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
      <DebugValue data={{ msg }} />
      <div className="text-sm text-slate-500">
        {msg.type}/{msg.source}
      </div>
      <MtSuspenseBoundary>
        {typeof msg.content === "string" ? (
          <Markdown>{msg.content}</Markdown>
        ) : (
          <FunctionCallView msg={msg.content} />
        )}
      </MtSuspenseBoundary>
    </div>
  );
};

export const FunctionExecutionResultMessageView = ({
  msg,
}: { msg: FunctionExecutionResultMessage }) => {
  return (
    <div>
      FunctionExecutionResultMessageView
      <DebugValue data={{ msg }} />
    </div>
  );
};
export const FunctionCallView = ({ msg }: { msg: FunctionCall[] }) => {
  return (
    <div className="bg-slate-200 p-1">
      <DebugValue data={{ msg }} />
      {msg.map((item, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <FunctionCallItemView key={i} msg={item} />
      ))}
    </div>
  );
};

export const FunctionCallItemView = ({ msg }: { msg: FunctionCall }) => {
  return (
    <div className="bg-slate-200 p-1 border">
      <DebugValue data={{ msg }} />
      {msg.name === "CodeExecutor" ? (
        <CodeExecutorView msg={msg} />
      ) : (
        <div>unknown function call: {msg.name}</div>
      )}
    </div>
  );
};

export const CodeExecutorView = ({ msg }: { msg: any }) => {
  return (
    <div>
      CodeExecutorView
      <pre className="text-xs bg-yellow-100 p-1">
        {JSON.stringify(msg, null, 2)}
      </pre>
    </div>
  );
};
