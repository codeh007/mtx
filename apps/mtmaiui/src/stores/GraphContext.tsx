"use client";
import { generateId } from "ai";
import type {
  AgentNodeRunInput,
  ArtifactV3,
  ChatMessage,
  Tenant,
  TextHighlight,
} from "mtmaiapi";
import type { Assistant, Session } from "mtmaiapi/gomtmapi";
import { createContext, useContext, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { type StateCreator, createStore, useStore } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { handleSseGraphStream } from "./runGraphStream";

// New interfaces
export interface IAgentFlowSettings {
  direction: "TB" | "LR";
  showLabels: boolean;
  showGrid: boolean;
  showTokens: boolean;
  showMessages: boolean;
  showMiniMap?: boolean;
}

// Default settings
const DEFAULT_AGENT_FLOW_SETTINGS: IAgentFlowSettings = {
  direction: "TB",
  showLabels: true,
  showGrid: true,
  showTokens: true,
  showMessages: true,
  showMiniMap: false,
};

export interface IUser {
  name: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  metadata?;
}

export interface AppContextType {
  user: IUser | null;
  setUser;
  logout;
  cookie_name: string;
  darkMode: string;
  setDarkMode;
}

export interface AgentNodeProps {
  agentEndpointBase: string;
  tenant: Tenant;
}
export interface AgentNodeState extends AgentNodeProps {
  chatStarted?: boolean;
  setChatStarted: (chatStarted: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  openWorkBench?: boolean;
  setOpenWorkBench: (openWorkBench: boolean) => void;
  // agent 运行器名称
  runner?: string;
  setRunner: (runner: string) => void;
  teamId: string;
  setTeamId: (teamId: string) => void;
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  firstTokenReceived: boolean;
  setFirstTokenReceived: (firstTokenReceived: boolean) => void;

  addMessage: (message: ChatMessage) => void;
  submitHumanInput: (content: string) => void;

  selectedAssistant?: Assistant;
  setSelectedAssistant: (selectedAssistant?: Assistant) => void;

  feedbackSubmitted: boolean;
  setFeedbackSubmitted: (feedbackSubmitted: boolean) => void;

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
  streamMessage: (params: AgentNodeRunInput) => Promise<void>;
  updateRenderedArtifactRequired: boolean;
  setUpdateRenderedArtifactRequired: (
    updateRenderedArtifactRequired: boolean,
  ) => void;
  artifactContent: string[];
  setArtifactContent: (index: number, content: string) => void;

  // autogen studio =========================================================================
  session: Session | null;
  setSession: (session: Session | null) => void;
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  version: string | null;
  setVersion: (version: string | null) => void;

  // Header state
  // header: IHeaderState;
  // setHeader: (header: Partial<IHeaderState>) => void;
  // setBreadcrumbs: (breadcrumbs: IBreadcrumb[]) => void;

  // Sidebar state
  // sidebar: ISidebarState;
  // setSidebarState: (state: Partial<ISidebarState>) => void;
  // collapseSidebar: () => void;
  // expandSidebar: () => void;
  // toggleSidebar: () => void;

  // Agent flow settings agentFlow: IAgentFlowSettings;
  agentFlow: IAgentFlowSettings;
  setAgentFlowSettings: (settings: Partial<IAgentFlowSettings>) => void;
}

export const createGraphSlice: StateCreator<
  AgentNodeState,
  [],
  [],
  AgentNodeState
> = (set, get, init) => {
  return {
    nodeState: undefined,
    messages: [],
    setMessages: (messages) => {
      set({ messages });
    },
    setChatStarted: (chatStarted: boolean) => {
      set({ chatStarted });
    },
    setOpenWorkBench: (openWorkBench: boolean) => {
      set({ openWorkBench });
    },
    setFeedbackSubmitted: (feedbackSubmitted: boolean) => {
      set({ feedbackSubmitted });
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
    setSelectedAssistant: (selectedAssistant) => {
      set({ selectedAssistant });
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
    streamMessage: (params) => {
      return handleSseGraphStream({ ...params }, set, get);
    },
    addMessage: (message: ChatMessage) => {
      const prevMessages = get().messages;
      set({ messages: [...prevMessages, message] });
    },
    submitHumanInput: async (content: string) => {
      const prevMessages = get().messages;
      set({
        messages: [
          ...prevMessages,
          {
            metadata: {
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            role: "user",
            content,
          },
        ],
      });

      await handleSseGraphStream({}, set, get);
    },
    setUpdateRenderedArtifactRequired: (
      updateRenderedArtifactRequired: boolean,
    ) => {
      set({ updateRenderedArtifactRequired });
    },
    setArtifactContent: (index: number, content: string) => {
      //TODO: 不正确,以后修改
      set({ artifactContent: [...get().artifactContent, content] });
    },

    // autogen studio =========================================================================
    // session: null,
    // setSession: (session) => set({ session }),
    // sessions: [],
    // setSessions: (sessions) => set({ sessions }),
    version: null,
    setVersion: (version) => set({ version }),
    connectionId: uuidv4(),

    // Header state
    header: {
      title: "",
      breadcrumbs: [],
    },
    setHeader: (newHeader) =>
      set((state) => ({
        header: { ...state.header, ...newHeader },
      })),
    // setBreadcrumbs: (breadcrumbs) =>
    //   set((state) => ({
    //     header: { ...state.header, breadcrumbs },
    //   })),
    // Add AgentFlow settings
    agentFlow: DEFAULT_AGENT_FLOW_SETTINGS,
    setAgentFlowSettings: (newSettings) =>
      set((state) => ({
        agentFlow: { ...state.agentFlow, ...newSettings },
      })),

    // Sidebar state and actions
    sidebar: {
      isExpanded: true,
      isPinned: false,
    },
    setSidebarState: (newState) =>
      set((state) => ({
        sidebar: { ...state.sidebar, ...newState },
      })),
    // collapseSidebar: () =>
    // 	set((state) => ({
    // 		sidebar: { ...state.sidebar, isExpanded: false },
    // 	})),
    // expandSidebar: () =>
    // 	set((state) => ({
    // 		sidebar: { ...state.sidebar, isExpanded: true },
    // 	})),
    // toggleSidebar: () =>
    // 	set((state) => ({
    // 		sidebar: { ...state.sidebar, isExpanded: !state.sidebar.isExpanded },
    // 	})),
    ...init,
  };
};

type mtappStore = ReturnType<typeof createWordbrenchStore>;
type GraphV2StoreState = AgentNodeState;

const createWordbrenchStore = (initProps?: Partial<GraphV2StoreState>) => {
  return createStore<GraphV2StoreState>()(
    subscribeWithSelector(
      persist(
        devtools(
          immer((...a) => ({
            ...createGraphSlice(...a),
            ...initProps,
          })),
          {
            name: "graph-store",
          },
        ),
        {
          name: "graph-sidebar-state",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            sidebar: state.sidebar,
            agentFlow: state.agentFlow,
          }),
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<mtappStore | null>(null);

type AppProviderProps = React.PropsWithChildren<AgentNodeProps>;
export const GraphProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  const mystore = useMemo(() => createWordbrenchStore(etc), [etc]);
  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useGraphStore(): GraphV2StoreState;
export function useGraphStore<T>(selector: (state: GraphV2StoreState) => T): T;
export function useGraphStore<T>(selector?: (state: GraphV2StoreState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useGraphStore must in GraphProvider");
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
