import type { InferSelectModel } from "drizzle-orm";
import { foreignKey, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
// import { user } from "./user";
import { adkSessions } from "./adk_sessions";

/**
 * 
 * 
 * CREATE TABLE "adk_events" (
    "id" TEXT NOT NULL,
    "app_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "invocation_id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "branch" TEXT,
    "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" JSONB NOT NULL,
    "actions" BYTEA NOT NULL,
    CONSTRAINT "adk_events_pkey" PRIMARY KEY ("id", "app_name", "user_id", "session_id"),
    CONSTRAINT "adk_events_session_fkey" FOREIGN KEY ("app_name", "user_id", "session_id")
        REFERENCES "adk_sessions"("app_name", "user_id", "id") ON DELETE CASCADE
);
 */
export const adkEvents = pgTable(
  "adk_events",
  {
    id: text("id").notNull(),
    appName: text("app_name").notNull(),
    userId: text("user_id").notNull(),
    sessionId: text("session_id").notNull(),
    invocationId: text("invocation_id").notNull(),
    author: text("author").notNull(),
    branch: text("branch"),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
    content: jsonb("content").notNull().default("{}"),
    actions: jsonb("actions").notNull().default("{}"),
  },
  (t) => [
    {
      compositePK: primaryKey({
        columns: [t.appName, t.userId, t.sessionId, t.id],
      }),
    },
    {
      sessionFk: foreignKey({
        columns: [t.appName, t.userId, t.sessionId],
        foreignColumns: [adkSessions.appName, adkSessions.userId, adkSessions.id],
      }),
    },
  ],
);

export type AdkEvents = InferSelectModel<typeof adkEvents>;
