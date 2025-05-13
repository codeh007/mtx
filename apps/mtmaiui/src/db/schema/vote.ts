import type { InferSelectModel } from "drizzle-orm";

import { boolean, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { chat } from "./chat";
import { chatMessage } from "./message";

export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => chatMessage.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;
