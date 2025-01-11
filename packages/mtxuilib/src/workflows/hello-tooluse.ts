import { MemorySaver } from "@langchain/langgraph";
import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import { createSimulationGraph } from "../../../mtxlib/src/agents/simulationGraph";
import { generateUUID } from "../lib/s-utils";
import type { Env } from "../types";

const checkpointer = new MemorySaver();
type Params = {
  input: string;
};

export class WfHelloToolUse extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    await step.do("hello-graph start", async () => {
      const agentTools = [];
      const id = generateUUID();
      const config = { configurable: { thread_id: id } };

      const wf = createSimulationGraph();
      const graph = wf.compile({ checkpointer });
      const inputs = {};
      const contents: string[] = [];
      for await (const chunk of await graph.stream(inputs, {
        ...config,
        // streamMode: "values",
      })) {
        const nodeName = Object.keys(chunk)[0];
        const messages = chunk[nodeName].messages;
        contents.push(`${nodeName}: ${messages[0].content}`);
      }

      console.log(contents.join("\n---\n"));
      const finnalState = await graph.getState(config);

      return {
        contents,
        finnalStateValues: finnalState.values,
      };
    });
    return {
      output: "fake result for WfHelloToolUse",
    };
  }
}
