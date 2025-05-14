import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

export async function taskmq_submit(dbConnStr: string, task_type: string, input: any) {
  return await drizzle(`${dbConnStr}`).execute(sql`SELECT * from taskmq_submit(
    p_task_type  => ${task_type}::text,
    p_input      => ${JSON.stringify(input)}::jsonb
)`);
}
