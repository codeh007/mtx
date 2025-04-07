"use client";

import type { FunctionCall, FunctionExecutionResultMessage } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CodeExecutorView } from "./CodeExecutor";

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
