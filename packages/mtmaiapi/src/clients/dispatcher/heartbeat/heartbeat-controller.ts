import type { DispatcherClient as PbDispatcherClient } from "@hatchet/protoc--/dispatcher";
import { Logger } from "@hatchet/util/logger";
import { runThreaded } from "@hatchet/util/thread-helper";
import path from "path";
import type { Worker } from "worker_threads";
import type { ClientConfig } from "../../hatchet-client";
import type { DispatcherClient } from "../dispatcher-client";

export class Heartbeat {
  config: ClientConfig;
  client: PbDispatcherClient;
  workerId: string;
  logger: Logger;

  heartbeatWorker: Worker | undefined;

  constructor(client: DispatcherClient, workerId: string) {
    this.config = client.config;
    this.client = client.client;
    this.workerId = workerId;
    this.logger = new Logger(`HeartbeatController`, this.config.log_level);
  }

  async start() {
    if (!this.heartbeatWorker) {
      this.heartbeatWorker = runThreaded(
        path.join(__dirname, "./heartbeat-worker"),
        {
          workerData: {
            config: this.config,
            workerId: this.workerId,
          },
        },
      );
    }
  }

  async stop() {
    this.heartbeatWorker?.postMessage("stop");
    this.heartbeatWorker?.terminate();
    this.heartbeatWorker = undefined;
  }
}
