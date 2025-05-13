import { drizzle } from "drizzle-orm/postgres-js";

export function getDb(env: Env|undefined=undefined) {
  // 提示: 在 cloudflare 不能使用全局变量复用 db 实例

  // const hyperdrive: Hyperdrive | undefined = env?.HYPERDRIVE as Hyperdrive | undefined;
  if (!env?.HYPERDRIVE || !globalThis.Hyperdrive) {
    throw new Error("HYPERDRIVE is not defined");
  }
  const db = drizzle(`${env.HYPERDRIVE.connectionString}`);
  return db;
}
