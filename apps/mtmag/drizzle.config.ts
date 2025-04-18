import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
// import { resolve } from "node:path";
// const absPath = resolve(__dirname, "../../../gomtm/env/dev.env");
// console.log("absPath:", absPath);
config({
  path: "../../../gomtm/env/dev.env",
});

if (!process.env.MTMAG_DATABASE_URL) {
  throw new Error("MTMAG_DATABASE_URL is not defined");
}
console.log("MTMAG_DATABASE_URL:", process.env.MTMAG_DATABASE_URL);
export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.MTMAG_DATABASE_URL!,
  },
});
