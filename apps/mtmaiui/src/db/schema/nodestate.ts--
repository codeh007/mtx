import type { InferSelectModel } from "drizzle-orm";
import { json, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const nodeStates = pgTable("NodeState", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  // threadId: uuid('threadId')
  //   .notNull()
  //   .references(() => thread.id),
  // nodeId: varchar('nodeId').notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type NodeState = InferSelectModel<typeof nodeStates>;
