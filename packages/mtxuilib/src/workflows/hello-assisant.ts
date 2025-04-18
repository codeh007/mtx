import { MemorySaver } from "@langchain/langgraph";
import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
// import { graphSseStream } from "../graphs/graphutils";
import type { Env } from "../types";

const checkpointer = new MemorySaver();
type Params = {
  input: string;
};

export class WfHelloAssisant extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    await step.do("assisant-graph start", async () => {
      // const generator = graphSseStream("assisant", {}, {});

      // let chuncks: any[] = [];
      // for await (const chunk of generator) {
      //   // const chunkData = encoder.encode(JSON.stringify(chunk));
      //   // controller.enqueue(chunk);
      //   chuncks = [...chuncks, chunk];
      // }
      return {
        // chuncks: chuncks,
        // contents,
        // finnalStateValues: finnalState.values,
      };
    });
    return {
      output: "fake result for WfHelloToolUse",
    };
  }
}
