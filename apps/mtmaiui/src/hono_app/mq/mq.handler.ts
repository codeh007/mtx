import { sql } from "drizzle-orm";
import { getDb } from "../../db/dbClientV2";
import { createRouter } from "../agent_api/lib/createApp";
export const mqRouter = createRouter().post("/:task_type", async (c) => {
  try {
    const taskType = c.req.param("task_type");
    if (!taskType) {
      return c.json({ error: "queue name is required" }, 400);
    }
    const res = await getDb(c.env).execute(sql`SELECT * from taskmq_submit(
      p_task_type  => ${taskType},
      p_input      => ${JSON.stringify(await c.req.json())}::jsonb
    )`);
    return c.json(res);
  } catch (e: any) {
    console.error("MQ error:", e);
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
