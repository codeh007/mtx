// import type { MigrationConfig } from "drizzle-orm/migrator";
// import { getPgliteBrowserClient } from "./pgliteClient";

// import migrations from "../db/migrations/pglite_full_migrations.json";

// export async function migratePgLiteInBrowser() {
//   try {
//     const db = getPgliteBrowserClient();
//     // dialect and session will appear to not exist...but they do
//     // @ts-expect-error
//     db.dialect.migrate(migrations, db.session, {
//       migrationsTable: "drizzle_migrations",
//     } satisfies Omit<MigrationConfig, "migrationsFolder">);
//   } catch (e) {
//     console.error("migratePgLiteInBrowser error", e);
//   }
// }
