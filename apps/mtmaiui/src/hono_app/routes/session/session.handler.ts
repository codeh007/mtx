import { getAgentByName } from "agents";
import type { RootAg } from "../../../agents/root_ag";
import { createRouter } from "../../lib/createApp";

export const sessionRouter = createRouter();

sessionRouter.post("/list", async (c) => {
  const { agentId, prompt } = await c.req.json<{
    agentId: string;
    prompt: string;
  }>();
  try {
    // console.log("agent_info", agentId, c.env.RootAg);

    const namedAgent = await getAgentByName<Env, RootAg>(c.env.RootAg, agentId);

    // const id = c.env.RootAg.idFromName(agentId);
    // const agent = c.env.RootAg.get(id);
    if (!namedAgent) {
      return c.json({ error: "Agent not found" }, 404);
    }
    return c.json({
      agentName: namedAgent.name,
      agentId: namedAgent.id,
      state: namedAgent.state,
    });
  } catch (e: any) {
    console.error(e);
    return c.json({ error: e.message }, 500);
  }
});
