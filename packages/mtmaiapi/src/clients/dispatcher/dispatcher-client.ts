import { Channel, ClientFactory } from "nice-grpc";
import {
  DispatcherClient as PbDispatcherClient,
  DispatcherDefinition,
  StepActionEvent,
  GroupKeyActionEvent,
  OverridesData,
  DeepPartial,
  WorkerLabels as PbWorkerAffinityConfig,
} from "@hatchet/protoc/dispatcher";
import { ClientConfig } from "@clients/hatchet-client/client-config";
import HatchetError from "@util/errors/hatchet-error";
import { Logger } from "@hatchet/util/logger";

import { retrier } from "@hatchet/util/retrier";
import { ActionListener } from "./action-listener";

export type WorkerLabels = Record<string, string | number | undefined>;

interface GetActionListenerOptions {
  workerName: string;
  services: string[];
  actions: string[];
  maxRuns?: number;
  labels: Record<string, string | number | undefined>;
}

export class DispatcherClient {
  config: ClientConfig;
  client: PbDispatcherClient;
  logger: Logger;

  constructor(config: ClientConfig, channel: Channel, factory: ClientFactory) {
    this.config = config;
    this.client = factory.create(DispatcherDefinition, channel);
    this.logger = new Logger(`Dispatcher`, config.log_level);
  }

  async getActionListener(options: GetActionListenerOptions) {
    // Register the worker
    const registration = await this.client.register({
      ...options,
      labels: options.labels ? mapLabels(options.labels) : undefined,
    });

    return new ActionListener(this, registration.workerId);
  }

  async sendStepActionEvent(in_: StepActionEvent) {
    try {
      return await retrier(
        async () => this.client.sendStepActionEvent(in_),
        this.logger,
      );
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async sendGroupKeyActionEvent(in_: GroupKeyActionEvent) {
    try {
      return await retrier(
        async () => this.client.sendGroupKeyActionEvent(in_),
        this.logger,
      );
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async putOverridesData(in_: DeepPartial<OverridesData>) {
    return retrier(
      async () => this.client.putOverridesData(in_),
      this.logger,
    ).catch((e) => {
      this.logger.warn(`Could not put overrides data: ${e.message}`);
    });
  }

  async refreshTimeout(incrementTimeoutBy: string, stepRunId: string) {
    try {
      return this.client.refreshTimeout({
        stepRunId,
        incrementTimeoutBy,
      });
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async upsertWorkerLabels(workerId: string, labels: WorkerLabels) {
    try {
      return await this.client.upsertWorkerLabels({
        workerId,
        labels: mapLabels(labels),
      });
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }
}

function mapLabels(in_: WorkerLabels): Record<string, PbWorkerAffinityConfig> {
  return Object.entries(in_).reduce<Record<string, PbWorkerAffinityConfig>>(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        strValue: typeof value === "string" ? value : undefined,
        intValue: typeof value === "number" ? value : undefined,
      } as PbWorkerAffinityConfig,
    }),
    {} as Record<string, PbWorkerAffinityConfig>,
  );
}
