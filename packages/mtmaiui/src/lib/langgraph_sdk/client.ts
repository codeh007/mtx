import type {
  Assistant,
  AssistantGraph,
  AssistantVersion,
  Checkpoint,
  Config,
  Cron,
  DefaultValues,
  GraphSchema,
  Item,
  ListNamespaceResponse,
  Metadata,
  Run,
  SearchItemsResponse,
  Subgraphs,
  Thread,
  ThreadState,
} from "./schema.js";
import { IterableReadableStream } from "./stream.js";
import type {
  CronsCreatePayload,
  OnConflictBehavior,
  RunsCreatePayload,
  RunsStreamPayload,
  RunsWaitPayload,
  StreamEvent,
} from "./types.js";
import { AsyncCaller, type AsyncCallerParams } from "./utils/async_caller.js";
import { createParser } from "./utils/eventsource-parser/parse.js";
import type { EventSourceParser } from "./utils/types.js";
// import {
// 	type EventSourceParser,
// 	createParser,
// } from "./utils/eventsource-parser/index";
// import { IterableReadableStream } from "./utils/stream";
// import type { EventSourceParser } from "./utils/types.js";

interface ClientConfig {
  apiUrl?: string;
  apiKey?: string;
  callerOptions?: AsyncCallerParams;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string | null | undefined>;
}

class BaseClient {
  protected asyncCaller: AsyncCaller;

  protected timeoutMs: number;

  protected apiUrl: string;

  protected defaultHeaders: Record<string, string | null | undefined>;

  constructor(config?: ClientConfig) {
    this.asyncCaller = new AsyncCaller({
      maxRetries: 4,
      maxConcurrency: 4,
      ...config?.callerOptions,
    });

    this.timeoutMs = config?.timeoutMs || 12_000;
    this.apiUrl = config?.apiUrl || "http://localhost:8123";
    this.defaultHeaders = config?.defaultHeaders || {};
    if (config?.apiKey != null) {
      this.defaultHeaders["X-Api-Key"] = config.apiKey;
    }
  }

  protected prepareFetchOptions(
    path: string,
    options?: RequestInit & {
      json?: unknown;
      params?: Record<string, unknown>;
    },
  ): [url: URL, init: RequestInit] {
    const mutatedOptions = {
      ...options,
      headers: { ...this.defaultHeaders, ...options?.headers },
    };

    if (mutatedOptions.json) {
      mutatedOptions.body = JSON.stringify(mutatedOptions.json);
      mutatedOptions.headers = {
        ...mutatedOptions.headers,
        "Content-Type": "application/json",
      };
      delete mutatedOptions.json;
    }

    const targetUrl = new URL(`${this.apiUrl}${path}`);

    if (mutatedOptions.params) {
      for (const [key, value] of Object.entries(mutatedOptions.params)) {
        if (value == null) continue;

        const strValue =
          typeof value === "string" || typeof value === "number"
            ? value.toString()
            : JSON.stringify(value);

        targetUrl.searchParams.append(key, strValue);
      }
      delete mutatedOptions.params;
    }

    return [targetUrl, mutatedOptions];
  }

  protected async fetch<T>(
    path: string,
    options?: RequestInit & {
      json?: unknown;
      params?: Record<string, unknown>;
    },
  ): Promise<T> {
    const response = await this.asyncCaller.fetch(
      ...this.prepareFetchOptions(path, options),
    );
    if (response.status === 202 || response.status === 204) {
      return undefined as T;
    }
    return response.json() as T;
  }
}

