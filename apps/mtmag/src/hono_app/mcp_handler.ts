import { Hono } from "hono";

const mcpSseRoute = new Hono();

mcpSseRoute.all("/sse", (c) => {
  return c.text("hello mcp sse");
}); // GET /book
// mcpSseRoute.get("/:id", (c) => {
//   // GET /book/:id
//   const id = c.req.param("id");
//   return c.text(`Get Book: ${id}`);
// });
// mcpSseRoute.post("/", (c) => c.text("Create Book")); // POST /book

export default mcpSseRoute;
