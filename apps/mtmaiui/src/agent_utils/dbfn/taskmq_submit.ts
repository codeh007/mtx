import postgres from "postgres";

export async function taskmq_submit(dbConnStr: string, task_type: string, input: any) {
  const sql = postgres(dbConnStr);
  return await sql`SELECT * from taskmq_submit(
    p_task_type  => ${task_type}::text,
    p_input      => ${JSON.stringify(input)}::jsonb
)`;
}
