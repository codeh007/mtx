"use client";

// import type { Client } from "@connectrpc/connect";
import { type UseMutationResult, useMutation, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import {
  type AdkEvent,
  AgentEventType,
  type ApiErrors,
  type ChatMessage,
  type ChatMessageList,
  type Content,
  FlowNames,
  type FlowTeamInput,
  type Options,
  type SocialTeam,
  type SocialTeamManagerState,
  type Tenant,
  type WorkflowRun,
  type WorkflowRunCreateData,
  adkEventsListOptions,
  workflowRunCreate,
  workflowRunCreateMutation,
} from "mtmaiapi";
import { generateUUID } from "mtxuilib/lib/utils";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useTransition } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenant, useTenantId } from "../hooks/useAuth";
import { useNav } from "../hooks/useNav";
import { exampleTeamConfig } from "./exampleTeamConfig";

export interface WorkbenchProps {
  sessionId?: string;
  // teamState?: SocialTeamManagerState;
  // resourceId?: string;
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
  handleHumanInput: (input: Content) => void;
  // handleNewChat: (input: StartNewChatInput) => void;
  handleRunTeam: (team: FlowTeamInput) => void;
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

  // userAgentState?: UserAgentState;
  // setUserAgentState: (userAgentState: UserAgentState) => void;
  lastestWorkflowRun?: WorkflowRun;
  setLastestWorkflowRun: (lastestWorkflowRun: WorkflowRun) => void;

  team: SocialTeam;
  setTeam: (team: SocialTeam) => void;
  // refetchTeamState: () => Promise<void>;

  // google adk
  adkEvents: AdkEvent[];
  setAdkEvents: (adkEvents: AdkEvent[]) => void;
  // refetchAdkEvents: () => void;
}

