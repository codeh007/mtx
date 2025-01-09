import { readMigrationFiles } from "drizzle-orm/migrator";
import { join } from "node:path";
import { cwd } from "node:process";

/**
 * 编译migrations.json 为 在浏览器端 实现 drizzle + pglite 的 migrate 功能
 * 参考： https://github.com/drizzle-team/drizzle-orm/discussions/2532
 */
export async function compileMigrations() {
  const drizzleMigrationsFolder = join(cwd(), "./src/db/migrations");
  // console.log("drizzleMigrationsFolder", drizzleMigrationsFolder);
  const migrations = readMigrationFiles({
    migrationsFolder: drizzleMigrationsFolder,
  });
  const outputPath = join(
    drizzleMigrationsFolder,
    "pglite_full_migrations.json",
  );

  await Bun.write(outputPath, JSON.stringify(migrations));

  console.log("pglite_full_migrations compiled:\n", outputPath);
}
