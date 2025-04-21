import type { Message } from "@ai-sdk/react";
import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Button } from "mtxuilib/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RootAgentState } from "../../../agent_state/root_agent_state";
import { APPROVAL, type OutgoingMessage } from "../../../agent_state/shared";
import type { tools } from "../../../agents/tools";

const ROOMS = [
  { id: "1", label: "RoomA 1" },
  { id: "2", label: "RoomA 2" },
  { id: "3", label: "RoomA 3" },
];

interface ChatProps {
  roomId: string;
}

function ChatRoom({ roomId }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [rootState, setRootState] = useState<RootAgentState>();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const agent = useAgent<RootAgentState>({
    agent: "chat",
    name: `chat-${roomId}`,
    onStateUpdate: (newState) => setRootState(newState),
    onMessage: (message) => {
      console.log("(chat)onMessage", message?.data?.type);
      const parsedMessage = JSON.parse(message.data) as OutgoingMessage;
      if (parsedMessage?.type === "connected") {
        console.log("agent client connected");
      } else if (parsedMessage.type === "run-schedule") {
        console.log("run schedule", parsedMessage);
      } else if (parsedMessage?.type === "error") {
        console.log("error", parsedMessage);
      } else if (parsedMessage?.type === "schedule") {
        console.log("schedule", parsedMessage);
      } else if (parsedMessage?.type === "demo-event-response") {
        console.log("demo-event-response", parsedMessage);
      } else if (parsedMessage?.type === "require-main-access-token") {
        console.log("require-main-access-token", parsedMessage);
      } else if (parsedMessage?.type === "cf_agent_use_chat_response") {
        // 聊天消息, 可以不处理 chatAgent 会处理
      } else {
        console.log("chat onMessage: 未知消息", message);
      }
    },
  });

  const { messages, input, handleInputChange, handleSubmit, clearHistory, addToolResult, data } =
    useAgentChat({
      agent,
      maxSteps: 5,
    });

  useEffect(() => {
    messages.length > 0 && scrollToBottom();
  }, [messages, scrollToBottom]);

  const increment = () => {
    agent.setState({
      ...rootState!,
      counter: (rootState?.counter ?? 0) + 1,
    } satisfies RootAgentState);
  };

  const toolsRequiringConfirmation: (keyof typeof tools)[] = ["getWeatherInformation"];

  return (
    <>
      <div className="flex justify-end gap-3 p-3">
        <Button
          type="button"
          onClick={clearHistory}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          🗑️ 删除对话历史
        </Button>
        <DebugValue data={rootState} />
        <Button
          onClick={increment}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          counter:{rootState?.counter}
        </Button>
        <DebugValue data={data} />
      </div>

      <div className="flex flex-col h-[80vh] max-w-[800px] mx-auto p-5 bg-white rounded-xl shadow-md w-full">
        <div className="flex-1 overflow-y-auto p-5 mb-5">
          {messages?.map((m: Message) => (
            <div key={m.id} className="mb-4 p-3 rounded-lg bg-gray-100 text-gray-800">
              <DebugValue data={m} />
              <strong>{`${m.role}: `}</strong>
              {m.parts?.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div key={i} className="mt-2 leading-relaxed whitespace-pre-wrap">
                        <DebugValue data={part} />
                        {part.text}
                      </div>
                    );
                  case "tool-invocation": {
                    const toolInvocation = part.toolInvocation;
                    const toolCallId = toolInvocation.toolCallId;

                    if (
                      toolsRequiringConfirmation.includes(
                        toolInvocation.toolName as keyof typeof tools,
                      ) &&
                      toolInvocation.state === "call"
                    ) {
                      return (
                        <div key={toolCallId} className="mt-2">
                          工具调用: <span className="font-medium">{toolInvocation.toolName}</span>{" "}
                          with args:{" "}
                          <span className="font-medium">{JSON.stringify(toolInvocation.args)}</span>
                          <div className="flex gap-2 mt-2">
                            <Button
                              type="button"
                              onClick={() =>
                                addToolResult({
                                  toolCallId,
                                  result: APPROVAL.YES,
                                })
                              }
                              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                            >
                              确定
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() =>
                                addToolResult({
                                  toolCallId,
                                  result: APPROVAL.NO,
                                })
                              }
                              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              取消
                            </Button>
                          </div>
                        </div>
                      );
                    }
                    break;
                  }
                  default:
                    return (
                      <div className="bg-red-500 p-2 rounded" key={i}>
                        <DebugValue data={part} />
                      </div>
                    );
                }
              })}
              <br />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base bg-white text-gray-800 focus:outline-none focus:border-blue-500 transition-colors"
            value={input}
            placeholder={`Say something in Room ${roomId}...`}
            onChange={handleInputChange}
          />
        </form>
      </div>
    </>
  );
}

export default function Chat() {
  const [activeRoom, setActiveRoom] = useState(ROOMS[0].id);

  return (
    <div className="flex flex-col h-full p-5">
      <div className="flex gap-1 mb-5">
        {ROOMS.map((room) => (
          <button
            key={room.id}
            type="button"
            className={`px-5 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium
              ${
                activeRoom === room.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              }`}
            onClick={() => setActiveRoom(room.id)}
          >
            {room.label}
          </button>
        ))}
      </div>
      <ChatRoom roomId={activeRoom} key={activeRoom} />
    </div>
  );
}
