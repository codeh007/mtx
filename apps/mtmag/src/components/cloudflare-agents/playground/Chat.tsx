import type { Message } from "@ai-sdk/react";
import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";
import { Button } from "mtxuilib/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Chat.css";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import type { RootAgentState } from "../../../agent_state/root_agent_state";
import { APPROVAL } from "../../../agent_state/shared";
import type { tools } from "../../../agents/tools";

const ROOMS = [
  { id: "1", label: "Room 1" },
  { id: "2", label: "Room 2" },
  { id: "3", label: "Room 3" },
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

  // Scroll to bottom on mount
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const agent = useAgent<RootAgentState>({
    agent: "chat",
    name: `chat-${roomId}`,
    onStateUpdate: (newState) => setRootState(newState),
    onMessage: (message) => {
      console.log("chat onMessage", message);
    },
  });

  const { messages, input, handleInputChange, handleSubmit, clearHistory, addToolResult } =
    useAgentChat({
      agent,
      maxSteps: 5,
    });

  // Scroll to bottom when messages change
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
  const pendingToolCallConfirmation = messages.some((m: Message) =>
    m.parts?.some(
      (part) =>
        part.type === "tool-invocation" &&
        part.toolInvocation.state === "call" &&
        toolsRequiringConfirmation.includes(part.toolInvocation.toolName as keyof typeof tools),
    ),
  );

  return (
    <>
      <div className="controls-container">
        <Button type="button" onClick={clearHistory} className="clear-history">
          🗑️ 删除对话历史
        </Button>
        <DebugValue data={rootState} />
        <Button
          onClick={() => {
            increment();
          }}
        >
          counter:{rootState?.counter}
        </Button>
        {pendingToolCallConfirmation && (
          <>
            <Button>确认</Button>
            <Button>取消</Button>
          </>
        )}
      </div>

      <div className="chat-container">
        <div className="messages-wrapper">
          {messages?.map((m: Message) => (
            <div key={m.id} className="message">
              <strong>{`${m.role}: `}</strong>
              {m.parts?.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: vibes
                      <div key={i} className="message-content">
                        {part.text}
                      </div>
                    );
                  case "tool-invocation": {
                    const toolInvocation = part.toolInvocation;
                    const toolCallId = toolInvocation.toolCallId;

                    // render confirmation tool (client-side tool with user interaction)
                    if (
                      toolsRequiringConfirmation.includes(
                        toolInvocation.toolName as keyof typeof tools,
                      ) &&
                      toolInvocation.state === "call"
                    ) {
                      return (
                        <div key={toolCallId} className="tool-invocation">
                          工具调用: <span className="dynamic-info">{toolInvocation.toolName}</span>{" "}
                          with args:{" "}
                          <span className="dynamic-info">
                            {JSON.stringify(toolInvocation.args)}
                          </span>
                          <div className="button-container flex gap-2">
                            <Button
                              type="button"
                              className="button-approve"
                              onClick={() =>
                                addToolResult({
                                  toolCallId,
                                  result: APPROVAL.YES,
                                })
                              }
                            >
                              确定
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              className="button-reject"
                              onClick={() =>
                                addToolResult({
                                  toolCallId,
                                  result: APPROVAL.NO,
                                })
                              }
                            >
                              取消
                            </Button>
                          </div>
                        </div>
                      );
                    }
                  }
                }
              })}
              <br />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="chat-input"
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
    <div className="chat-wrapper">
      <div className="tab-bar">
        {ROOMS.map((room) => (
          <button
            key={room.id}
            type="button"
            className={`tab ${activeRoom === room.id ? "active" : ""}`}
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
