import { getDb } from "../../../db/dbClientV2";
import { user } from "../../../db/schema/auth";
import { createRouter } from "../../lib/createApp";

const helloDbRouter = createRouter();

helloDbRouter.get("/helloPostgres", async (c) => {
  // Add db query to get all users
  const env = c.env;

  const db = await getDb(env);
  const result = await db.select().from(user);
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
});

export default helloDbRouter;
