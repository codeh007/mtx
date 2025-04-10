"use client";

import type { Client } from "@connectrpc/connect";
import {
  type UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { debounce } from "lodash";
import {
  type AgState,
  AgentEventType,
  type Agents,
  type ApiErrors,
  type AssistantAgent,
  type AssistantAgentConfig,
  type ChatMessage,
  type ChatMessageList,
  FlowNames,
  type FlowTeamInput,
  type InstagramAgent,
  type InstagramAgentConfig,
  ModelFamily,
  type MtAgEvent,
  type OpenAiChatCompletionClient,
  type Options,
  ProviderTypes,
  type SocialTeam,
  type SocialTeamConfig,
  type StartNewChatInput,
  type Tenant,
  type Terminations,
  type TextMessage,
  type UserAgentState,
  type UserProxyAgent,
  type UserProxyAgentConfig,
  type WorkflowRun,
  type WorkflowRunCreateData,
  agStateListOptions,
  chatMessagesList,
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
import { useTenant, useTenantId } from "../hooks/useAuth";
import { useNav, useSearch } from "../hooks/useNav";
import { MtmaiuiConfig } from "../lib/core/config";
import { useMtmaiV2 } from "./StoreProvider";
import { useGomtmClient } from "./TransportProvider";
import { handleWorkflowRunEvent } from "./ag-event-handlers";

export interface WorkbenchProps {
  // componentId?: string;
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
  // started: boolean;
  // setStarted: (started: boolean) => void;
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
  handleHumanInput: (input: MtAgEvent) => void;
  handleNewChat: (input: StartNewChatInput) => void;
  handleRunTeam: (team: FlowTeamInput) => void;
  workflowRunId?: string;
  setWorkflowRunId: (workflowRunId: string) => void;
  chatStarted: boolean;
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

  userAgentState?: UserAgentState;
  setUserAgentState: (userAgentState: UserAgentState) => void;
  lastestWorkflowRun?: WorkflowRun;
  setLastestWorkflowRun: (lastestWorkflowRun: WorkflowRun) => void;

  team: SocialTeam;
  setTeam: (team: SocialTeam) => void;
}

export const createWorkbrenchSlice: StateCreator<
  WorkbrenchState,
  [],
  [],
  WorkbrenchState
> = (set, get, init) => {
  return {
    userAgentState: {},
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
    team: {
      provider: ProviderTypes.SOCIAL_TEAM,
      component_type: "team",
      label: "social team",
      description: "social team",
      config: {
        proxy_url: "http://localhost:10809",
        max_turns: 25,
        participants: [
          {
            provider: ProviderTypes.INSTAGRAM_AGENT,
            label: "instagram",
            component_type: "agent",
            description: "instagram agent",
            config: {
              name: "instagram_agent",
              description: "instagram agent",
              tools: [],
              reflect_on_tool_use: false,
              tool_call_summary_format: "{result}",
              system_message: "你是instagram agent",
              credentials: {
                username: "saibichquyenll2015",
                password: "qSJPn07c7",
                otp_key: "MCF3M4XZHTFWKYXUGV4CQX3LFXMKMWFP",
              },
              proxy_url: "http://localhost:10809",
              model_client: {
                provider: ProviderTypes.OPEN_AI_CHAT_COMPLETION_CLIENT,
                config: {
                  model: MtmaiuiConfig.default_open_model,
                  api_key: MtmaiuiConfig.default_open_ai_key,
                  base_url: MtmaiuiConfig.default_open_base_url,
                  model_info: {
                    vision: false,
                    function_calling: true,
                    json_output: true,
                    structured_output: true,
                    family: ModelFamily.UNKNOWN,
                  },
                },
              } satisfies OpenAiChatCompletionClient,
            } satisfies InstagramAgentConfig,
          } satisfies InstagramAgent,
          {
            provider: ProviderTypes.ASSISTANT_AGENT,
            label: "assistant",
            component_type: "agent",
            description: "assistant agent",
            config: {
              name: "useful_assistant",
              description: "有用的助手",
              tools: [],
              reflect_on_tool_use: false,
              tool_call_summary_format: "{result}",
              model_client: {
                provider: ProviderTypes.OPEN_AI_CHAT_COMPLETION_CLIENT,
                config: {
                  model: MtmaiuiConfig.default_open_model,
                  api_key: MtmaiuiConfig.default_open_ai_key,
                  base_url: MtmaiuiConfig.default_open_base_url,
                  model_info: {
                    vision: false,
                    function_calling: true,
                    json_output: true,
                    structured_output: true,
                    family: ModelFamily.UNKNOWN,
                  },
                },
              } satisfies OpenAiChatCompletionClient,
            } satisfies AssistantAgentConfig,
          } satisfies AssistantAgent,
          {
            provider: ProviderTypes.ASSISTANT_AGENT,
            label: "assistant",
            component_type: "agent",
            description: "assistant agent",
            config: {
              name: "joke_writer_assistant",
              description: "擅长冷笑话创作的助手",
              tools: [],
              reflect_on_tool_use: false,
              tool_call_summary_format: "{result}",
              system_message: "你是擅长冷笑话创作的助手",
              model_client: {
                provider: ProviderTypes.OPEN_AI_CHAT_COMPLETION_CLIENT,
                config: {
                  model: MtmaiuiConfig.default_open_model,
                  api_key: MtmaiuiConfig.default_open_ai_key,
                  base_url: MtmaiuiConfig.default_open_base_url,
                  model_info: {
                    vision: false,
                    function_calling: true,
                    json_output: true,
                    structured_output: true,
                    family: ModelFamily.UNKNOWN,
                  },
                },
              } satisfies OpenAiChatCompletionClient,
            } satisfies AssistantAgentConfig,
          } satisfies AssistantAgent,
          {
            provider: ProviderTypes.USER_PROXY_AGENT,
            label: "user_proxy",
            component_type: "agent",
            description: "user proxy agent",
            config: {
              name: "user_proxy_agent",
              description: "user proxy agent",
            } satisfies UserProxyAgentConfig,
          } satisfies UserProxyAgent,
        ] satisfies Agents[],
        termination_condition: {
          provider: ProviderTypes.TEXT_MENTION_TERMINATION,
          config: {
            text: "TERMINATE",
          },
        } satisfies Terminations,
      } satisfies SocialTeamConfig,
    } satisfies SocialTeam,
    setTeam: (team) => {
      set({ team });
    },

    handleHumanInput: debounce(async (input: MtAgEvent) => {
      get().setChatStarted(true);
      const preMessages = get().messages;
      const task = input.content as unknown as string;

      const sessionId = get().threadId ?? generateUUID();
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
            component: get().team,
            session_id: sessionId,
            task: {
              type: AgentEventType.TEXT_MESSAGE,
              content: task,
              source: "user",
            } satisfies TextMessage,
            init_state: {},
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
    }, 30),

    setMessages: (messages) => set({ messages }),
    setShowWorkbench: (openWorkbench) => {
      set({ openWorkbench });
    },
    setThreadId: (threadId) => {
      set({ threadId });
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
    setResourceId: (resourceId: string) => {
      set({ resourceId });
    },
    agentFlow: DEFAULT_AGENT_FLOW_SETTINGS,
    setTeamState: (teamState) => {
      set({ teamState });
    },
    setUserAgentState: (userAgentState) => {
      set({ userAgentState });
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

// type AppProviderProps = ;
export const WorkbrenchProvider = (
  props: React.PropsWithChildren<WorkbenchProps>,
) => {
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

  const tid = useTenantId();
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
      workflowRunCreate,
    ],
  );

  const agStateListQuery = useQuery({
    ...agStateListOptions({
      path: {
        tenant: tid!,
      },
      query: {
        session: etc.threadId,
      },
    }),
    enabled: !!etc.threadId,
  });

  useEffect(() => {
    if (agStateListQuery.data) {
      console.log(
        "加载了:agStateListQuery.data",
        etc.threadId,
        agStateListQuery.data,
      );
      //TODO: 如何正确识别 UserAgentState?
      for (const state of agStateListQuery.data?.rows ?? []) {
        if (state.topic === "user") {
          mystore.setState({ userAgentState: state.state as UserAgentState });
        }
      }
    }
  }, [agStateListQuery.data, mystore, etc.threadId]);

  useEffect(() => {
    return mystore.subscribe(
      (state) => {
        return state.lastestWorkflowRun;
      },
      async (cur, prev) => {
        console.log("lastestWorkflowRun changed", cur, "prev", prev);
        if (cur?.additionalMetadata?.sessionId) {
          startTransition(() => {
            nav({
              to: `/session/${cur?.additionalMetadata?.sessionId}`,
              search: search,
            });
          });
          const sessionId = cur?.additionalMetadata?.sessionId;
          const messageList = await chatMessagesList({
            path: {
              tenant: tid!,
              chat: sessionId as string,
            },
          });
          mystore.getState().loadChatMessageList(messageList.data);
          console.log("messageList", messageList);
        }
      },
    );
  }, [mystore, nav, search, tid]);

  useEffect(() => {
    return mystore.subscribe(
      (state) => {
        return state.threadId;
      },
      debounce((cur, prev) => {
        console.log("threadId changed", cur, "prev", prev);
        if (cur) {
          startTransition(() => {
            nav({
              to: `/session/${cur}`,
              search: search,
            });
          });
        }
      }, 100),
    );
  }, [mystore, nav, search]);

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
