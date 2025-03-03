"use client";

import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import type { Client } from "@connectrpc/connect";
import type { UseNavigateResult } from "@tanstack/react-router";
import { debounce } from "lodash";
import type {
  AgentRunInput,
  ArtifactV3,
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
  chatProfile?: string;
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

export interface HubmanInput {
  content: string;
  resource?: string;
  resourceId?: string;
}

// 新增聊天事件类型
export type MtmaiChatEvent = {
  type: "newChatId" | "chatEnd";
  data: any;
};

export interface WorkbrenchState extends WorkbenchProps {
  setThreadId: (threadId?: string) => void;
  isOpenWorkbenchChat: boolean;
  setIsOpenWorkbenchChat: (isOpenWorkbenchChat: boolean) => void;
  setOpenDebugPanel: (openDebugPanel: boolean) => void;
  workbenchViewProps?: Record<string, any>;
  setWorkbenchViewProps: (props?: Record<string, any>) => void;
  openWorkbench: boolean;
  appendChatMessageCb?: (message) => void;
  setAccessToken: (accessToken: string) => void;
  messageParser?: (messages: Message[]) => void;
  setMessageParser: (messageParser: (messages: Message[]) => void) => void;
  setShowWorkbench: (openWorkbench: boolean) => void;
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
  askForm?: IAskForm;
  setAskForm: (askForm?: IAskForm) => void;
  chatProfile?: string;
  setChatProfile: (chatProfileState?: string) => void;
  setChatProfileId: (chatProfileId: string) => void;
  input?: string;
  setInput: (input: string) => void;
  handleHumanInput: (input: HubmanInput) => void;
  handleEvents: (eventName: string, data: any) => void;
  chatBotType: "";
  subscribeEvents: (options: {
    runId: string;
  }) => void;
  resource?: string;
  setResource: (resource: string) => void;
  resourceId?: string;
  selectedModelId?: string;
  setSelectedModelId: (selectedModelId: string) => void;
  setResourceId: (resourceId: string) => void;
  chatStarted?: boolean;
  setChatStarted: (chatStarted: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  openWorkBench?: boolean;
  setOpenWorkBench: (openWorkBench: boolean) => void;
  runner?: string;
  setRunner: (runner: string) => void;
  teamId: string;
  setTeamId: (teamId: string) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  runId: string;
  setRunId: (runId: string) => void;
  //可能放这里不合适
  artifact: ArtifactV3 | undefined;
  setArtifact: (artifact: ArtifactV3) => void;
  isArtifactSaved: boolean;
  setIsArtifactSaved: (isArtifactSaved: boolean) => void;
  selectedArtifact: number;
  setSelectedArtifact: (index: number) => void;
  //可能放这里不合适
  selectedBlocks: TextHighlight | undefined;
  setSelectedBlocks: (selectedBlocks?: TextHighlight) => void;
  streamMessage: (params: AgentRunInput) => Promise<void>;
  updateRenderedArtifactRequired: boolean;
  setUpdateRenderedArtifactRequired: (
    updateRenderedArtifactRequired: boolean,
  ) => void;
  artifactContent: string[];
  setArtifactContent: (index: number, content: string) => void;

  // autogen studio =========================================================================
  version: string | null;
  setVersion: (version: string | null) => void;
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
    // chatEndpoint: "/api/v1/chat/ws/socket.io",
    // use chat ----------------------------------------------------------------------------
    // appendChatMessageCb: (message) => {
    //   // set({ messages: [...get().messages, message] });
    //   console.log("append", message);
    // },
    setOpenDebugPanel: (openDebugPanel) => set({ openDebugPanel }),
    // currentView: "",
    // setCurrentView: (view) => set({ currentView: view }),
    // workbenchConfig: undefined,
    // setWorkbenchConfig: (config) => set({ workbenchConfig: config }),
    workbenchViewProps: {},
    setWorkbenchViewProps: (props) => set({ workbenchViewProps: props }),
    // assisantConfig: undefined,
    // setAssisantConfig: (config) => set({ assisantConfig: config }),
    setSelectedModelId: (selectedModelId) => set({ selectedModelId }),
    setInput: (input) => set({ input }),
    messages: [],
    // elementState: [],
    // setElementState: (elementState) => {
    //   set({ elementState });
    // },
    // actionState: [],
    // setActionState: (actionState) => {
    //   set({ actionState });
    // },
    firstUserInteraction: undefined,
    setFirstUserInteraction: (firstUserInteraction) =>
      set({ firstUserInteraction }),
    // uiState: {},
    // setUistate: (uiState) => {
    //   set({ uiState });
    // },
    // setInput: (input: string) => {
    //   set({ input });
    // },
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

    handleHumanInput: debounce(async ({ content, resource, resourceId }) => {
      const preMessages = get().messages;
      const newChatMessage = {
        role: "user",
        content: content,
        metadata: {
          id: generateUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      } as ChatMessage;
      set({ messages: [...preMessages, newChatMessage] });
      submitMessages(set, get);
    }, 100),
    setMessages: (messages) => set({ messages }),
    setShowWorkbench: (openWorkbench) => {
      set({ openWorkbench });
    },
    // setOpenChat: (openChat) => {
    //   set({ uiState: { ...get().uiState, openChat: openChat } });
    // },
    // setStarted: (started) => set({ started }),
    // setAborted: (aborted) => set({ aborted }),
    setThreadId: (threadId) => {
      const prevThreadId = get().threadId;
      console.log("setThreadId", threadId, prevThreadId);

      if (prevThreadId !== threadId && threadId) {
        console.log("new chat session:", prevThreadId, threadId);
        set({ threadId });
        // if (!window.location.pathname.includes(`#/chat/${threadId}`)) {
        //   window.history.replaceState(null, "", `#/chat/${threadId}`);
        // }
        console.log("nav", `/chat/${threadId}`);
        // get().nav({
        //   to: `/chat/${threadId}`,
        // });
      }
    },
    // setIsOpenWorkbenchChat: (isOpenWorkbenchChat: boolean) => {
    //   set({ isOpenWorkbenchChat });
    // },
    // openView: (viewName, viewProps, targetView) => {
    //   console.log("openListView", viewName, viewProps, targetView);
    //   const target = targetView || "workbench";
    //   if (target === "asider") {
    //     console.log("todo openListView asider");
    //   } else if (targetView === "workbench") {
    //     set({
    //       uiState: {
    //         ...get().uiState,
    //         openWorkbench: true,
    //         // currentWorkbenchView: viewName,
    //       },
    //       // currentWorkbenchView: viewName,
    //       workbenchViewProps: viewProps,
    //     });
    //   } else if (targetView === "cmdk") {
    //     console.log("todo openListView cmdk");
    //   }
    // },
    // setCurrentWorkbenchView: (viewName: string) => {
    //   set({
    //     uiState: {
    //       ...get().uiState,
    //       // currentWorkbenchView: viewName,
    //     },
    //   });
    // },
    // openWorkbench: (viewName, viewProps) => {
    //   console.log("openWorkbench", viewName, viewProps);
    //   set({
    //     uiState: {
    //       ...get().uiState,
    //       openWorkbench: true,
    //       // currentWorkbenchView: viewName,
    //     },
    //     workbenchViewProps: viewProps,
    //   });
    // },

    // connect: async () => {
    //   // 拉取消息
    //   console.log("拉取消息 connect");
    //   const response = await fetch(
    //     `${get().backendUrl}/api/v1/chat/completions`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${get().accessToken}`,
    //       },
    //       body: JSON.stringify({
    //         messages: [],
    //         chatProfile: get().chatProfile,
    //         isChat: true,
    //         params: get().params,
    //         isPull: true,
    //       }),
    //     },
    //   );
    //   if (response.ok) {
    //   }
    // },
    // setIsConnected: (isConnected) => set({ isConnected }),
    // setSocket: (socket) => set({ socket }),
    // connectWs: () => connectWs(null, set, get),
    // onNewMessage: (message) => {
    //   const preMessages = get().messages;
    //   const newMessages = addMessage(preMessages, message);
    //   set({ messages: newMessages });
    // },
    // onUpdateMessage: (message) => {
    //   const preMessages = get().messages;
    //   const newMessages = updateMessageById(preMessages, message.id, message);
    //   set({ messages: newMessages });
    // },
    // onDeleteMessage: (msg) => {
    //   const newMessages = deleteMessageById(get().messages, msg.id);
    //   set({ messages: newMessages });
    // },

    // setAskUserState: (askUserState) => set({ askUserState }),
    setChatProfile: (chatProfile) => set({ chatProfile }),
    setResource: (resource) => set({ resource }),
    setResourceId: (resourceId) => set({ resourceId }),
    //-----------------------------------------------------------------------------------------------------===============================
    setChatStarted: (chatStarted: boolean) => {
      set({ chatStarted });
    },
    setOpenWorkBench: (openWorkBench: boolean) => {
      set({ openWorkBench });
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
    setTeamId: (teamId: string) => {
      set({ teamId });
    },
    setArtifact: (artifact: ArtifactV3) => {
      set({ artifact });
    },

    setSelectedBlocks: (selectedBlocks: TextHighlight) => {
      set({ selectedBlocks });
    },
    setIsArtifactSaved: (isArtifactSaved: boolean) => {
      set({ isArtifactSaved });
    },
    setSelectedArtifact: (index: number) => {
      set({ selectedArtifact: index });
    },
    addMessage: (message: ChatMessage) => {
      const prevMessages = get().messages;
      set({ messages: [...prevMessages, message] });
    },
    // submitHumanInput: async (content: string) => {
    //   const prevMessages = get().messages;
    //   set({
    //     messages: [
    //       ...prevMessages,
    //       {
    //         metadata: {
    //           id: generateUUID(),
    //           createdAt: new Date().toISOString(),
    //           updatedAt: new Date().toISOString(),
    //         },
    //         role: "user",
    //         content,
    //       },
    //     ],
    //   });

    //   await handleSseGraphStream(set, get);
    // },
    // setUpdateRenderedArtifactRequired: (
    //   updateRenderedArtifactRequired: boolean,
    // ) => {
    //   set({ updateRenderedArtifactRequired });
    // },
    // setArtifactContent: (index: number, content: string) => {
    //   //TODO: 不正确,以后修改
    //   set({ artifactContent: [...get().artifactContent, content] });
    // },

    // autogen studio =========================================================================
    version: null,
    setVersion: (version) => set({ version }),
    connectionId: uuidv4(),
    header: {
      title: "",
      breadcrumbs: [],
    },
    // setHeader: (newHeader) =>
    //   set((state) => ({
    //     header: { ...state.header, ...newHeader },
    //   })),
    // Add AgentFlow settings
    agentFlow: DEFAULT_AGENT_FLOW_SETTINGS,
    // setAgentFlowSettings: (newSettings) =>
    //   set((state) => ({
    //     agentFlow: { ...state.agentFlow, ...newSettings },
    //   })),
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
