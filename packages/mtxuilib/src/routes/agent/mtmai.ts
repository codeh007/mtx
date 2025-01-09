import type { Env } from "../../types";

import { Hono } from "hono";

export const mtmaiAgentRoute = new Hono<{ Bindings: Env }>().post(
  "/",
  async (c) => {
    const body = await c.req.parseBody();
    const twiml = `
	<Response>
		<Message>
			This message was sent from a Cloudflare Worker. 🧡
		</Message>
	</Response>`;
    // Kickoff the Workflow
    await c.env.MY_WORKFLOW.create({
      params: {
        to: body.From,
        content: body.Body,
        host: c.req.header("Host"),
      },
    });
    return new Response(twiml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  },
);
