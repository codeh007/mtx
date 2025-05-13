import type { InferSelectModel } from "drizzle-orm";
import { json, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { chat } from "./chat";

export const chatMessage = pgTable("chat_message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBChatMessage = InferSelectModel<typeof chatMessage>;
