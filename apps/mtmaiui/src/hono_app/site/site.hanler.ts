import { sql } from "@mtmaiui/db/dbClientV3";
import { Hono } from "hono";

const siteRoute = new Hono<{ Bindings: Env }>();

/**
 * 自动化操作指引, agent 启动后,应该先访问这个网址,获取指引后进行一系列操作
 */
siteRoute.get("/sites", async (c) => {
  try {
    const list = await sql`SELECT * from list_sites_json()`;
    return c.json(list.at(0)?.list_sites_json);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create site" }, 500);
  }
});

/**创建 site */
siteRoute.post("/sites", async (c) => {
  const body = await c.req.json();
  try {
    const res = await sql`SELECT * from upsert_site(
      p_title => ${body.title}::text,
      p_host => ${body.host}::text
    )`;
    const item = res?.at(0);
    return c.json({
      item,
    });
  } catch (error) {
    console.error(error);

    return c.json({ error: "Failed to create site" }, 500);
  }
});
export default siteRoute;
