import { getDbV3 } from "@mtmaiui/db/dbClientV3";
import { sql } from "drizzle-orm";
import { createRouter } from "../agent_api/lib/createApp";
export const mqRouter = createRouter();

/**
 * 提交任务
 */
mqRouter.post("/taskmq_submit", async (c) => {
  try {
    // const taskType = c.req.param("task_type");
    // if (!taskType) {
    //   return c.json({ error: "queue name is required" }, 400);
    // }
    const body = await c.req.json();
    if (!body.task_type) {
      return c.json({ error: "task_type is required" }, 400);
    }
    const res = await getDbV3().execute(sql`SELECT * from taskmq_submit(
      p_task_type  => ${body.task_type}::text,
      p_input      => ${JSON.stringify(body)}::jsonb
    )`);
    return c.json(res);
  } catch (e: any) {
    console.error("MQ error:", e);
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
