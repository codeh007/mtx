// import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// config({
//   path: "../../dev.env",
// });

const runMigrate = async () => {
  if (!process.env.MTM_DATABASE_URL) {
    throw new Error("MTM_DATABASE_URL is not defined");
  }
  console.log("MTM_DATABASE_URL:", process.env.MTM_DATABASE_URL);

  const connection = postgres(process.env.MTM_DATABASE_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  try {
    // console.log("db", db);
    await migrate(db, {
      // migrationsSchema: "./src/db/schema/index.ts",
      migrationsFolder: "./src/db/migrations",
    });
  } catch (e) {
    console.error("❌ Migration failed");
    console.error(e);
    process.exit(1);
  }
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
