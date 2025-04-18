// import { PGlite } from "@electric-sql/pglite";
// import { drizzle } from "drizzle-orm/pglite";
// import { user } from "./schema";
// const db = new PGlite("idb://my-pgdata");
// export async function pgLiteSeed() {
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS todo (
//       id SERIAL PRIMARY KEY,
//       task TEXT,
//       done BOOLEAN DEFAULT false
//     );
//     INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
//     INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
//     INSERT INTO todo (task, done) VALUES ('Create a table', true);
//     INSERT INTO todo (task, done) VALUES ('Insert some data', true);
//     INSERT INTO todo (task) VALUES ('Update a task');
//   `);
// }
// export async function pgliteHello() {
//   const ret = await db.query(`
//     SELECT * from todo ;
//   `);
//   console.log(ret.rows);
//   return ret.rows;
// }

// export const drizzlePgLiteTest1 = async () => {
//   try {
//     const client = new PGlite("idb://my-pgdata4");
//     const db = drizzle(client);
//     const ret = await db.select().from(user);
//     console.log(ret);
//   } catch (e) {
//     console.error(e);
//   }
// };
