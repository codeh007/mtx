import { getDb } from "../../../db/dbClientV2";
import { users } from "../../../db/schema/auth";
import { createRouter } from "../../lib/createApp";
export const helloPostgres = async (c) => {
  // Add db query to get all users
  const env = c.env;

  const db = await getDb(env);
  const result = await db.select().from(users);
  return c.json(
    [
      {
        age: 42,
        id: "hello postgres",
        name: "John Doe",
      },
    ],
    200,
  );
};

const helloDbRouter = createRouter();

helloDbRouter.get("/helloPostgres", helloPostgres);

export default helloDbRouter;
