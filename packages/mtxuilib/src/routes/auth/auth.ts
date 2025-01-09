import { Hono } from "hono";
export const authsRoute = new Hono()
  .post("/login", (c) => c.json({ result: "create an author" }, 201))
  .get("/me", (c) => c.json({ username: "fake user name" }));
