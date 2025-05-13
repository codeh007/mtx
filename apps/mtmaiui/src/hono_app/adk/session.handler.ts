import { getDb } from "../../db/dbClientV2";
import { adkSessions } from "../../db/schema/adk_sessions";
import { createRouter } from "../agent_api/lib/createApp";

export const sessionRouter = createRouter();

sessionRouter.get("/list", async (c) => {
  try {
    const result = await getDb(c.env)
      .select({
        id: adkSessions.id,
        appName: adkSessions.app_name,
        userId: adkSessions.user_id,
        title: adkSessions.title,
      })
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
