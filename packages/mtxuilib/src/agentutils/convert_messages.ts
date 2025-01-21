import type {
  ThreadMessageLike,
  ToolCallContentPart,
  useExternalMessageConverter,
} from "@assistant-ui/react";
import type {
  AIMessage,
  BaseMessage,
  ChatMessage,
  ToolMessage,
} from "@langchain/core/messages";
// Not exposed by `@assistant-ui/react` package, but is
// the required return type for this callback function.
type Message =
  | ThreadMessageLike
  | {
      role: "tool";
      toolCallId: string;
      toolName?: string | undefined;
      result;
    };

export const getMessageType = (message: Record<string, any>): string => {
  if ("getType" in message && typeof message.getType === "function") {
    return message.getType();
  }
  if ("_getType" in message && typeof message._getType === "function") {
    return message._getType();
  }
  if ("type" in message) {
    return message.type as string;
  }
  throw new Error("Unsupported message type");
};

// 可能不需要了
export const convertLangchainMessages: useExternalMessageConverter.Callback<
  BaseMessage
> = (message): Message | Message[] => {
  if (typeof message?.content !== "string") {
    throw new Error("Only text messages are supported");
  }

  switch (getMessageType(message)) {
    case "system":
      return {
        role: "system",
        id: message.id,
        content: [{ type: "text", text: message.content }],
      };
    case "human":
      return {
        role: "user",
        id: message.id,
        content: [{ type: "text", text: message.content }],
      };
    case "ai":
      // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
      const aiMsg = message as AIMessage;
      // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
      const toolCallsContent: ToolCallContentPart[] = aiMsg.tool_calls?.length
        ? aiMsg.tool_calls.map((tc) => ({
            type: "tool-call" as const,
            toolCallId: tc.id ?? "",
            toolName: tc.name,
            args: tc.args,
            argsText: JSON.stringify(tc.args),
          }))
        : [];
      return {
        role: "assistant",
        id: message.id,
        content: [
          ...toolCallsContent,
          {
            type: "text",
            text: message.content,
          },
        ],
      };
    case "tool":
      return {
        role: "tool",
        toolName: message.name,
        toolCallId: (message as ToolMessage).tool_call_id,
        result: message.content,
      };
    default:
      throw new Error(`Unsupported message type: ${getMessageType(message)}`);
  }
};

export const convertToChatMessage: useExternalMessageConverter.Callback<
  ChatMessage
> = (message): Message | Message[] => {
  return {
    role: message.role,
    id: message.id,
    content: [{ type: "text", text: message.content }],
  };
};

export const convertFromMtmChatMessage: useExternalMessageConverter.Callback<
  //@ts-ignore
  ChatMessage
> = (message): Message | Message[] => {
  return {
    role: message.role,
    id: message.id,
    content: [{ type: "text", text: message.content }],
  };
};

export function convertToOpenAIFormat(message: BaseMessage) {
  if (typeof message?.content !== "string") {
    throw new Error("Only text messages are supported");
  }
  switch (getMessageType(message)) {
    case "system":
      return {
        role: "system",
        content: message.content,
      };
    case "human":
      return {
        role: "user",
        content: message.content,
      };
    case "ai":
      return {
        role: "assistant",
        content: message.content,
      };
    case "tool":
      return {
        role: "tool",
        toolName: message.name,
        result: message.content,
      };
    default:
      throw new Error(`Unsupported message type: ${getMessageType(message)}`);
  }
}
