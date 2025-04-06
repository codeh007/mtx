"use client";

import type { Client } from "@connectrpc/connect";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import {
  type AgState,
  type AgentRunInput,
  type ApiErrors,
  type ChatMessage,
  type ChatMessageList,
  FlowNames,
  type Options,
  type Tenant,
  type WorkflowRun,
  type WorkflowRunCreateData,
  workflowRunCreate,
  workflowRunCreateMutation,
} from "mtmaiapi";
import { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import { AgentRpc } from "mtmaiapi/mtmclient/mtmai/mtmpb/agent_worker_pb";
import { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import { EventsService } from "mtmaiapi/mtmclient/mtmai/mtmpb/events_pb";
import { generateUUID } from "mtxuilib/lib/utils";
import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useTransition,
} from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenant } from "../hooks/useAuth";
import { useNav, useSearch } from "../hooks/useNav";
import { useMtmaiV2 } from "./StoreProvider";
import { useGomtmClient } from "./TransportProvider";
import { handleWorkflowRunEvent } from "./submitMessages";

export interface WorkbenchProps {
  componentId?: string;
  threadId?: string;
  teamState?: AgState;
  resourceId?: string;
}
const DEFAULT_AGENT_FLOW_SETTINGS = {
  direction: "TB",
  showLabels: true,
  showGrid: true,
  showTokens: true,
  showMessages: true,
  showMiniMap: false,
};

