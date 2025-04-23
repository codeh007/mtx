"use client";
import type { AdkEventProperties } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useCallback, useEffect, useRef } from "react";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { ChatAvatar } from "../cloudflare-agents/components/avatar/ChatAvatar";
import { Card } from "../cloudflare-agents/components/card/Card";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { AdkWelcomeCard } from "./ChatWelcome";
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
export default function AgentChatView() {
  // const isDebug = useWorkbenchStore((x) => x.isDebug);
  const adkEvents = useWorkbenchStore((x) => x.adkEvents);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll to bottom on mount
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // const agent = useAgent<RootAgentState>({
  //   agent: "chat",
  //   name: "chat-agent-session-1",
  //   onStateUpdate: (newState) => setRootState(newState),
  //   onMessage: (message) => {
  //     console.log("(chat)onMessage", message?.data?.type);
  //     const parsedMessage = JSON.parse(message.data) as AgentOutgoingEvent;
  //     if (parsedMessage?.type === "connected") {
  //       console.log("agent client connected");
  //     } else if (parsedMessage.type === "run-schedule") {
  //       console.log("run schedule", parsedMessage);
  //     } else if (parsedMessage?.type === "error") {
  //       console.log("error", parsedMessage);
  //     } else if (parsedMessage?.type === "schedule") {
  //       console.log("schedule", parsedMessage);
  //     } else if (parsedMessage?.type === "demo-event-response") {
  //       console.log("demo-event-response", parsedMessage);
  //     } else if (parsedMessage?.type === "require-main-access-token") {
  //       console.log("require-main-access-token", parsedMessage);
  //       //@ts-expect-error
  //     } else if (parsedMessage?.type === "cf_agent_use_chat_response") {
  //       // 聊天消息, 可以不处理 chatAgent 会处理
  //     } else {
  //       console.log("chat onMessage: 未知消息", message);
  //     }
  //   },
  // });

  // const {
  //   messages: agentMessages,
  //   input: agentInput,
  //   handleInputChange: handleAgentInputChange,
  //   handleSubmit: handleAgentSubmit,
  //   addToolResult,
  //   clearHistory,
  // } = useAgentChat({
  //   agent,
  //   maxSteps: 5,
  // });

  // Scroll to bottom when messages change
  // useEffect(() => {
  //   agentMessages.length > 0 && scrollToBottom();
  // }, [agentMessages, scrollToBottom]);

  // const pendingToolCallConfirmation = agentMessages.some((m: Message) =>
  //   m.parts?.some(
  //     (part) =>
  //       part.type === "tool-invocation" &&
  //       part.toolInvocation.state === "call" &&
  //       toolsRequiringConfirmation.includes(part.toolInvocation.toolName as keyof typeof tools),
  //   ),
  // );

  return (
    <div className="h-[100vh] w-full p-4 flex justify-center items-center bg-fixed overflow-hidden">
      <div className="h-[calc(100vh-1rem)] w-full mx-auto max-w-lg flex flex-col shadow-xl rounded-md overflow-hidden relative border border-neutral-300 dark:border-neutral-800">
        <ChatHeader />
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 max-h-[calc(100vh-10rem)]">
          {adkEvents && adkEvents.length <= 0 && <AdkWelcomeCard />}
          {adkEvents?.map((m) => {
            return <AdkEventsViewItemView key={m.invocation_id} item={m} />;
          })}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput />
      </div>
    </div>
  );
}

