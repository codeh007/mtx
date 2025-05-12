import { drizzle } from "drizzle-orm/postgres-js";

export function getDb(env: Env | null = null) {
  // 提示: 在 cloudflare 不能使用全局变量复用 db 实例

  const hyperdrive: Hyperdrive | undefined = (env?.HYPERDRIVE || process.env.HYPERDRIVE) as
    | Hyperdrive
    | undefined;
  if (!hyperdrive) {
    throw new Error("HYPERDRIVE is not defined");
  }
  const db = drizzle(`${hyperdrive.connectionString}`);
  return db;
}
