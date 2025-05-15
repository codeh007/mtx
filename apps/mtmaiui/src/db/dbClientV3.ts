import { drizzle } from "drizzle-orm/postgres-js";

export function getDbV3() {
  // 提示: 在 cloudflare 不能使用全局变量复用 db 实例
  // const hyperdrive: Hyperdrive | undefined = env?.HYPERDRIVE as Hyperdrive | undefined;

  const connStr = process.env.MTM_DATABASE_URL;
  if (!connStr) {
    throw new Error("MTM_DATABASE_URL is not defined");
  }
  const db = drizzle(connStr);
  return db;
}
