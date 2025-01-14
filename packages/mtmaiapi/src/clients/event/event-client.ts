import type { ClientConfig } from "@clients/hatchet-client/client-config";
import {
  type BulkPushEventRequest,
  type EventsServiceClient,
  EventsServiceDefinition,
  type PushEventRequest,
} from "@hatchet/protoc/events/events";
import { Logger } from "@hatchet/util/logger";
import { retrier } from "@hatchet/util/retrier";
import HatchetError from "@util/errors/hatchet-error";
import type { Channel, ClientFactory } from "nice-grpc";

// eslint-disable-next-line no-shadow
export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export interface PushEventOptions {
  additionalMetadata?: Record<string, string>;
}

export interface EventWithMetadata<T> {
  payload: T;
  additionalMetadata?: Record<string, any>;
}

export class EventClient {
  config: ClientConfig;
  client: EventsServiceClient;

  logger: Logger;

  constructor(config: ClientConfig, channel: Channel, factory: ClientFactory) {
    this.config = config;
    this.client = factory.create(EventsServiceDefinition, channel);
    this.logger = new Logger("Dispatcher", config.log_level);
  }

  push<T>(type: string, input: T, options: PushEventOptions = {}) {
    const namespacedType = `${this.config.namespace ?? ""}${type}`;

    const req: PushEventRequest = {
      key: namespacedType,
      payload: JSON.stringify(input),
      eventTimestamp: new Date(),
      additionalMetadata: options.additionalMetadata
        ? JSON.stringify(options.additionalMetadata)
        : undefined,
    };

    try {
      const e = this.client.push(req);
      this.logger.info(`Event pushed: ${namespacedType}`);
      return e;
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  bulkPush<T>(
    type: string,
    inputs: EventWithMetadata<T>[],
    options: PushEventOptions = {},
  ) {
    const namespacedType = `${this.config.namespace ?? ""}${type}`;

    const events = inputs.map((input) => {
      return {
        key: namespacedType,
        payload: JSON.stringify(input.payload),
        eventTimestamp: new Date(),
        additionalMetadata: (() => {
          if (input.additionalMetadata) {
            return JSON.stringify(input.additionalMetadata);
          }
          if (options.additionalMetadata) {
            return JSON.stringify(options.additionalMetadata);
          }
          return undefined;
        })(),
      };
    });

    const req: BulkPushEventRequest = {
      events,
    };

    try {
      const e = this.client.bulkPush(req);
      this.logger.info(`Bulk events pushed for type: ${namespacedType}`);
      return e;
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  putLog(stepRunId: string, log: string, level?: LogLevel) {
    const createdAt = new Date();

    retrier(
      async () =>
        this.client.putLog({
          stepRunId,
          createdAt,
          message: log,
          level: level || LogLevel.INFO,
        }),
      this.logger,
    ).catch((e: any) => {
      // log a warning, but this is not a fatal error
      this.logger.warn(`Could not put log: ${e.message}`);
    });
  }

  putStream(stepRunId: string, data: string | Uint8Array) {
    const createdAt = new Date();

    let dataBytes: Uint8Array;
    if (typeof data === "string") {
      dataBytes = new TextEncoder().encode(data);
    } else if (data instanceof Uint8Array) {
      dataBytes = data;
    } else {
      throw new Error("Invalid data type. Expected string or Uint8Array.");
    }

    retrier(
      async () =>
        this.client.putStreamEvent({
          stepRunId,
          createdAt,
          message: dataBytes,
        }),
      this.logger,
    ).catch((e: any) => {
      // log a warning, but this is not a fatal error
      this.logger.warn(`Could not put log: ${e.message}`);
    });
  }
}
