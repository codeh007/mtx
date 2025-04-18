import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
config({
  path: ".env",
});
config({
  path: ".env.local",
});

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}
// console.log("POSTGRES_URL:", process.env.POSTGRES_URL);
export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
