import { createRouter } from "../../lib/createApp";

export const envsRouter = createRouter();

envsRouter.get("/gomtm_kaggle", async (c) => {
  const adminToken = c.env.MTM_ADMIN_TOKEN;
  if (!adminToken) {
    return c.text("No admin token found", 401);
  }
  const authToken = c.req.header("Authorization") || c.req.query("token");
  if (authToken !== adminToken) {
    return c.text("Unauthorized", 401);
  }
  const envs = `
MTM_DATABASE_URL="postgresql://postgres:uF0tZtDquHJ0bC38@unhelpfully-large-ling.data-1.use1.tembo.io/mtm18?sslmode=require"
  `;

  return c.text(`${envs.trim()}\n`);
});
