import type { Workflow } from "@cloudflare/workers-types";

import { resources } from "mtxuilib/db/schema";
import { getDb } from "../../db/dbClient";

import { Hono } from "hono";
type Env = {
  // Add your bindings here, e.g. Workers KV, D1, Workers AI, etc.
  MY_WORKFLOW: Workflow;
};

export const workflowsApp = new Hono<{ Bindings: Env }>()
  .post("/incoming", async (c) => {
    const body = await c.req.parseBody();
    // TwiML is Twilio Markup Language. If you respond to the webhook request with TwiML it will perform actions.
    // This TwiML replies by using the Message TwiML verb.
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
  })
  .get("/incoming", async (c) => {
    try {
      // Example of driver implementation
      const db = await getDb();

      const resourceList = await db
        .select({
          id: resources.id,
          title: resources.title,
          href: resources.href,
        })
        .from(resources)
        .orderBy(resources.id);
      console.log("resourceList: ", resourceList);
      return new Response(JSON.stringify(resourceList), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log("出错：", e);
      return new Response(`出错：:${e}`);
    }
  })

  .get("listworkflows", async (c) => {
    return new Response("listworkflows");
  });