export class CronsClient extends BaseClient {
  /**
   *
   * @param threadId The ID of the thread.
   * @param assistantId Assistant ID to use for this cron job.
   * @param payload Payload for creating a cron job.
   * @returns The created background run.
   */
  async createForThread(
    threadId: string,
    assistantId: string,
    payload?: CronsCreatePayload,
  ): Promise<Run> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const json: Record<string, any> = {
      schedule: payload?.schedule,
      input: payload?.input,
      config: payload?.config,
      metadata: payload?.metadata,
      assistant_id: assistantId,
      interrupt_before: payload?.interruptBefore,
      interrupt_after: payload?.interruptAfter,
      webhook: payload?.webhook,
      multitask_strategy: payload?.multitaskStrategy,
    };
    return this.fetch<Run>(`/threads/${threadId}/runs/crons`, {
      method: "POST",
      json,
    });
  }

  /**
   *
   * @param assistantId Assistant ID to use for this cron job.
   * @param payload Payload for creating a cron job.
   * @returns
   */
  async create(
    assistantId: string,
    payload?: CronsCreatePayload,
  ): Promise<Run> {
    const json: Record<string, any> = {
      schedule: payload?.schedule,
      input: payload?.input,
      config: payload?.config,
      metadata: payload?.metadata,
      assistant_id: assistantId,
      interrupt_before: payload?.interruptBefore,
      interrupt_after: payload?.interruptAfter,
      webhook: payload?.webhook,
      multitask_strategy: payload?.multitaskStrategy,
    };
    return this.fetch<Run>(`/runs/crons`, {
      method: "POST",
      json,
    });
  }

  /**
   *
   * @param cronId Cron ID of Cron job to delete.
   */
  async delete(cronId: string): Promise<void> {
    await this.fetch<void>(`/runs/crons/${cronId}`, {
      method: "DELETE",
    });
  }

  /**
   *
   * @param query Query options.
   * @returns List of crons.
   */
  async search(query?: {
    assistantId?: string;
    threadId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Cron[]> {
    return this.fetch<Cron[]>("/runs/crons/search", {
      method: "POST",
      json: {
        assistant_id: query?.assistantId ?? undefined,
        thread_id: query?.threadId ?? undefined,
        limit: query?.limit ?? 10,
        offset: query?.offset ?? 0,
      },
    });
  }
}

export class AssistantsClient extends BaseClient {
  /**
   * Get an assistant by ID.
   *
   * @param assistantId The ID of the assistant.
   * @returns Assistant
   */
  async get(assistantId: string): Promise<Assistant> {
    return this.fetch<Assistant>(`/assistants/${assistantId}`);
  }

  /**
   * Get the JSON representation of the graph assigned to a runnable
   * @param assistantId The ID of the assistant.
   * @param options.xray Whether to include subgraphs in the serialized graph representation. If an integer value is provided, only subgraphs with a depth less than or equal to the value will be included.
   * @returns Serialized graph
   */
  async getGraph(
    assistantId: string,
    options?: { xray?: boolean | number },
  ): Promise<AssistantGraph> {
    return this.fetch<AssistantGraph>(`/assistants/${assistantId}/graph`, {
      params: { xray: options?.xray },
    });
  }

  /**
   * Get the state and config schema of the graph assigned to a runnable
   * @param assistantId The ID of the assistant.
   * @returns Graph schema
   */
  async getSchemas(assistantId: string): Promise<GraphSchema> {
    return this.fetch<GraphSchema>(`/assistants/${assistantId}/schemas`);
  }

  /**
   * Get the schemas of an assistant by ID.
   *
   * @param assistantId The ID of the assistant to get the schema of.
   * @param options Additional options for getting subgraphs, such as namespace or recursion extraction.
   * @returns The subgraphs of the assistant.
   */
  async getSubgraphs(
    assistantId: string,
    options?: {
      namespace?: string;
      recurse?: boolean;
    },
  ): Promise<Subgraphs> {
    if (options?.namespace) {
      return this.fetch<Subgraphs>(
        `/assistants/${assistantId}/subgraphs/${options.namespace}`,
        { params: { recurse: options?.recurse } },
      );
    }
    return this.fetch<Subgraphs>(`/assistants/${assistantId}/subgraphs`, {
      params: { recurse: options?.recurse },
    });
  }

  /**
   * Create a new assistant.
   * @param payload Payload for creating an assistant.
   * @returns The created assistant.
   */
  async create(payload: {
    graphId: string;
    config?: Config;
    metadata?: Metadata;
    assistantId?: string;
    ifExists?: OnConflictBehavior;
    name?: string;
  }): Promise<Assistant> {
    return this.fetch<Assistant>("/assistants", {
      method: "POST",
      json: {
        graph_id: payload.graphId,
        config: payload.config,
        metadata: payload.metadata,
        assistant_id: payload.assistantId,
        if_exists: payload.ifExists,
        name: payload.name,
      },
    });
  }

  /**
   * Update an assistant.
   * @param assistantId ID of the assistant.
   * @param payload Payload for updating the assistant.
   * @returns The updated assistant.
   */
  async update(
    assistantId: string,
    payload: {
      graphId?: string;
      config?: Config;
      metadata?: Metadata;
      name?: string;
    },
  ): Promise<Assistant> {
    return this.fetch<Assistant>(`/assistants/${assistantId}`, {
      method: "PATCH",
      json: {
        graph_id: payload.graphId,
        config: payload.config,
        metadata: payload.metadata,
        name: payload.name,
      },
    });
  }

  /**
   * Delete an assistant.
   *
   * @param assistantId ID of the assistant.
   */
  async delete(assistantId: string): Promise<void> {
    return this.fetch<void>(`/assistants/${assistantId}`, {
      method: "DELETE",
    });
  }

  /**
   * List assistants.
   * @param query Query options.
   * @returns List of assistants.
   */
  async search(query?: {
    graphId?: string;
    metadata?: Metadata;
    limit?: number;
    offset?: number;
  }): Promise<Assistant[]> {
    return this.fetch<Assistant[]>("/assistants/search", {
      method: "POST",
      json: {
        graph_id: query?.graphId ?? undefined,
        metadata: query?.metadata ?? undefined,
        limit: query?.limit ?? 10,
        offset: query?.offset ?? 0,
      },
    });
  }

  /**
   * List all versions of an assistant.
   *
   * @param assistantId ID of the assistant.
   * @returns List of assistant versions.
   */
  async getVersions(
    assistantId: string,
    payload?: {
      metadata?: Metadata;
      limit?: number;
      offset?: number;
    },
  ): Promise<AssistantVersion[]> {
    return this.fetch<AssistantVersion[]>(
      `/assistants/${assistantId}/versions`,
      {
        method: "POST",
        json: {
          metadata: payload?.metadata ?? undefined,
          limit: payload?.limit ?? 10,
          offset: payload?.offset ?? 0,
        },
      },
    );
  }

  /**
   * Change the version of an assistant.
   *
   * @param assistantId ID of the assistant.
   * @param version The version to change to.
   * @returns The updated assistant.
   */
  async setLatest(assistantId: string, version: number): Promise<Assistant> {
    return this.fetch<Assistant>(`/assistants/${assistantId}/latest`, {
      method: "POST",
      json: { version },
    });
  }
}

export class ThreadsClient extends BaseClient {
  /**
   * Get a thread by ID.
   *
   * @param threadId ID of the thread.
   * @returns The thread.
   */
  async get(threadId: string): Promise<Thread> {
    return this.fetch<Thread>(`/threads/${threadId}`);
  }

  /**
   * Create a new thread.
   *
   * @param payload Payload for creating a thread.
   * @returns The created thread.
   */
  async create(payload?: {
    /**
     * Metadata for the thread.
     */
    metadata?: Metadata;
    threadId?: string;
    ifExists?: OnConflictBehavior;
  }): Promise<Thread> {
    return this.fetch<Thread>(`/threads`, {
      method: "POST",
      json: {
        metadata: payload?.metadata,
        thread_id: payload?.threadId,
        if_exists: payload?.ifExists,
      },
    });
  }

  /**
   * Copy an existing thread
   * @param threadId ID of the thread to be copied
   * @returns Newly copied thread
   */
  async copy(threadId: string): Promise<Thread> {
    return this.fetch<Thread>(`/threads/${threadId}/copy`, {
      method: "POST",
    });
  }

  /**
   * Update a thread.
   *
   * @param threadId ID of the thread.
   * @param payload Payload for updating the thread.
   * @returns The updated thread.
   */
  async update(
    threadId: string,
    payload?: {
      /**
       * Metadata for the thread.
       */
      metadata?: Metadata;
    },
  ): Promise<Thread> {
    return this.fetch<Thread>(`/threads/${threadId}`, {
      method: "PATCH",
      json: { metadata: payload?.metadata },
    });
  }

  /**
   * Delete a thread.
   *
   * @param threadId ID of the thread.
   */
  async delete(threadId: string): Promise<void> {
    return this.fetch<void>(`/threads/${threadId}`, {
      method: "DELETE",
    });
  }

  /**
   * List threads
   *
   * @param query Query options
   * @returns List of threads
   */
  async search(query?: {
    /**
     * Metadata to filter threads by.
     */
    metadata?: Metadata;
    /**
     * Maximum number of threads to return.
     * Defaults to 10
     */
    limit?: number;
    /**
     * Offset to start from.
     */
    offset?: number;
  }): Promise<Thread[]> {
    return this.fetch<Thread[]>("/threads/search", {
      method: "POST",
      json: {
        metadata: query?.metadata ?? undefined,
        limit: query?.limit ?? 10,
        offset: query?.offset ?? 0,
      },
    });
  }

  /**
   * Get state for a thread.
   *
   * @param threadId ID of the thread.
   * @returns Thread state.
   */
  async getState<ValuesType = DefaultValues>(
    threadId: string,
    checkpoint?: Checkpoint | string,
    options?: { subgraphs?: boolean },
  ): Promise<ThreadState<ValuesType>> {
    if (checkpoint != null) {
      if (typeof checkpoint !== "string") {
        return this.fetch<ThreadState<ValuesType>>(
          `/threads/${threadId}/state/checkpoint`,
          {
            method: "POST",
            json: { checkpoint, subgraphs: options?.subgraphs },
          },
        );
      }

      // deprecated
      return this.fetch<ThreadState<ValuesType>>(
        `/threads/${threadId}/state/${checkpoint}`,
        { params: { subgraphs: options?.subgraphs } },
      );
    }

    return this.fetch<ThreadState<ValuesType>>(`/threads/${threadId}/state`, {
      params: { subgraphs: options?.subgraphs },
    });
  }

  /**
   * Add state to a thread.
   *
   * @param threadId The ID of the thread.
   * @returns
   */
  async updateState<ValuesType = DefaultValues>(
    threadId: string,
    options: {
      values: ValuesType;
      checkpoint?: Checkpoint;
      checkpointId?: string;
      asNode?: string;
    },
  ): Promise<Pick<Config, "configurable">> {
    return this.fetch<Pick<Config, "configurable">>(
      `/threads/${threadId}/state`,
      {
        method: "POST",
        json: {
          values: options.values,
          checkpoint_id: options.checkpointId,
          checkpoint: options.checkpoint,
          as_node: options?.asNode,
        },
      },
    );
  }

  /**
   * Patch the metadata of a thread.
   *
   * @param threadIdOrConfig Thread ID or config to patch the state of.
   * @param metadata Metadata to patch the state with.
   */
  async patchState(
    threadIdOrConfig: string | Config,
    metadata: Metadata,
  ): Promise<void> {
    let threadId: string;

    if (typeof threadIdOrConfig !== "string") {
      if (typeof threadIdOrConfig.configurable.thread_id !== "string") {
        throw new Error(
          "Thread ID is required when updating state with a config.",
        );
      }
      threadId = threadIdOrConfig.configurable.thread_id;
    } else {
      threadId = threadIdOrConfig;
    }

    return this.fetch<void>(`/threads/${threadId}/state`, {
      method: "PATCH",
      json: { metadata: metadata },
    });
  }

  /**
   * Get all past states for a thread.
   *
   * @param threadId ID of the thread.
   * @param options Additional options.
   * @returns List of thread states.
   */
  async getHistory<ValuesType = DefaultValues>(
    threadId: string,
    options?: {
      limit?: number;
      before?: Config;
      checkpoint?: Partial<Omit<Checkpoint, "thread_id">>;
      metadata?: Metadata;
    },
  ): Promise<ThreadState<ValuesType>[]> {
    return this.fetch<ThreadState<ValuesType>[]>(
      `/threads/${threadId}/history`,
      {
        method: "POST",
        json: {
          limit: options?.limit ?? 10,
          before: options?.before,
          metadata: options?.metadata,
          checkpoint: options?.checkpoint,
        },
      },
    );
  }
}

export class RunsClient extends BaseClient {
  stream(
    threadId: null,
    assistantId: string,
    payload?: Omit<RunsStreamPayload, "multitaskStrategy" | "onCompletion">,
  ): AsyncGenerator<{
    event: StreamEvent;
    data: any;
  }>;

  stream(
    threadId: string,
    assistantId: string,
    payload?: RunsStreamPayload,
  ): AsyncGenerator<{
    event: StreamEvent;
    data: any;
  }>;

  /**
   * Create a run and stream the results.
   *
   * @param threadId The ID of the thread.
   * @param assistantId Assistant ID to use for this run.
   * @param payload Payload for creating a run.
   */
  async *stream(
    threadId: string | null,
    assistantId: string,
    payload?: RunsStreamPayload,
  ): AsyncGenerator<{
    event: StreamEvent;
    data: any;
  }> {
    const json: Record<string, any> = {
      input: payload?.input,
      config: payload?.config,
      metadata: payload?.metadata,
      stream_mode: payload?.streamMode,
      stream_subgraphs: payload?.streamSubgraphs,
      feedback_keys: payload?.feedbackKeys,
      assistant_id: assistantId,
      interrupt_before: payload?.interruptBefore,
      interrupt_after: payload?.interruptAfter,
      checkpoint: payload?.checkpoint,
      checkpoint_id: payload?.checkpointId,
      webhook: payload?.webhook,
      multitask_strategy: payload?.multitaskStrategy,
      on_completion: payload?.onCompletion,
      on_disconnect: payload?.onDisconnect,
      after_seconds: payload?.afterSeconds,
    };

    const endpoint =
      threadId == null ? `/runs/stream` : `/threads/${threadId}/runs/stream`;
    const response = await this.asyncCaller.fetch(
      ...this.prepareFetchOptions(endpoint, {
        method: "POST",
        json,
        signal: payload?.signal,
      }),
    );

    let parser: EventSourceParser;
    let onEndEvent: () => void;
    const textDecoder = new TextDecoder();

    const stream: ReadableStream<{ event: string; data: any }> = (
      response.body || new ReadableStream({ start: (ctrl) => ctrl.close() })
    ).pipeThrough(
      new TransformStream({
        async start(ctrl) {
          parser = createParser((event) => {
            if (
              (payload?.signal && payload.signal.aborted) ||
              (event.type === "event" && event.data === "[DONE]")
            ) {
              ctrl.terminate();
              return;
            }

            if ("data" in event) {
              ctrl.enqueue({
                event: event.event ?? "message",
                data: JSON.parse(event.data),
              });
            }
          });
          onEndEvent = () => {
            ctrl.enqueue({ event: "end", data: undefined });
          };
        },
        async transform(chunk) {
          const payload = textDecoder.decode(chunk);
          parser.feed(payload);

          // eventsource-parser will ignore events
          // that are not terminated by a newline
          if (payload.trim() === "event: end") onEndEvent();
        },
      }),
    );

    yield* IterableReadableStream.fromReadableStream(stream);
  }

  /**
   * Create a run.
   *
   * @param threadId The ID of the thread.
   * @param assistantId Assistant ID to use for this run.
   * @param payload Payload for creating a run.
   * @returns The created run.
   */
  async create(
    threadId: string,
    assistantId: string,
    payload?: RunsCreatePayload,
  ): Promise<Run> {
    const json: Record<string, any> = {
      input: payload?.input,
      config: payload?.config,
      metadata: payload?.metadata,
      assistant_id: assistantId,
      interrupt_before: payload?.interruptBefore,
      interrupt_after: payload?.interruptAfter,
      webhook: payload?.webhook,
      checkpoint: payload?.checkpoint,
      checkpoint_id: payload?.checkpointId,
      multitask_strategy: payload?.multitaskStrategy,
      after_seconds: payload?.afterSeconds,
    };
    return this.fetch<Run>(`/threads/${threadId}/runs`, {
      method: "POST",
      json,
      signal: payload?.signal,
    });
  }

  /**
   * Create a batch of stateless background runs.
   *
   * @param payloads An array of payloads for creating runs.
   * @returns An array of created runs.
   */
  async createBatch(
    payloads: (RunsCreatePayload & { assistantId: string })[],
  ): Promise<Run[]> {
    const filteredPayloads = payloads
      .map((payload) => ({ ...payload, assistant_id: payload.assistantId }))
      .map((payload) => {
        return Object.fromEntries(
          Object.entries(payload).filter(([_, v]) => v !== undefined),
        );
      });

    return this.fetch<Run[]>("/runs/batch", {
      method: "POST",
      json: filteredPayloads,
    });
  }

  async wait(
    threadId: null,
    assistantId: string,
    payload?: Omit<RunsWaitPayload, "multitaskStrategy" | "onCompletion">,
  ): Promise<ThreadState["values"]>;

  async wait(
    threadId: string,
    assistantId: string,
    payload?: RunsWaitPayload,
  ): Promise<ThreadState["values"]>;

  /**
   * Create a run and wait for it to complete.
   *
   * @param threadId The ID of the thread.
   * @param assistantId Assistant ID to use for this run.
   * @param payload Payload for creating a run.
   * @returns The last values chunk of the thread.
   */
  async wait(
    threadId: string | null,
    assistantId: string,
    payload?: RunsWaitPayload,
  ): Promise<ThreadState["values"]> {
    const json: Record<string, any> = {
      input: payload?.input,
      config: payload?.config,
      metadata: payload?.metadata,
      assistant_id: assistantId,
      interrupt_before: payload?.interruptBefore,
      interrupt_after: payload?.interruptAfter,
      checkpoint: payload?.checkpoint,
      checkpoint_id: payload?.checkpointId,
      webhook: payload?.webhook,
      multitask_strategy: payload?.multitaskStrategy,
      on_completion: payload?.onCompletion,
      on_disconnect: payload?.onDisconnect,
      after_seconds: payload?.afterSeconds,
    };
    const endpoint =
      threadId == null ? `/runs/wait` : `/threads/${threadId}/runs/wait`;
    return this.fetch<ThreadState["values"]>(endpoint, {
      method: "POST",
      json,
      signal: payload?.signal,
    });
  }

  /**
   * List all runs for a thread.
   *
   * @param threadId The ID of the thread.
   * @param options Filtering and pagination options.
   * @returns List of runs.
   */
  async list(
    threadId: string,
    options?: {
      /**
       * Maximum number of runs to return.
       * Defaults to 10
       */
      limit?: number;

      /**
       * Offset to start from.
       * Defaults to 0.
       */
      offset?: number;
    },
  ): Promise<Run[]> {
    return this.fetch<Run[]>(`/threads/${threadId}/runs`, {
      params: {
        limit: options?.limit ?? 10,
        offset: options?.offset ?? 0,
      },
    });
  }

  /**
   * Get a run by ID.
   *
   * @param threadId The ID of the thread.
   * @param runId The ID of the run.
   * @returns The run.
   */
  async get(threadId: string, runId: string): Promise<Run> {
    return this.fetch<Run>(`/threads/${threadId}/runs/${runId}`);
  }

  /**
   * Cancel a run.
   *
   * @param threadId The ID of the thread.
   * @param runId The ID of the run.
   * @param wait Whether to block when canceling
   * @returns
   */
  async cancel(threadId: string, runId: string, wait = false): Promise<void> {
    return this.fetch<void>(`/threads/${threadId}/runs/${runId}/cancel`, {
      method: "POST",
      params: {
        wait: wait ? "1" : "0",
      },
    });
  }

  /**
   * Block until a run is done.
   *
   * @param threadId The ID of the thread.
   * @param runId The ID of the run.
   * @returns
   */
  async join(threadId: string, runId: string): Promise<void> {
    return this.fetch<void>(`/threads/${threadId}/runs/${runId}/join`);
  }

  /**
   * Stream output from a run in real-time, until the run is done.
   * Output is not buffered, so any output produced before this call will
   * not be received here.
   *
   * @param threadId The ID of the thread.
   * @param runId The ID of the run.
   * @param signal An optional abort signal.
   * @returns An async generator yielding stream parts.
   */
  async *joinStream(
    threadId: string,
    runId: string,
    signal?: AbortSignal,
  ): AsyncGenerator<{ event: StreamEvent; data: any }> {
    const response = await this.asyncCaller.fetch(
      ...this.prepareFetchOptions(`/threads/${threadId}/runs/${runId}/stream`, {
        method: "GET",
        signal,
      }),
    );

    let parser: EventSourceParser;
    let onEndEvent: () => void;
    const textDecoder = new TextDecoder();

    const stream: ReadableStream<{ event: string; data: any }> = (
      response.body || new ReadableStream({ start: (ctrl) => ctrl.close() })
    ).pipeThrough(
      new TransformStream({
        async start(ctrl) {
          parser = createParser((event) => {
            if (
              signal?.aborted ||
              (event.type === "event" && event.data === "[DONE]")
            ) {
              ctrl.terminate();
              return;
            }

            if ("data" in event) {
              ctrl.enqueue({
                event: event.event ?? "message",
                data: JSON.parse(event.data),
              });
            }
          });
          onEndEvent = () => {
            ctrl.enqueue({ event: "end", data: undefined });
          };
        },
        async transform(chunk) {
          const payload = textDecoder.decode(chunk);
          parser.feed(payload);

          // eventsource-parser will ignore events
          // that are not terminated by a newline
          if (payload.trim() === "event: end") onEndEvent();
        },
      }),
    );

    yield* IterableReadableStream.fromReadableStream(stream);
  }

  /**
   * Delete a run.
   *
   * @param threadId The ID of the thread.
   * @param runId The ID of the run.
   * @returns
   */
  async delete(threadId: string, runId: string): Promise<void> {
    return this.fetch<void>(`/threads/${threadId}/runs/${runId}`, {
      method: "DELETE",
    });
  }
}

interface APIItem {
  namespace: string[];
  key: string;
  value: Record<string, any>;
  created_at: string;
  updated_at: string;
}
interface APISearchItemsResponse {
  items: APIItem[];
}

export class StoreClient extends BaseClient {
  /**
   * Store or update an item.
   *
   * @param namespace A list of strings representing the namespace path.
   * @param key The unique identifier for the item within the namespace.
   * @param value A dictionary containing the item's data.
   * @returns Promise<void>
   */
  async putItem(
    namespace: string[],
    key: string,
    value: Record<string, any>,
  ): Promise<void> {
    namespace.forEach((label) => {
      if (label.includes(".")) {
        throw new Error(
          `Invalid namespace label '${label}'. Namespace labels cannot contain periods ('.')`,
        );
      }
    });

    const payload = {
      namespace,
      key,
      value,
    };

    return this.fetch<void>("/store/items", {
      method: "PUT",
      json: payload,
    });
  }

  /**
   * Retrieve a single item.
   *
   * @param namespace A list of strings representing the namespace path.
   * @param key The unique identifier for the item.
   * @returns Promise<Item>
   */
  async getItem(namespace: string[], key: string): Promise<Item | null> {
    namespace.forEach((label) => {
      if (label.includes(".")) {
        throw new Error(
          `Invalid namespace label '${label}'. Namespace labels cannot contain periods ('.')`,
        );
      }
    });

    const response = await this.fetch<APIItem>("/store/items", {
      params: { namespace: namespace.join("."), key },
    });

    return response
      ? {
          ...response,
          createdAt: response.created_at,
          updatedAt: response.updated_at,
        }
      : null;
  }

  /**
   * Delete an item.
   *
   * @param namespace A list of strings representing the namespace path.
   * @param key The unique identifier for the item.
   * @returns Promise<void>
   */
  async deleteItem(namespace: string[], key: string): Promise<void> {
    namespace.forEach((label) => {
      if (label.includes(".")) {
        throw new Error(
          `Invalid namespace label '${label}'. Namespace labels cannot contain periods ('.')`,
        );
      }
    });

    return this.fetch<void>("/store/items", {
      method: "DELETE",
      json: { namespace, key },
    });
  }

  /**
   * Search for items within a namespace prefix.
   *
   * @param namespacePrefix List of strings representing the namespace prefix.
   * @param options.filter Optional dictionary of key-value pairs to filter results.
   * @param options.limit Maximum number of items to return (default is 10).
   * @param options.offset Number of items to skip before returning results (default is 0).
   * @returns Promise<SearchItemsResponse>
   */
  async searchItems(
    namespacePrefix: string[],
    options?: {
      filter?: Record<string, any>;
      limit?: number;
      offset?: number;
    },
  ): Promise<SearchItemsResponse> {
    const payload = {
      namespace_prefix: namespacePrefix,
      filter: options?.filter,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
    };

    const response = await this.fetch<APISearchItemsResponse>(
      "/store/items/search",
      {
        method: "POST",
        json: payload,
      },
    );
    return {
      items: response.items.map((item) => ({
        ...item,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
    };
  }

  /**
   * List namespaces with optional match conditions.
   *
   * @param options.prefix Optional list of strings representing the prefix to filter namespaces.
   * @param options.suffix Optional list of strings representing the suffix to filter namespaces.
   * @param options.maxDepth Optional integer specifying the maximum depth of namespaces to return.
   * @param options.limit Maximum number of namespaces to return (default is 100).
   * @param options.offset Number of namespaces to skip before returning results (default is 0).
   * @returns Promise<ListNamespaceResponse>
   */
  async listNamespaces(options?: {
    prefix?: string[];
    suffix?: string[];
    maxDepth?: number;
    limit?: number;
    offset?: number;
  }): Promise<ListNamespaceResponse> {
    const payload = {
      prefix: options?.prefix,
      suffix: options?.suffix,
      max_depth: options?.maxDepth,
      limit: options?.limit ?? 100,
      offset: options?.offset ?? 0,
    };

    return this.fetch<ListNamespaceResponse>("/store/namespaces", {
      method: "POST",
      json: payload,
    });
  }
}

export class Client {
  /**
   * The client for interacting with assistants.
   */
  public assistants: AssistantsClient;

  /**
   * The client for interacting with threads.
   */
  public threads: ThreadsClient;

  /**
   * The client for interacting with runs.
   */
  public runs: RunsClient;

  /**
   * The client for interacting with cron runs.
   */
  public crons: CronsClient;

  /**
   * The client for interacting with the KV store.
   */
  public store: StoreClient;

  constructor(config?: ClientConfig) {
    this.assistants = new AssistantsClient(config);
    this.threads = new ThreadsClient(config);
    this.runs = new RunsClient(config);
    this.crons = new CronsClient(config);
    this.store = new StoreClient(config);
  }
}