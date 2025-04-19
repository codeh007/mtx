// import { Hono } from "hono";
// import { DemoMcpServer } from "../agents/demoMcpServer";
// import GitHub from "@auth/core/providers/github";
// import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";

// const authRoute = new Hono<{ Bindings: Env }>();

// // mcpSseRoute.all("/*", (c) => {
// //   /**
// //    * 问题排查:
// //    *    1: 路径前缀需要对应
// //    *    2: binding 字符串,必须是wrangler 中已经配置的 durable object 名称
// //    */
// //   const handler = DemoMcpServer.mount("/sse", { binding: "DemoMcpServer" });
// //   const response = handler.fetch(c.req.raw, c.env, c.executionCtx);
// //   return response;
// // });
// authRoute.use(
//     "*",
//     initAuthConfig((c) => ({
//       secret: c.env.AUTH_SECRET,
//       providers: [
//         GitHub({
//           clientId: c.env.GITHUB_ID,
//           clientSecret: c.env.GITHUB_SECRET,
//         }),
//       ],
//     })),
//   );

//   authRoute.use("/api/auth/*", authHandler());
//   authRoute.use("/api/*", verifyAuth());
//   authRoute.get("/api/protected", (c) => {
//     const auth = c.get("authUser");
//     return c.json(auth);
//   });

// export default authRoute;
