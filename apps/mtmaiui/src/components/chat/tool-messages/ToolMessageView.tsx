"use client";

import { camelCase } from "lodash";
import type { FunctionCall, FunctionExecutionResultMessage } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CodeExecutorView } from "./CodeExecutor";
import { SocialLoginView } from "./SocialLogin";

export const FunctionExecutionResultMessageView = ({
  msg,
}: { msg: FunctionExecutionResultMessage }) => {
  const type = msg.type;
  if (type !== "FunctionExecutionResultMessage") {
    return (
      <div className="bg-red-100 p-1">
        unknown function execution result message type: {type}
      </div>
    );
  }

  const content = msg.content[0];
  const toolName = camelCase(content.name);

  return (
    <div className="bg-blue-200 p-1">
      <DebugValue data={{ msg }} />
      {toolName === "codeExecutor" ? (
        <CodeExecutorView msg={content.content} />
      ) : toolName === "socialLogin" ? (
        <SocialLoginView msg={content.content} />
      ) : (
        <div>unknown function result: {toolName}</div>
      )}
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
  const toolName = camelCase(msg.name);
  return (
    <div className="bg-slate-200 p-1 border">
      <DebugValue data={{ msg }} />
      {toolName === "codeExecutor" ? (
        <CodeExecutorView msg={msg} />
      ) : toolName === "socialLogin" ? (
        <SocialLoginView msg={msg} />
      ) : (
        <div>unknown function call: {msg.name}</div>
      )}
    </div>
  );
};
