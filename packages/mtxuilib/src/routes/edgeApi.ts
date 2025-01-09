import { Hono } from "hono";
// import { OpenAPIHono } from "@hono/zod-openapi";
import { agentApp } from "./agent";
import { authorsApp } from "./authorsApp/author";
import { booksApp } from "./booksApp/bookApp";
import { wsApp } from "./ws/wsApp";
export const mainApp = new Hono()
  .route("/authors", authorsApp)
  .route("/books", booksApp)
  .route("/ws", wsApp)
  .route("/agent", agentApp);

// mainApp.doc31("/docs", {
//   openapi: "3.1.0",
//   info: { title: "foo", version: "1" },
// }); // new endpoint

// mainApp.openapi(routeAgentHello, (c) => {
//   return c.json({ hello: "route" }, 200);
// });
export type AppType = typeof mainApp;