export const AdkEventsViewItemView = ({
  item,
}: {
  item: AdkEventProperties;
}) => {
  const isDebug = useWorkbenchStore((x) => x.isDebug);
  const isUser = item.author === "user";
  // const isUser = m.role === "user";
  // const showAvatar = index === 0 || agentMessages[index - 1]?.role !== m.role;
  const showAvatar = true;
  // const showRole = showAvatar && !isUser;
  return (
    <>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`flex gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {isDebug && <DebugValue data={item} />}
          {showAvatar && !isUser ? (
            <ChatAvatar username={"AI"} />
          ) : (
            !isUser && <div className="w-8" />
          )}
          <div>
            {item.content?.parts?.map((part, i) => {
              // if (part.type === "text") {
              //   return (
              return (
                <div key={i}>
                  {part.text && (
                    <Card
                      className={`p-3 rounded-md bg-neutral-100 dark:bg-neutral-900 ${
                        isUser ? "rounded-br-none" : "rounded-bl-none border-assistant-border"
                      } ${
                        part.text?.startsWith("scheduled message") ? "border-accent/50" : ""
                      } relative`}
                    >
                      {part.text?.startsWith("scheduled message") && (
                        <span className="absolute -top-3 -left-2 text-base">🕒</span>
                      )}
                      <p className="text-sm whitespace-pre-wrap">
                        {part.text?.replace(/^scheduled message: /, "")}
                      </p>
                    </Card>
                  )}

                  {part.functionCall && (
                    <Card className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-900">
                      {isDebug && <DebugValue data={part.functionCall} />}
                      {part.functionCall.name}
                    </Card>
                  )}

                  {/* 时间字段待修正 */}
                  {item?.timestamp && (
                    <p
                      className={`text-xs text-muted-foreground mt-1 ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(new Date(item?.timestamp as unknown as string))}
                    </p>
                  )}
                </div>
              );
              //   );
              // }

              // if (part.type === "tool-invocation") {
              //   const toolInvocation = part.toolInvocation;
              //   const toolCallId = toolInvocation.toolCallId;

              //   if (
              //     toolsRequiringConfirmation.includes(
              //       toolInvocation.toolName as keyof typeof tools,
              //     ) &&
              //     toolInvocation.state === "call"
              //   ) {
              //     return (
              //       <Card
              //         key={i}
              //         className="p-4 my-3 rounded-md bg-neutral-100 dark:bg-neutral-900"
              //       >
              //         <div className="flex items-center gap-2 mb-3">
              //           <div className="bg-[#F48120]/10 p-1.5 rounded-full">
              //             <Robot size={16} className="text-[#F48120]" />
              //           </div>
              //           <h4 className="font-medium">{toolInvocation.toolName}</h4>
              //         </div>

              //         <div className="mb-3">
              //           <h5 className="text-xs font-medium mb-1 text-muted-foreground">
              //             Arguments:
              //           </h5>
              //           <pre className="bg-background/80 p-2 rounded-md text-xs overflow-auto">
              //             {JSON.stringify(toolInvocation.args, null, 2)}
              //           </pre>
              //         </div>

              //         <div className="flex gap-2 justify-end">
              //           <Button
              //             // variant="primary"
              //             size="sm"
              //             // onClick={() =>
              //             //   addToolResult({
              //             //     toolCallId,
              //             //     result: Approval.NO,
              //             //   })
              //             // }
              //           >
              //             Reject
              //           </Button>
              //           <BetterTooltip content={"Accept action"}>
              //             <Button
              //               // variant="primary"
              //               size="sm"
              //               // onClick={() =>
              //               //   addToolResult({
              //               //     toolCallId,
              //               //     result: Approval.YES,
              //               //   })
              //               // }
              //             >
              //               Approve
              //             </Button>
              //           </BetterTooltip>
              //         </div>
              //       </Card>
              //     );
              //   }
              //   return null;
              // }
              // return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// export const AdkContentView = ({
//   content,
// }: {
//   content: Content;
// }) => {
//   return (
//     <div>
//       {content.parts?.map((part, i) => {
//         return <AdkContentPartView key={i} part={part} />;
//       })}
//     </div>
//   );
// };

// export const AdkContentPartView = ({
//   part,
// }: {
//   part: Part;
// }) => {
//   return <div>{part.text}</div>;
// };
