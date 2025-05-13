import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
config({
  path: ".env",
});
config({
  path: ".env.local",
});

if (!process.env.MTM_DATABASE_URL) {
  throw new Error("MTM_DATABASE_URL is not defined");
}
export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.MTM_DATABASE_URL!,
  },
});
