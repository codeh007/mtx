// import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// config({
//   path: ".env.local",
// });

// if (!process.env.POSTGRES_URL) {
//   throw new Error("POSTGRES_URL is not defined");
// }

const c =
  // "postgresql://postgres:uF0tZtDquHJ0bC38@unhelpfully-large-ling.data-1.use1.tembo.io/postgres?sslmode=disable";
  "postgresql://postgres:7W8jZ1oWhDvUp7xy@lethally-obtainable-wagtail.data-1.use1.tembo.io:5432/postgres";
console.log("POSTGRES_URL:", c);
export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // url: process.env.POSTGRES_URL!,
    url: c,
  },
});
