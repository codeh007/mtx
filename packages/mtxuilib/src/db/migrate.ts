import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({
  path: "../../dev.env",
});

// const DATABASE_URL =
//   "postgresql://postgres:7W8jZ1oWhDvUp7xy@lethally-obtainable-wagtail.data-1.use1.tembo.io:5432/test2?sslmode=require";

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }
  console.log("POSTGRES_URL:", process.env.POSTGRES_URL);

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  await migrate(db, {
    // migrationsSchema: "./src/db/schema/index.ts",
    migrationsFolder: "./src/db/migrations",
  });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
