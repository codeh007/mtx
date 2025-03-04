import type {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  Message,
} from "ai";
// import type { APIErrors } from "mtmaiapi/api/generated/cloud/data-contracts";

// export function getFieldErrors(apiErrors: APIErrors): Record<string, string> {
//   const fieldErrors: Record<string, string> = {};

//   if (!apiErrors.errors) {
//     return fieldErrors;
//   }

//   for (const error of apiErrors.errors) {
//     if (error.field && error.description) {
//       fieldErrors[error.field] = error.description;
//     }
//   }

//   return fieldErrors;
// }

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

// export function getLocalStorage(key: string) {
//   if (typeof window !== "undefined") {
//     return JSON.parse(localStorage.getItem(key) || "[]");
//   }
//   return [];
// }

export function getLocalStorage(name: string, stringify = true): any {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(name);
    try {
      if (stringify) {
        return JSON.parse(value!);
      }
      return value;
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
}
export function setLocalStorage(name: string, value: any, stringify = true) {
  if (stringify) {
    localStorage.setItem(name, JSON.stringify(value));
  } else {
    localStorage.setItem(name, value);
  }
}

// function addToolMessageToChat({
//   toolMessage,
//   messages,
// }: {
//   toolMessage: CoreToolMessage;
//   messages: Array<Message>;
// }): Array<Message> {
//   return messages.map((message) => {
//     if (message.toolInvocations) {
//       return {
//         ...message,
//         toolInvocations: message.toolInvocations.map((toolInvocation) => {
//           const toolResult = toolMessage.content.find(
//             (tool) => tool.toolCallId === toolInvocation.toolCallId,
//           );

//           if (toolResult) {
//             return {
//               ...toolInvocation,
//               state: "result",
//               result: toolResult.result,
//             };
//           }

//           return toolInvocation;
//         }),
//       };
//     }

//     return message;
//   });
// }

// export function convertToUIMessages(
//   messages: Array<DBMessage>,
// ): Array<Message> {
//   return messages.reduce((chatMessages: Array<Message>, message) => {
//     if (message.role === "tool") {
//       return addToolMessageToChat({
//         toolMessage: message as CoreToolMessage,
//         messages: chatMessages,
//       });
//     }

//     let textContent = "";
//     const toolInvocations: Array<ToolInvocation> = [];

//     if (typeof message.content === "string") {
//       textContent = message.content;
//     } else if (Array.isArray(message.content)) {
//       for (const content of message.content) {
//         if (content.type === "text") {
//           textContent += content.text;
//         } else if (
//           content.type === "tool-call" ||
//           content.type === "tool_call"
//         ) {
//           toolInvocations.push({
//             state: "call",
//             toolCallId: content.toolCallId || content.tool_call?.id,
//             toolName: content.toolName,
//             args: content.args,
//           });
//         }
//       }
//     }

//     chatMessages.push({
//       id: message.id,
//       role: message.role as Message["role"],
//       content: textContent,
//       toolInvocations,
//     });

//     return chatMessages;
//   }, []);
// }

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>,
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === "tool-call"
        ? toolResultIds.includes(content.toolCallId)
        : content.type === "text"
          ? content.text.length > 0
          : true,
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === "result" ||
        toolResultIds.includes(toolInvocation.toolCallId),
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0),
  );
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

// export function getDocumentTimestampByIndex(
//   documents: Array<Document>,
//   index: number,
// ) {
//   if (!documents) return new Date();
//   if (index > documents.length) return new Date();

//   return documents[index].createdAt;
// }

// export function getMessageIdFromAnnotations(message: Message) {
//   if (!message.annotations) return message.id;

//   const [annotation] = message.annotations;
//   if (!annotation) return message.id;

//   // @ts-expect-error messageIdFromServer is not defined in MessageAnnotation
//   return annotation.messageIdFromServer;
// }

const actualNewline = `
`;

export const cleanContent = (content: string): string => {
  return content ? content.replace(/\\n/g, actualNewline) : "";
};

export const reverseCleanContent = (content: string): string => {
  return content ? content.replaceAll(actualNewline, "\n") : "";
};

export const newlineToCarriageReturn = (str: string) =>
  // str.replace(actualNewline, "\r\n");
  str.replace(actualNewline, [actualNewline, actualNewline].join(""));

export const emptyLineCount = (content: string): number => {
  const liens = content.split("\n");
  return liens.filter((line) => line.trim() === "").length;
};

export function truncateText(text: string, length = 50) {
  if (text.length > length) {
    return `${text.substring(0, length)} ...`;
  }
  return text;
}
