import { Hono } from "hono";

export const booksApp = new Hono()
  .get("/", (c) => c.json({ result: "list books" }))
  .post("/", (c) => c.json({ result: "create a book" }, 201))
  .get("/:id", (c) => c.json({ result: `get ${c.req.param("id")}` }));
