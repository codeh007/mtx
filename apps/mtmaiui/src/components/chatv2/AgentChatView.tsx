"use client";
import { Bug, Moon, Sun, Trash } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { adkSessionGetOptions } from "mtmaiapi";
import { type AdkEvent, type Content, type Part, adkEventsListOptions } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Button } from "mtxuilib/ui/button";
import { Switch } from "mtxuilib/ui/switch";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTenantId } from "../../hooks/useAuth";
import { useWorkbenchStore } from "../../stores/workbrench.store";
import { Avatar } from "../cloudflare-agents/components/avatar/Avatar";
import { Card } from "../cloudflare-agents/components/card/Card";
import { ChatInput } from "./ChatInput";
import { AdkWelcomeCard } from "./ChatWelcome";

interface AgentChatViewProps {
  sessionId: string;
}
export default function AgentChatView({ sessionId }: AgentChatViewProps) {
  // const [rootState, setRootState] = useState<RootAgentState>();
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    // Check localStorage first, default to dark if not found
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as "dark" | "light") || "dark";
  });
  const isDebug = useWorkbenchStore((x) => x.isDebug);
  const setIsDebug = useWorkbenchStore((x) => x.setIsDebug);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tid = useTenantId();
  const adkStateQuery = useQuery({
    ...adkSessionGetOptions({
      path: {
        tenant: tid,
        session: sessionId,
      },
    }),
  });

  const adkEventsQuery = useQuery({
    ...adkEventsListOptions({
      path: {
        tenant: tid,
      },
      query: {
        session: sessionId,
      },
    }),
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Apply theme class on mount and when theme changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Scroll to bottom on mount
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-[100vh] w-full p-4 flex justify-center items-center bg-fixed overflow-hidden">
      <div className="h-[calc(100vh-1rem)] w-full mx-auto max-w-lg flex flex-col shadow-xl rounded-md overflow-hidden relative border border-neutral-300 dark:border-neutral-800">
        <div className="px-4 py-3 border-b border-neutral-300 dark:border-neutral-800 flex items-center gap-3 sticky top-0 z-10">
          <div className="flex items-center justify-center h-8 w-8">
            <svg width="28px" height="28px" className="text-[#F48120]" data-icon="agents">
              <title>Agent Chat</title>
              <symbol id="ai:local:agents" viewBox="0 0 80 79">
                <path
                  fill="currentColor"
                  d="M69.3 39.7c-3.1 0-5.8 2.1-6.7 5H48.3V34h4.6l4.5-2.5c1.1.8 2.5 1.2 3.9 1.2 3.8 0 7-3.1 7-7s-3.1-7-7-7-7 3.1-7 7c0 .9.2 1.8.5 2.6L51.9 30h-3.5V18.8h-.1c-1.3-1-2.9-1.6-4.5-1.9h-.2c-1.9-.3-3.9-.1-5.8.6-.4.1-.8.3-1.2.5h-.1c-.1.1-.2.1-.3.2-1.7 1-3 2.4-4 4 0 .1-.1.2-.1.2l-.3.6c0 .1-.1.1-.1.2v.1h-.6c-2.9 0-5.7 1.2-7.7 3.2-2.1 2-3.2 4.8-3.2 7.7 0 .7.1 1.4.2 2.1-1.3.9-2.4 2.1-3.2 3.5s-1.2 2.9-1.4 4.5c-.1 1.6.1 3.2.7 4.7s1.5 2.9 2.6 4c-.8 1.8-1.2 3.7-1.1 5.6 0 1.9.5 3.8 1.4 5.6s2.1 3.2 3.6 4.4c1.3 1 2.7 1.7 4.3 2.2v-.1q2.25.75 4.8.6h.1c0 .1.1.1.1.1.9 1.7 2.3 3 4 4 .1.1.2.1.3.2h.1c.4.2.8.4 1.2.5 1.4.6 3 .8 4.5.7.4 0 .8-.1 1.3-.1h.1c1.6-.3 3.1-.9 4.5-1.9V62.9h3.5l3.1 1.7c-.3.8-.5 1.7-.5 2.6 0 3.8 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7c-1.5 0-2.8.5-3.9 1.2l-4.6-2.5h-4.6V48.7h14.3c.9 2.9 3.5 5 6.7 5 3.8 0 7-3.1 7-7s-3.1-7-7-7m-7.9-16.9c1.6 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.4-3 3-3m0 41.4c1.6 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.4-3 3-3M44.3 72c-.4.2-.7.3-1.1.3-.2 0-.4.1-.5.1h-.2c-.9.1-1.7 0-2.6-.3-1-.3-1.9-.9-2.7-1.7-.7-.8-1.3-1.7-1.6-2.7l-.3-1.5v-.7q0-.75.3-1.5c.1-.2.1-.4.2-.7s.3-.6.5-.9c0-.1.1-.1.1-.2.1-.1.1-.2.2-.3s.1-.2.2-.3c0 0 0-.1.1-.1l.6-.6-2.7-3.5c-1.3 1.1-2.3 2.4-2.9 3.9-.2.4-.4.9-.5 1.3v.1c-.1.2-.1.4-.1.6-.3 1.1-.4 2.3-.3 3.4-.3 0-.7 0-1-.1-2.2-.4-4.2-1.5-5.5-3.2-1.4-1.7-2-3.9-1.8-6.1q.15-1.2.6-2.4l.3-.6c.1-.2.2-.4.3-.5 0 0 0-.1.1-.1.4-.7.9-1.3 1.5-1.9 1.6-1.5 3.8-2.3 6-2.3q1.05 0 2.1.3v-4.5c-.7-.1-1.4-.2-2.1-.2-1.8 0-3.5.4-5.2 1.1-.7.3-1.3.6-1.9 1s-1.1.8-1.7 1.3c-.3.2-.5.5-.8.8-.6-.8-1-1.6-1.3-2.6-.2-1-.2-2 0-2.9.2-1 .6-1.9 1.3-2.6.6-.8 1.4-1.4 2.3-1.8l1.8-.9-.7-1.9c-.4-1-.5-2.1-.4-3.1s.5-2.1 1.1-2.9q.9-1.35 2.4-2.1c.9-.5 2-.8 3-.7.5 0 1 .1 1.5.2 1 .2 1.8.7 2.6 1.3s1.4 1.4 1.8 2.3l4.1-1.5c-.9-2-2.3-3.7-4.2-4.9q-.6-.3-.9-.6c.4-.7 1-1.4 1.6-1.9.8-.7 1.8-1.1 2.9-1.3.9-.2 1.7-.1 2.6 0 .4.1.7.2 1.1.3V72zm25-22.3c-1.6 0-3-1.3-3-3 0-1.6 1.3-3 3-3s3 1.3 3 3c0 1.6-1.3 3-3 3"
                />
              </symbol>
              <use href="#ai:local:agents" />
            </svg>
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-base">AI Chat Agent</h2>
          </div>

          <div className="flex items-center gap-2 mr-2">
            <Bug size={16} />
            <Switch
              checked={isDebug}
              aria-label="Toggle debug mode"
              onClick={() => setIsDebug(!isDebug)}
            />
          </div>

          <Button variant="ghost" className="rounded-full h-9 w-9" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun size={20} className="size-4" />
            ) : (
              <Moon size={20} className="size-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9"
            // onClick={clearHistory}
          >
            <Trash className="size-4" />
          </Button>
          <DebugValue data={adkStateQuery.data} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 max-h-[calc(100vh-10rem)]">
          <AdkEventsView sessionId={sessionId} />
          {!!adkEventsQuery.data?.rows?.length && <AdkWelcomeCard />}

          {adkEventsQuery.data?.rows?.map((m: AdkEvent, index) => {
            const isUser = m.author === "user";
            // const isUser = m.role === "user";
            // const showAvatar = index === 0 || agentMessages[index - 1]?.role !== m.role;
            const showAvatar = true;
            const showRole = showAvatar && !isUser;

            return (
              <div key={m.id}>
                {isDebug && <DebugValue data={m} />}
                <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {showAvatar && !isUser ? (
                      <Avatar username={"AI"} />
                    ) : (
                      !isUser && <div className="w-8" />
                    )}

                    <div>
                      <div>
                        {m.content.parts?.map((part, i) => {
                          if (part.type === "text") {
                            return (
                              <div key={i}>
                                <Card
                                  className={`p-3 rounded-md bg-neutral-100 dark:bg-neutral-900 ${
                                    isUser
                                      ? "rounded-br-none"
                                      : "rounded-bl-none border-assistant-border"
                                  } ${
                                    part.text.startsWith("scheduled message")
                                      ? "border-accent/50"
                                      : ""
                                  } relative`}
                                >
                                  {part.text.startsWith("scheduled message") && (
                                    <span className="absolute -top-3 -left-2 text-base">🕒</span>
                                  )}
                                  <p className="text-sm whitespace-pre-wrap">
                                    {part.text.replace(/^scheduled message: /, "")}
                                  </p>
                                </Card>
                                <p
                                  className={`text-xs text-muted-foreground mt-1 ${
                                    isUser ? "text-right" : "text-left"
                                  }`}
                                >
                                  {/* 时间字段待修正 */}
                                  {formatTime(new Date(m.timestamp as unknown as string))}
                                </p>
                              </div>
                            );
                          }

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
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput />
      </div>
    </div>
  );
}

interface AdkEventsViewProps {
  sessionId: string;
}
export const AdkEventsView = ({ sessionId }: AdkEventsViewProps) => {
  const tid = useTenantId();
  const adkStateQuery = useQuery({
    ...adkEventsListOptions({
      path: {
        tenant: tid,
      },
      query: {
        session: sessionId,
      },
    }),
  });

  return (
    <div className=" rounded-md p-2  space-y-1">
      {/* <DebugValue data={{ data: adkStateQuery.data }} /> */}
      {adkStateQuery.data?.rows?.map((item) => {
        return <AdkEventsViewItemView key={item.id} item={item} />;
      })}
    </div>
  );
};

export const AdkEventsViewItemView = ({
  item,
}: {
  item: AdkEvent;
}) => {
  return (
    <div className="border border-gray-100 rounded-md p-2 bg-blue-100">
      event item
      <DebugValue data={item} />
      {item.content && <AdkContentView content={item.content} />}
    </div>
  );
};

export const AdkContentView = ({
  content,
}: {
  content: Content;
}) => {
  return (
    <div>
      {content.parts?.map((part, i) => {
        return <AdkContentPartView key={i} part={part} />;
      })}
    </div>
  );
};

export const AdkContentPartView = ({
  part,
}: {
  part: Part;
}) => {
  return <div>{part.text}</div>;
};