export const createWorkbrenchSlice: StateCreator<WorkbrenchState, [], [], WorkbrenchState> = (
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
    team: exampleTeamConfig,
    setTeam: (team) => {
      set({ team });
    },
    // google adk
    adkEvents: [],
    setAdkEvents: (adkEvents) => {
      set({ adkEvents });
    },
    submitInput: debounce(async (input: Content) => {
      get().handleHumanInput(input);
    }, 30),
    handleHumanInput: debounce(async (input: Content) => {
      console.log("handleHumanInput", input);
      get().setChatStarted(true);
      const preMessages = get().messages;
      const task = input.parts?.[0]?.text as unknown as string;

      const preEvents = get().adkEvents;
      const newEvents = [
        ...preEvents,
        {
          type: "UserMessage",
          content: task,
          source: "web",
          metadata: {},
        },
      ];
      set({ adkEvents: newEvents });

      set({ input: "" });

      const sessionId = get().sessionId ?? generateUUID();
      const newChatMessage = {
        content: task,
        metadata: {
          id: generateUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        content_type: "text",
        type: "UserMessage",
        topic: "default",
        source: "web",
        thread_id: sessionId,
      } satisfies ChatMessage;
      set({
        messages: [...preMessages, newChatMessage],
      });
      const response = await workflowRunCreate({
        path: {
          workflow: FlowNames.TEAM,
        },
        body: {
          input: {
            app_name: "root",
            component: get().team,
            session_id: sessionId,
            // init_state: {},
            task: {
              type: AgentEventType.TEXT_MESSAGE,
              content: task,
              source: "user",
              metadata: {},
            },
            content: input,
          } satisfies FlowTeamInput,
          additionalMetadata: {
            sessionId: sessionId,
          },
        },
      });
      console.log("handleHumanInput", get().messages, response?.data);
      if (response?.data) {
        get().setLastestWorkflowRun(response?.data);
      }
      if (response?.data) {
        // pull stream event
        if (response.data?.metadata?.id) {
          const workflowRunId = response.data.metadata?.id;
          set({ workflowRunId: workflowRunId });
          // const result = await get().dispatcherClient.subscribeToWorkflowEvents({
          //   workflowRunId: workflowRunId,
          // });
          // for await (const event of result) {
          //   handleWorkflowRunEvent(event, get, set);
          // }
        }
      }
    }, 30),

    setMessages: (messages) => set({ messages }),
    setShowWorkbench: (openWorkbench) => {
      set({ openWorkbench });
    },
    setThreadId: (threadId) => {
      set({ sessionId: threadId });
    },
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
    // setResourceId: (resourceId: string) => {
    //   set({ resourceId });
    // },
    agentFlow: DEFAULT_AGENT_FLOW_SETTINGS,
    // setTeamState: (teamState) => {
    //   set({ teamState });
    // },
    // refetchTeamState: async () => {
    //   set({ teamState: undefined });
    // },
    // setUserAgentState: (userAgentState) => {
    //   set({ userAgentState });
    // },
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
const mtmaiStoreContext = createContext<ReturnType<typeof createWordbrenchStore> | null>(null);

export const WorkbrenchProvider = (props: React.PropsWithChildren<WorkbenchProps>) => {
  const { children, ...etc } = props;
  const nav = useNav();
  // const eventClient = useGomtmClient(EventsService);
  // const dispatcherClient = useGomtmClient(Dispatcher);
  // const agrpcClient = useGomtmClient(AgentRpc);
  // const mtmAgClient = useGomtmClient(AgService);
  // const selfBackendend = useMtmaiV2((x) => x.selfBackendUrl);
  const [isPending, startTransition] = useTransition();
  // const search = useSearch();
  const tenant = useTenant();
  const workflowRunCreate = useMutation({
    ...workflowRunCreateMutation(),
  });

  const tid = useTenantId();
  const mystore = useMemo(
    () =>
      createWordbrenchStore({
        ...etc,
        tenant: tenant,
        // backendUrl: selfBackendend,
        // eventClient: eventClient,
        // dispatcherClient: dispatcherClient,
        // runtimeClient: agrpcClient,
        // agClient: mtmAgClient,
        workflowRunCreateMut: workflowRunCreate,
      }),
    [
      tenant,
      // selfBackendend,
      // eventClient,
      // dispatcherClient,
      // agrpcClient,
      // mtmAgClient,
      workflowRunCreate,
    ],
  );

  // const agStateListQuery = useQuery({
  //   ...agStateListOptions({
  //     path: {
  //       tenant: tid!,
  //     },
  //     query: {
  //       session: etc.sessionId,
  //     },
  //   }),
  //   enabled: !!etc.sessionId,
  // });

  // useEffect(() => {
  //   if (agStateListQuery.data) {
  //     console.log("加载了:agStateListQuery.data", etc.sessionId, agStateListQuery.data);
  //     //TODO: 如何正确识别 UserAgentState?
  //     for (const state of agStateListQuery.data?.rows ?? []) {
  //       if (state.topic === "user") {
  //         mystore.setState({ userAgentState: state.state as UserAgentState });
  //       }
  //     }
  //   }
  // }, [agStateListQuery.data, mystore, etc.sessionId]);

  // useEffect(() => {
  //   return mystore.subscribe(
  //     (state) => {
  //       return state.lastestWorkflowRun;
  //     },
  //     async (cur, prev) => {
  //       console.log("lastestWorkflowRun changed", cur, "prev", prev);
  //       if (cur?.additionalMetadata?.sessionId) {
  //         startTransition(() => {
  //           nav({
  //             to: `/adk/session/${cur?.additionalMetadata?.sessionId}`,
  //             search: search,
  //           });
  //         });
  //         const sessionId = cur?.additionalMetadata?.sessionId;
  //         const messageList = await chatMessagesList({
  //           path: {
  //             tenant: tid!,
  //             chat: sessionId as string,
  //           },
  //         });
  //         mystore.getState().loadChatMessageList(messageList.data);
  //         console.log("messageList", messageList);
  //       }
  //     },
  //   );
  // }, [mystore, nav, search, tid]);

  // useEffect(() => {
  //   return mystore.subscribe(
  //     (state) => {
  //       return state.sessionId;
  //     },
  //     debounce((cur, prev) => {
  //       console.log("threadId changed", cur, "prev", prev);
  //       if (cur) {
  //         startTransition(() => {
  //           nav({
  //             to: `/session/${cur}`,
  //             search: search,
  //           });
  //         });
  //       }
  //     }, 100),
  //   );
  // }, [mystore, nav, search]);

  const adkEventsQuery = useQuery({
    ...adkEventsListOptions({
      path: {
        tenant: tid,
      },
      query: {
        session: etc.sessionId,
      },
    }),
    enabled: !!etc.sessionId,
  });
  useEffect(() => {
    if (adkEventsQuery.data) {
      mystore.setState({ adkEvents: adkEventsQuery.data.rows });
    }
  }, [adkEventsQuery.data, mystore]);

  return <mtmaiStoreContext.Provider value={mystore}>{children}</mtmaiStoreContext.Provider>;
};

const DEFAULT_USE_SHALLOW = false;
export function useWorkbenchStore(): WorkbrenchState;
export function useWorkbenchStore<T>(selector: (state: WorkbrenchState) => T): T;
export function useWorkbenchStore<T>(selector?: (state: WorkbrenchState) => T) {
  const store = useContext(mtmaiStoreContext);
  if (!store) throw new Error("useWorkbenchStore must in WorkbrenchProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(store, DEFAULT_USE_SHALLOW ? useShallow(selector) : selector);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
