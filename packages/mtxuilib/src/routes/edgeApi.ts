import { Hono } from "hono";
// import { OpenAPIHono } from "@hono/zod-openapi";
import { authorsApp } from "./authorsApp/author";
import { booksApp } from "./booksApp/bookApp";
import { wsApp } from "./ws/wsApp";
import { spaceProxy } from "./space-proxy/space-proxy";

export const mainApp = new Hono()
  .route("/authors", authorsApp)
  .route("/books", booksApp)
  .route("/ws", wsApp)
  .route("/space", spaceProxy)
  .all("*", (c) => {
    return c.json({ hello: "world any" }, 200);
  });
// .route("/agent", agentApp);

// mainApp.doc31("/docs", {
//   openapi: "3.1.0",
//   info: { title: "foo", version: "1" },
// }); // new endpoint

// mainApp.openapi(routeAgentHello, (c) => {
//   return c.json({ hello: "route" }, 200);
// });
export type AppType = typeof mainApp;
