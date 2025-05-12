import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// const db = drizzle(process.env.DATABASE_URL);

let globalInstance: any;
export async function getDb(env: Env) {
  if (globalInstance) {
    return globalInstance;
  }
  // Create drizzle instance with the postgres client
  const db = drizzle(`${env.HYPERDRIVE.connectionString}`);
  globalInstance = db;
  return db;
}
