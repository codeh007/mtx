// import { cookies } from "next/headers";
// import { notFound, redirect } from "next/navigation";

import type { Attachment, UIMessage } from "ai";
import type { DBChatMessage } from "../db/schema";

export function convertToUIMessages(messages: Array<DBChatMessage>): Array<UIMessage> {
  return messages.map((message) => ({
    id: message.id,
    parts: message.parts as UIMessage["parts"],
    role: message.role as UIMessage["role"],
    // Note: content will soon be deprecated in @ai-sdk/react
    content: "",
    createdAt: message.createdAt,
    experimental_attachments: (message.attachments as Array<Attachment>) ?? [],
  }));
}

/** 参考函数: */

// export async function deleteTrailingMessages({ id }: { id: string }) {
//   const [message] = await getMessageById({ id });

//   await deleteMessagesByChatIdAfterTimestamp({
//     chatId: message.chatId,
//     timestamp: message.createdAt,
//   });
// }

// export async function updateChatVisibility({
//   chatId,
//   visibility,
// }: {
//   chatId: string;
//   visibility: VisibilityType;
// }) {
//   await updateChatVisiblityById({ chatId, visibility });
// }
