import { genSaltSync, hashSync } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { getPgliteBrowserClient } from "../pgliteClient";
import { type User, user } from "../schema";

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await getPgliteBrowserClient()
      .select()
      .from(user)
      .where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await getPgliteBrowserClient()
      .insert(user)
      .values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");

    throw error;
  }
}
