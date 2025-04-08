"use client";

import { camelCase } from "lodash";
import type { ChatMessage, FunctionCall } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { CodeExecutorView } from "./CodeExecutor";
import { SocialLoginView } from "./SocialLogin";

export const FunctionExecutionResultMessageView = ({
  msg,
}: { msg: ChatMessage }) => {
  const type = msg.type;
  if (type !== "FunctionExecutionResultMessage") {
    return (
      <div className="bg-red-100 p-1">
        unknown function execution result message type: {type}
      </div>
    );
  }

  // const content = msg.content[0];
  const llm_message = msg.llm_message;
  if (llm_message.type === "FunctionExecutionResultMessage") {
    // const toolName = camelCase(llm_message.content);

    return (
      <div className="p-1 bg-amber-400 rounded-md">
        <pre>{JSON.stringify(llm_message, null, 2)}</pre>
        {/* <FunctionCallView msg={llm_message?.content} /> */}
        {/* {llm_message?.content?.map((item, i) => {
          const toolName = camelCase(item.name);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={i}>
              <DebugValue data={{ msg }} />
              {toolName === "codeExecutor" ? (
                <CodeExecutorView msg={item} />
              ) : toolName === "socialLogin" ? (
                <SocialLoginView msg={item} />
              ) : (
                <div>unknown function result: {toolName}</div>
              )}
            </div>
          );
        })} */}
      </div>
    );
  }
};
export const FunctionCallView = ({ msg }: { msg: FunctionCall[] }) => {
  return (
    <div className="bg-slate-200 p-1">
      FunctionCallView
      <DebugValue data={{ msg }} />
      {msg?.map((item, i) => (
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
