"use client";

import type { Client } from "@connectrpc/connect";
import { debounce } from "lodash";
import type {
  AgState,
  AgentRunInput,
  ChatMessage,
  ChatMessageList,
  Tenant,
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
import { submitMessages } from "./submitMessages";

export interface WorkbenchProps {
  componentId?: string;
  threadId?: string;
  teamState?: AgState;
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
  // openDebugPanel?: boolean;
  tenant: Tenant;
  agClient: Client<typeof AgService>;
  runtimeClient: Client<typeof AgentRpc>;
  eventClient: Client<typeof EventsService>;
  dispatcherClient: Client<typeof Dispatcher>;
  setThreadId: (threadId?: string) => void;
  // setOpenDebugPanel: (openDebugPanel: boolean) => void;
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
  setTeamState: (teamState: AgState) => void;
  loadChatMessageList: (response?: ChatMessageList) => void;
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

    handleHumanInput: debounce(async ({ content, componentId }) => {
      const preMessages = get().messages;
      const newChatMessage = {
        role: "user",
        content,
        componentId,
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
      if (componentId) {
        set({ componentId });
      }
      submitMessages(set, get);
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
