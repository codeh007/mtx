import { sql } from "drizzle-orm";
import { getDb } from "../../db/dbClientV2";
import { createRouter } from "../agent_api/lib/createApp";
export const agentSessionRouter = createRouter().get("/list", async (c) => {
  try {
    const res = await getDb(c.env).execute(sql`SELECT * from list_agents_tmp1(
      p_limit  => ${2}::INTEGER
    )`);
    return c.json(res[0]?.list_agents_tmp1);
  } catch (e: any) {
    console.error("agentSessionRouter, Database error:", e);
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
