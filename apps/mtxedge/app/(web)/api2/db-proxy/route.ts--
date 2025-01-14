import type { Pool } from "pg";
let pool: any;
async function getDbPool() {
  const { Pool } = await import("pg");
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return pool as Pool;
}
const handler = async (r: Request) => {
  const { sql, params, method } = await r.json();
  try {
    console.log("db-proxy, 执行query: ", { sql, params, method });
    const result = await (await getDbPool()).query({
      text: sql,
      values: params,
      //@ts-ignore
      rowMode: method === "all" ? "array" : undefined,
    });

    //@ts-ignore
    return new Response(JSON.stringify(result.rows), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e: any) {
    console.error("db-proxy 查询失败: ", sql, params, method, e);
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
