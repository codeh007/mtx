import { type InferSelectModel, sql } from "drizzle-orm";
import { jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const adkSessions = pgTable(
  "adk_sessions",
  {
    appName: text("app_name").notNull(),
    userId: text("user_id").notNull(),
    id: text("id").notNull().default(sql`gen_random_uuid()`),
    state: jsonb("state").notNull().default("{}"),
    createTime: timestamp("create_time").notNull().defaultNow(),
    updateTime: timestamp("update_time").notNull().defaultNow(),
    // 在 google adk session 基础上扩展
    title: text("title").notNull().default("no title"),
  },
  (t) => [
    {
      compositePK: primaryKey({
        columns: [t.appName, t.userId, t.id],
      }),
    },
  ],
);

export type AdkSessions = InferSelectModel<typeof adkSessions>;
