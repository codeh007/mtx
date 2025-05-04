"use client";

import { useMutation } from "@tanstack/react-query";
import type { Message } from "ai";
import { debounce } from "lodash";
import {
  type AdkEvent,
  type ChatMessage,
  type ChatMessageList,
  type Content,
  type SocialTeamManagerState,
  type Tenant,
  type WorkflowRun,
  workflowRunCreateMutation,
} from "mtmaiapi";
import type React from "react";
import { createContext, useContext, useMemo, useTransition } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import type { ChatAgentState } from "../../agent_state/chat_agent_state";
import { useTenant } from "../../hooks/useAuth";

const DEFAULT_AGENT_URL = "https://mtmag.yuepa8.com";
export interface WorkbenchProps {
  sessionId?: string;
}
export interface AgentStoreState extends WorkbenchProps {
  agentUrl: string;
  setAgentUrl: (agentUrl: string) => void;
  agentPathPrefix: string;
  setAgentPathPrefix: (agentPathPrefix: string) => void;
  accessToken?: string;
  setAccessToken: (accessToken: string) => void;
  params?: Record<string, any>;
  tenant: Tenant;
  setSessionId: (threadId?: string) => void;
  messageParser?: (messages: Message[]) => void;
  setMessageParser: (messageParser: (messages: Message[]) => void) => void;
  openChat?: boolean;
  setOpenChat: (openChat: boolean) => void;
  setCurrentWorkbenchView: (id: string) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  firstUserInteraction?: string;
  setFirstUserInteraction: (firstUserInteraction: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  input?: string;
  setInput: (input: string) => void;
  handleHumanInput: (input: Content) => void;
  workflowRunId?: string;
  setWorkflowRunId: (workflowRunId: string) => void;
  chatStarted: boolean;
  setChatStarted: (chatStarted: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  isDebug: boolean;
  setIsDebug: (isDebug: boolean) => void;
  openWorkbench?: boolean;
  setOpenWorkbench: (openWorkbench: boolean) => void;
  isOpenWorkbenchChat: boolean;
  setIsOpenWorkbenchChat: (isOpenWorkbenchChat: boolean) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  setResourceId: (resourceId: string) => void;
  setTeamState: (teamState: SocialTeamManagerState) => void;
  loadChatMessageList: (response?: ChatMessageList) => void;
  lastestWorkflowRun?: WorkflowRun;
  setLastestWorkflowRun: (lastestWorkflowRun: WorkflowRun) => void;

  adkEvents: AdkEvent[];
  setAdkEvents: (adkEvents: AdkEvent[]) => void;

  agentState?: ChatAgentState;
  setAgentState: (agentState: ChatAgentState) => void;
}

export const createAgentStoreSlice: StateCreator<AgentStoreState, [], [], AgentStoreState> = (
  set,
  get,
  init,
) => {
  return {
    userAgentState: {},
    setInput: (input) => set({ input }),
    messages: [],
    firstUserInteraction: undefined,
    setFirstUserInteraction: (firstUserInteraction) => set({ firstUserInteraction }),
    setAccessToken: (accessToken: string) => {
      set({ accessToken });
    },
    setParams: (params: Record<string, any>) => {
      set({ params });
    },
    agentPathPrefix: "api",
    setAgentPathPrefix: (agentPathPrefix: string) => {
      set({ agentPathPrefix });
    },
    setMessageParser: (messageParser: (messages: Message[]) => void) => {
      set({ messageParser });
    },
    openChat: false,
    setOpenChat: (openChat: boolean) => {
      set({ openChat });
    },
    isDebug: false,
    setIsDebug: (isDebug: boolean) => {
      set({ isDebug });
    },
    agentState: undefined,
    setAgentState: (agentState) => {
      set({ agentState });
    },
    agentUrl: DEFAULT_AGENT_URL,
    setAgentUrl: (agentUrl) => {
      set({ agentUrl });
    },
    handleHumanInput: debounce(async (input: Content) => {}, 30),

    setMessages: (messages) => set({ messages }),
    setShowWorkbench: (openWorkbench) => {
      set({ openWorkbench });
    },
    setSessionId: async (sessionId) => {},
    setWorkflowRunId: (workflowRunId) => {
      set({ workflowRunId });
    },
    chatStarted: false,
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
    setLastestWorkflowRun: (lastestWorkflowRun) => {
      console.log("setLastestWorkflowRun", lastestWorkflowRun);
      set({ lastestWorkflowRun });
    },
    loadChatMessageList: (chatMessageList) => {
      const messages = chatMessageList?.rows?.map((row) => {
        return {
          ...row,
          role: row.type,
          content: JSON.parse(row.content),
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

const createAgentStore = (initProps?: Partial<AgentStoreState>) => {
  return createStore<AgentStoreState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createAgentStoreSlice(...a),
          ...initProps,
        })),
        {
          name: "workbench-store",
        },
      ),
    ),
  );
};
const agentStoreContext = createContext<ReturnType<typeof createAgentStore> | null>(null);

export const ChatAgentProvider = (props: React.PropsWithChildren<WorkbenchProps>) => {
  const { children, ...etc } = props;
  const [isPending, startTransition] = useTransition();
  const tenant = useTenant();
  const workflowRunCreate = useMutation({
    ...workflowRunCreateMutation(),
  });

  const mystore = useMemo(
    () =>
      createAgentStore({
        ...etc,
        tenant: tenant,
        workflowRunCreateMut: workflowRunCreate,
      }),
    [tenant, workflowRunCreate],
  );

  return <agentStoreContext.Provider value={mystore}>{children}</agentStoreContext.Provider>;
};

const DEFAULT_USE_SHALLOW = false;
export function useChatAgentStore(): AgentStoreState;
export function useChatAgentStore<T>(selector: (state: AgentStoreState) => T): T;
export function useChatAgentStore<T>(selector?: (state: AgentStoreState) => T) {
  const store = useContext(agentStoreContext);
  if (!store) throw new Error("useChatAgentStore must in AgentProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(store, DEFAULT_USE_SHALLOW ? useShallow(selector) : selector);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
