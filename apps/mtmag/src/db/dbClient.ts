import { drizzle } from "drizzle-orm/pg-proxy";

const dbProxyUrl = "https://mtmaiadmin.yuepa8.com/api/db-proxy";

/**
 * dbProxy 客户端, 用 proxy 的方式访问 pg 数据库, 主要解决免费版的cloudflare worker 环境下不能使用原始pq驱动的问题
 * 文档: https://orm.drizzle.team/docs/connect-drizzle-proxy
 * @returns
 */
export async function getDb() {
  const db = drizzle(async (sql, params, method) => {
    try {
      const timeStart = Date.now();
      const response = await fetch(dbProxyUrl, {
        method: "POST",
        body: JSON.stringify({ sql, params, method }),
      });
      const rows: any = await response.json();
      console.log("dbProxy result:", {
        statuds: response.status,
        timeDuration: `${Date.now() - timeStart}ms`,
        rows,
      });
      return { rows: rows };
    } catch (e: any) {
      console.error("Error from pg proxy server: ", e.response?.data);
      return { rows: [] };
    }
  });
  return db;
}
