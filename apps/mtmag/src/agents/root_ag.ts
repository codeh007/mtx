import type { Connection, ConnectionContext } from "agents";
import { Agent } from "agents";
import type { RootAgentState } from "../agent_state/root_agent_state";
import type { Env } from "../components/cloudflare-agents/env";
import type { IncomingMessage, OutgoingMessage } from "../components/cloudflare-agents/shared";

export class RootAg extends Agent<Env, RootAgentState> {
  initialState = {
    counter: 0,
    text: "root ag text",
    color: "#3B82F6",
    mainViewType: "chat",
    chatHistoryIds: [],
  } satisfies RootAgentState;

  onConnect(connection: Connection, ctx: ConnectionContext): void | Promise<void> {
    connection.send(
      JSON.stringify({
        type: "connected",
        data: {
          message: "Hello, world! connected",
        },
      } satisfies OutgoingMessage),
    );
  }

  onClose(connection: Connection) {
    console.log("root ag disconnected:", connection.id);
  }
  onRequest(request: Request): Response | Promise<Response> {
    const timestamp = new Date().toLocaleTimeString();
    return new Response(`Server time: ${timestamp} - Your request has been processed!`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  async onMessage(connection: Connection, message: string): Promise<void> {
    const event = JSON.parse(message) as IncomingMessage;
    if (event.type === "schedule") {
      //       const result = await generateObject({
      //         model,
      //         mode: "json",
      //         schemaName: "task",
      //         schemaDescription: "A task to be scheduled",
      //         schema: unstable_scheduleSchema, // <- the shape of the object that the scheduler expects
      //         maxRetries: 5,
      //         prompt: `${unstable_getSchedulePrompt({
      //           date: new Date(),
      //         })}
      // Input to parse: "${event.input}"`,
      //       });
      //       const { when, description } = result.object;
      //       if (when.type === "no-schedule") {
      //         connection.send(
      //           JSON.stringify({
      //             type: "error",
      //             data: `No schedule provided for ${event.input}`,
      //           } satisfies OutgoingMessage)
      //         );
      //         return;
      //       }
      //       const schedule = await this.schedule(
      //         when.type === "scheduled"
      //           ? when.date!
      //           : when.type === "delayed"
      //             ? when.delayInSeconds!
      //             : when.cron!,
      //         "onTask",
      //         description
      //       );
      //       connection.send(
      //         JSON.stringify({
      //           type: "schedule",
      //           data: convertScheduleToScheduledItem(schedule),
      //         } satisfies OutgoingMessage)
      //       );
    } else if (event.type === "delete-schedule") {
      await this.cancelSchedule(event.id);
    } else if (event.type === "demo-event-1") {
      await this.onDemoEvent1(event.data);
    }
  }

  async onDemoEvent1(payload: unknown) {
    this.broadcast(
      JSON.stringify({
        type: "demo-event-response",
        data: payload,
      } satisfies OutgoingMessage),
    );
  }
}