export interface WorkbrenchState extends WorkbenchProps {
  backendUrl: string;
  accessToken?: string;
  params?: Record<string, any>;
  tenant: Tenant;
  agClient: Client<typeof AgService>;
  runtimeClient: Client<typeof AgentRpc>;
  eventClient: Client<typeof EventsService>;
  dispatcherClient: Client<typeof Dispatcher>;
  setThreadId: (threadId?: string) => void;
  workbenchViewProps?: Record<string, any>;
  setWorkbenchViewProps: (props?: Record<string, any>) => void;
  appendChatMessageCb?: (message) => void;
  setAccessToken: (accessToken: string) => void;
  messageParser?: (messages: Message[]) => void;
  setMessageParser: (messageParser: (messages: Message[]) => void) => void;
  openChat?: boolean;
  setOpenChat: (openChat: boolean) => void;
  setCurrentWorkbenchView: (id: string) => void;
  started: boolean;
  setStarted: (started: boolean) => void;
  chatEndpoint: string;
  setChatEndpoint: (chatEndpoint: string) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  setSessionId: (sessionId: string) => void;
  firstUserInteraction?: string;
  setFirstUserInteraction: (firstUserInteraction: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  input?: string;
  setInput: (input: string) => void;
  handleHumanInput: (input: AgentRunInput) => void;
  setComponentId: (componentId: string) => void;
  workflowRunId?: string;
  setWorkflowRunId: (workflowRunId: string) => void;
  chatStarted?: boolean;
  setChatStarted: (chatStarted: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  openWorkbench?: boolean;
  setOpenWorkbench: (openWorkbench: boolean) => void;
  isOpenWorkbenchChat: boolean;
  setIsOpenWorkbenchChat: (isOpenWorkbenchChat: boolean) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  streamMessage: (params: AgentRunInput) => Promise<void>;
  setResourceId: (resourceId: string) => void;
  setTeamState: (teamState: AgState) => void;
  loadChatMessageList: (response?: ChatMessageList) => void;
  workflowRunCreateMut: UseMutationResult<
    WorkflowRun,
    ApiErrors,
    Options<WorkflowRunCreateData>,
    unknown
  >;
  workflowRunCreate: (
    name: string,
    input: Record<string, any>,
    additionalMetadata: Record<string, any>,
  ) => Promise<WorkflowRun>;
}

export const createWorkbrenchSlice: StateCreator<
  WorkbrenchState,
  [],
  [],
  WorkbrenchState
> = (set, get, init) => {
  return {
    isDev: false,
    backendUrl: "",
    // setOpenDebugPanel: (openDebugPanel) => set({ openDebugPanel }),
    setInput: (input) => set({ input }),
    messages: [],
    firstUserInteraction: undefined,
    setFirstUserInteraction: (firstUserInteraction) =>
      set({ firstUserInteraction }),
    setAccessToken: (accessToken: string) => {
      set({ accessToken });
    },
    setParams: (params: Record<string, any>) => {
      set({ params });
    },
    setMessageParser: (messageParser: (messages: Message[]) => void) => {
      set({ messageParser });
    },
    openChat: false,
    setOpenChat: (openChat: boolean) => {
      set({ openChat });
    },

    handleHumanInput: debounce(async (input) => {
      const preMessages = get().messages;
      const newChatMessage = {
        role: "user",
        content: input.content,
        componentId: input.componentId,
        topic: "default",
        source: "web",
        metadata: {
          id: generateUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      } as ChatMessage;
      set({
        messages: [...preMessages, newChatMessage],
      });
      // if (input.componentId) {
      //   set({ componentId: input.componentId });
      // }
      const response = await workflowRunCreate({
        path: {
          workflow: FlowNames.AG,
        },
        body: {
          input: input,
          additionalMetadata: {
            sessionId: get().threadId,
            // componentId: input.componentId,
            // source: "web",
            // topic: "default",
          },
        },
      });
      if (response?.data) {
        // console.log("response", response);
        // pull stream event
        if (response.data?.metadata?.id) {
          const workflowRunId = response.data.metadata?.id;
          set({ workflowRunId: workflowRunId });
          const result = await get().dispatcherClient.subscribeToWorkflowEvents(
            {
              workflowRunId: workflowRunId,
            },
          );
          for await (const event of result) {
            handleWorkflowRunEvent(event, get, set);
          }
        }
      }
    }, 100),
    setMessages: (messages) => set({ messages }),
    setShowWorkbench: (openWorkbench) => {
      set({ openWorkbench });
    },
    setThreadId: (threadId) => {
      set({ threadId });
    },
    setComponentId: (componentId) => {
      set({ componentId });
    },
    setWorkflowRunId: (workflowRunId) => {
      set({ workflowRunId });
    },
    setChatStarted: (chatStarted: boolean) => {
      set({ chatStarted });
    },
    setOpenWorkbench: (openWorkbench: boolean) => {
      set({ openWorkbench });
    },
    setIsStreaming: (isStreaming: boolean) => {
      set({ isStreaming });
    },
    setFirstTokenReceived: (firstTokenReceived: boolean) => {
      set({ firstTokenReceived });
    },
    addMessage: (message: ChatMessage) => {
      const prevMessages = get().messages;
      set({ messages: [...prevMessages, message] });
    },
    setResourceId: (resourceId: string) => {
      set({ resourceId });
    },
    agentFlow: DEFAULT_AGENT_FLOW_SETTINGS,
    setTeamState: (teamState) => {
      set({ teamState });
    },
    loadChatMessageList: (chatMessageList) => {
      if (!chatMessageList?.rows?.length) {
        set({ messages: [] });
        return;
      }
      const messages = chatMessageList.rows.map((row) => {
        return {
          ...row,
          role: row.role,
          content: row.content,
        };
      });
      set({ messages: messages });
    },
    workflowRunCreate: async (name, input, additionalMetadata) => {
      const response = await get().workflowRunCreateMut.mutateAsync({
        path: {
          workflow: name,
        },
        body: {
          input,
          additionalMetadata,
        },
      });
      return response;
    },
    ...init,
  };
};

const createWordbrenchStore = (initProps?: Partial<WorkbrenchState>) => {
  return createStore<WorkbrenchState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          ...initProps,
        })),
        {
          name: "workbench-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<ReturnType<
  typeof createWordbrenchStore
> | null>(null);

type AppProviderProps = React.PropsWithChildren<WorkbenchProps>;
export const WorkbrenchProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  const nav = useNav();
  const eventClient = useGomtmClient(EventsService);
  const dispatcherClient = useGomtmClient(Dispatcher);
  const agrpcClient = useGomtmClient(AgentRpc);
  const mtmAgClient = useGomtmClient(AgService);
  const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  const [isPending, startTransition] = useTransition();
  const search = useSearch();
  const tenant = useTenant();
  const workflowRunCreate = useMutation({
    ...workflowRunCreateMutation(),
  });
  const mystore = useMemo(
    () =>
      createWordbrenchStore({
        ...etc,
        tenant: tenant,
        backendUrl: selfBackendend,
        eventClient: eventClient,
        dispatcherClient: dispatcherClient,
        runtimeClient: agrpcClient,
        agClient: mtmAgClient,
        workflowRunCreateMut: workflowRunCreate,
      }),
    [
      tenant,
      selfBackendend,
      eventClient,
      dispatcherClient,
      agrpcClient,
      mtmAgClient,
    ],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return mystore.subscribe(
      (state) => {
        return state.threadId;
      },
      debounce((cur, prev) => {
        console.log("threadId changed", cur, "prev", prev);
        startTransition(() => {
          nav({
            to: `/session/${cur}`,
            search: search,
          });
        });
      }, 100),
    );
  }, []);

  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useWorkbenchStore(): WorkbrenchState;
export function useWorkbenchStore<T>(
  selector: (state: WorkbrenchState) => T,
): T;
export function useWorkbenchStore<T>(selector?: (state: WorkbrenchState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useWorkbenchStore must in WorkbrenchProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(
      store,
      DEFAULT_USE_SHALLOW ? useShallow(selector) : selector,
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
