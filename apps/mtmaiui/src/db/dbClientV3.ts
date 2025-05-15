import { drizzle } from "drizzle-orm/postgres-js";

export function getDbV3() {
  const connStr = process.env.MTM_DATABASE_URL;
  if (!connStr) {
    throw new Error("MTM_DATABASE_URL is not defined");
  }
  const db = drizzle(connStr);
  return db;
}
