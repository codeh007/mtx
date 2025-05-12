import { getDb } from "../../../db/dbClientV2";
import { adkSessions } from "../../../db/schema/adk_sessions";
import { createRouter } from "../../lib/createApp";

export const sessionRouter = createRouter();

sessionRouter.get("/list", async (c) => {
  try {
    const db = await getDb(c.env);
    const result = await db
      .select([adkSessions.id, adkSessions.appName, adkSessions.userId, adkSessions.title])
      .from(adkSessions)
      .limit(10);
    return c.json({
      rows: result,
    });
  } catch (e: any) {
    console.error("Database error:", e);
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
