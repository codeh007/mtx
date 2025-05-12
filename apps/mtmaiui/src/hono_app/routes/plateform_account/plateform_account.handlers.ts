import { getDb } from "../../../db/dbClientV2";
import { plateformAccount } from "../../../db/schema/plateform_account";
import type { AppRouteHandler } from "../agent_api/lib/types";
import type { CreateRoute, GetOneRoute, ListRoute } from "./plateform_account.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  try {
    const db = await getDb(c.env);
    // console.log("db", db);
    const result = await db.select().from(plateformAccount).limit(10);
    console.log("result", result);
    return c.json(result, 200);
  } catch (e) {
    console.error(e);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const user = c.req.valid("json");
  console.log({ user });
  // Add db query create a user
  return c.json(
    {
      age: 42,
      id: "2342",
      name: "John Doe",
    },
    200,
  );
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  console.log({ id });
  const env = c.env;

  // Add db query to get a user by id
  const foundUser = {
    age: 50,
    id,
    name: "Lisa Smith",
  };
  // c.env.

  if (!foundUser) {
    return c.json(
      {
        message: "Not found",
      },
      404,
    );
  }
  return c.json(foundUser, 200);
};
