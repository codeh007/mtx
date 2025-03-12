"use client";

import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import type { Client } from "@connectrpc/connect";
import type { UseNavigateResult } from "@tanstack/react-router";
import { debounce } from "lodash";
import type {
  AgentRunInput,
  ChatMessage,
  Tenant,
  TextHighlight,
} from "mtmaiapi";
import type { AgService } from "mtmaiapi/mtmclient/mtmai/mtmpb/ag_pb";
import type { AgentRpc } from "mtmaiapi/mtmclient/mtmai/mtmpb/agent_worker_pb";
import type { Dispatcher } from "mtmaiapi/mtmclient/mtmai/mtmpb/dispatcher_pb";
import type { EventsService } from "mtmaiapi/mtmclient/mtmai/mtmpb/events_pb";
import type { Suggestion } from "mtxuilib/db/schema/suggestion";
import { generateUUID } from "mtxuilib/lib/utils";
import { submitMessages } from "./submitMessages";

export interface IAskForm {
  callback: (data) => void;
}
export interface WorkbenchProps {
  backendUrl: string;
  accessToken?: string;
  params?: Record<string, any>;
  openDebugPanel?: boolean;
  threadId?: string;
  tenant: Tenant;
  agClient: Client<typeof AgService>;
  runtimeClient: Client<typeof AgentRpc>;
  eventClient: Client<typeof EventsService>;
  dispatcherClient: Client<typeof Dispatcher>;
  nav: UseNavigateResult<string>;
}
export type StreamingDelta = {
  type: "text-delta" | "title" | "id" | "suggestion" | "clear" | "finish";
  content: string | Suggestion;
};
const DEFAULT_AGENT_FLOW_SETTINGS = {
  direction: "TB",
  showLabels: true,
  showGrid: true,
  showTokens: true,
  showMessages: true,
  showMiniMap: false,
};

export interface WorkbrenchState extends WorkbenchProps {
  setThreadId: (threadId?: string) => void;
  setOpenDebugPanel: (openDebugPanel: boolean) => void;
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
  sessionId: string;
  setSessionId: (sessionId: string) => void;
  firstUserInteraction?: string;
  setFirstUserInteraction: (firstUserInteraction: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  // askForm?: IAskForm;
  // setAskForm: (askForm?: IAskForm) => void;
  input?: string;
  setInput: (input: string) => void;
  handleHumanInput: (input: AgentRunInput) => void;
  handleEvents: (eventName: string, data: any) => void;
  chatBotType: "";
  subscribeEvents: (options: {
    runId: string;
  }) => void;
  // resource?: string;
  resourceId?: string;
  // setResource: (resource: string) => void;
  setResourceId: (resourceId: string) => void;

  componentId?: string;
  setComponentId: (componentId: string) => void;

  selectedModelId?: string;
  setSelectedModelId: (selectedModelId: string) => void;
  chatStarted?: boolean;
  setChatStarted: (chatStarted: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  openWorkbench?: boolean;
  setOpenWorkbench: (openWorkbench: boolean) => void;
  isOpenWorkbenchChat: boolean;
  setIsOpenWorkbenchChat: (isOpenWorkbenchChat: boolean) => void;
  runner?: string;
  setRunner: (runner: string) => void;
  // teamId: string;
  // setTeamId: (teamId: string) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  runId: string;
  setRunId: (runId: string) => void;
  // artifact: ArtifactV3 | undefined;
  // setArtifact: (artifact: ArtifactV3) => void;
  isArtifactSaved: boolean;
  setIsArtifactSaved: (isArtifactSaved: boolean) => void;
  selectedArtifact: number;
  setSelectedArtifact: (index: number) => void;
  selectedBlocks: TextHighlight | undefined;
  setSelectedBlocks: (selectedBlocks?: TextHighlight) => void;
  streamMessage: (params: AgentRunInput) => Promise<void>;
  updateRenderedArtifactRequired: boolean;
  setUpdateRenderedArtifactRequired: (
    updateRenderedArtifactRequired: boolean,
  ) => void;
  artifactContent: string[];
  setArtifactContent: (index: number, content: string) => void;
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
    setOpenDebugPanel: (openDebugPanel) => set({ openDebugPanel }),
    setSelectedModelId: (selectedModelId) => set({ selectedModelId }),
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

    handleHumanInput: debounce(async ({ content, resourceId, componentId }) => {
      const preMessages = get().messages;
      const newChatMessage = {
        role: "user",
        content,
        resourceId,
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
        resourceId,
        componentId,
        messages: [...preMessages, newChatMessage],
      });
      submitMessages(set, get);
    }, 100),
    setMessages: (messages) => set({ messages }),
    setShowWorkbench: (openWorkbench) => {
      set({ openWorkbench });
    },
    setThreadId: (threadId) => {
      set({ threadId });
    },
    setResourceId: (resourceId) => {
      set({ resourceId });
    },
    setComponentId: (componentId) => {
      set({ componentId });
    },

    setChatStarted: (chatStarted: boolean) => {
      set({ chatStarted });
    },
    setOpenWorkbench: (openWorkbench: boolean) => {
      // console.log("setOpenWorkbench", openWorkbench);
      set({ openWorkbench });
    },
    setRunnerName: (runnerName: string) => {
      set({ runner: runnerName });
    },
    setIsStreaming: (isStreaming: boolean) => {
      set({ isStreaming });
    },
    setFirstTokenReceived: (firstTokenReceived: boolean) => {
      set({ firstTokenReceived });
    },
    setRunId: (runId: string) => {
      set({ runId });
    },
    // setTeamId: (teamId: string) => {
    //   set({ teamId });
    // },
    // setArtifact: (artifact: ArtifactV3) => {
    //   set({ artifact });
    // },

    setSelectedBlocks: (selectedBlocks: TextHighlight) => {
      set({ selectedBlocks });
    },
    // setIsArtifactSaved: (isArtifactSaved: boolean) => {
    //   set({ isArtifactSaved });
    // },
    setSelectedArtifact: (index: number) => {
      set({ selectedArtifact: index });
    },
    addMessage: (message: ChatMessage) => {
      const prevMessages = get().messages;
      set({ messages: [...prevMessages, message] });
    },
    // connectionId: uuidv4(),
    // header: {
    //   title: "",
    //   breadcrumbs: [],
    // },
    agentFlow: DEFAULT_AGENT_FLOW_SETTINGS,
    sidebar: {
      isExpanded: true,
      isPinned: false,
    },
    ...init,
  };
};

type mtappStore = ReturnType<typeof createWordbrenchStore>;
export type WorkbrenchStoreState = WorkbrenchState;

const createWordbrenchStore = (initProps?: Partial<WorkbrenchStoreState>) => {
  return createStore<WorkbrenchStoreState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          // ...createMessageParserSlice(...a),
          ...initProps,
        })),
        {
          name: "workbench-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<mtappStore | null>(null);

type AppProviderProps = React.PropsWithChildren<WorkbenchProps>;
export const WorkbrenchProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(() => createWordbrenchStore(etc), [etc]);
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useWorkbenchStore(): WorkbrenchStoreState;
export function useWorkbenchStore<T>(
  selector: (state: WorkbrenchStoreState) => T,
): T;
export function useWorkbenchStore<T>(
  selector?: (state: WorkbrenchStoreState) => T,
) {
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
