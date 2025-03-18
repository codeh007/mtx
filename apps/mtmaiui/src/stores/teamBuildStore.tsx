"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEdgesState, useNodesState } from "@xyflow/react";
import { isEqual } from "lodash";
import { comsGetOptions } from "mtmaiapi";
import { nanoid } from "nanoid";
import { createContext, useContext, useMemo } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenantId } from "../hooks/useAuth";
import type {
  CustomEdge,
  CustomNode,
  GraphState,
  NodeData,
  Position,
} from "../routes/components/views/team/builder/types";
import {
  convertTeamConfigToGraph,
  getLayoutedElements,
  getUniqueName,
} from "../routes/components/views/team/builder/utils";
import type {
  AgentConfig,
  Component,
  ComponentConfig,
  ComponentTypes,
  Team,
  TeamConfig,
} from "../routes/components/views/types/datamodel";
import {
  isAgentComponent,
  isAssistantAgent,
  isModelComponent,
  isSelectorTeam,
  isTeamComponent,
  isTerminationComponent,
  isToolComponent,
  isWebSurferAgent,
} from "../routes/components/views/types/guards";

const MAX_HISTORY = 50;
export interface DragItemData {
  type: ComponentTypes;
  config: any;
  label: string;
  icon: React.ReactNode;
}
export interface TeamBuilderProps {
  componentId: string;
}
export interface TeamBuilderState extends TeamBuilderProps {
  team?: Team;
  isJsonMode: boolean;
  setIsJsonMode: (isJsonMode: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
  teamValidated: boolean;
  setTeamValidated: (teamValidated: boolean) => void;
  validationResults: any;
  setValidationResults: (validationResults: any) => void;
  nodes: CustomNode[];
  setNodes: (nodes: CustomNode[]) => void;
  edges: CustomEdge[];
  setEdges: (edges: CustomEdge[]) => void;
  selectedNodeId: string | null;
  history: Array<{ nodes: CustomNode[]; edges: CustomEdge[] }>;
  currentHistoryIndex: number;
  originalComponent: Component<TeamConfig> | null;

  // Simplified actions
  addNode: (
    position: Position,
    component: Component<ComponentConfig>,
    targetNodeId: string,
  ) => void;

  updateNode: (nodeId: string, updates: Partial<NodeData>) => void;
  removeNode: (nodeId: string) => void;

  addEdge: (edge: CustomEdge) => void;
  removeEdge: (edgeId: string) => void;

  setSelectedNode: (nodeId: string | null) => void;

  undo: () => void;
  redo: () => void;

  // Sync with JSON
  syncToJson: () => Component<TeamConfig> | null;
  loadFromJson: (
    config: Component<TeamConfig>,
    isInitialLoad?: boolean,
  ) => GraphState;
  layoutNodes: () => void;
  resetHistory: () => void;
  addToHistory: () => void;

  activeDragItem?: DragItemData | null;
  setActiveDragItem: (activeDragItem: DragItemData | null) => void;
  handleValidate: () => Promise<void>;
}

const buildTeamComponent = (
  teamNode: CustomNode,
  nodes: CustomNode[],
  edges: CustomEdge[],
): Component<TeamConfig> | null => {
  console.log("buildTeamComponent", teamNode);
  if (!isTeamComponent(teamNode.data.component)) return null;

  const component = { ...teamNode.data.component };

  // Get participants using edges
  const participantEdges = edges.filter(
    (e) => e.source === teamNode.id && e.type === "agent-connection",
  );
  component.config.participants = participantEdges
    .map((edge) => {
      const agentNode = nodes.find((n) => n.id === edge.target);
      if (!agentNode || !isAgentComponent(agentNode.data.component))
        return null;
      return agentNode.data.component;
    })
    .filter((agent): agent is Component<AgentConfig> => agent !== null);

  return component;
};

export const createWorkbrenchSlice: StateCreator<
  TeamBuilderState,
  [],
  [],
  TeamBuilderState
> = (set, get, init) => {
  return {
    nodes: [],
    setNodes: (nodes: CustomNode[]) => {
      set({ nodes });
    },
    edges: [],
    setEdges: (edges: CustomEdge[]) => {
      set({ edges });
    },
    selectedNodeId: null,
    history: [],
    currentHistoryIndex: -1,
    originalComponent: null,
    setIsJsonMode: (isJsonMode: boolean) => {
      set({ isJsonMode });
    },
    setIsFullscreen: (isFullscreen: boolean) => {
      set({ isFullscreen });
    },
    setIsDirty: (isDirty: boolean) => {
      set({ isDirty });
    },
    setTeamValidated: (teamValidated: boolean) => {
      set({ teamValidated });
    },
    setValidationResults: (validationResults: any[]) => {
      set({ validationResults });
    },
    addNode: (
      position: Position,
      component: Component<ComponentConfig>,
      targetNodeId: string,
    ) => {
      console.log("addNode", component, targetNodeId);
      set((state) => {
        // Deep clone the incoming component to avoid reference issues
        const clonedComponent = JSON.parse(JSON.stringify(component));
        let newNodes = [...state.nodes];
        const newEdges = [...state.edges];

        if (targetNodeId) {
          const targetNode = state.nodes.find((n) => n.id === targetNodeId);

          console.log("Target node", targetNode);
          if (!targetNode) return state;

          // Handle configuration updates based on component type
          if (isModelComponent(clonedComponent)) {
            if (
              isTeamComponent(targetNode.data.component) &&
              isSelectorTeam(targetNode.data.component)
            ) {
              targetNode.data.component.config.model_client = clonedComponent;
              return {
                nodes: newNodes,
                edges: newEdges,
                history: [
                  ...state.history.slice(0, state.currentHistoryIndex + 1),
                  { nodes: newNodes, edges: newEdges },
                ].slice(-MAX_HISTORY),
                currentHistoryIndex: state.currentHistoryIndex + 1,
              };
              // biome-ignore lint/style/noUselessElse: <explanation>
            } else if (
              isAgentComponent(targetNode.data.component) &&
              (isAssistantAgent(targetNode.data.component) ||
                isWebSurferAgent(targetNode.data.component))
            ) {
              targetNode.data.component.config.model_client = clonedComponent;
              return {
                nodes: newNodes,
                edges: newEdges,
                history: [
                  ...state.history.slice(0, state.currentHistoryIndex + 1),
                  { nodes: newNodes, edges: newEdges },
                ].slice(-MAX_HISTORY),
                currentHistoryIndex: state.currentHistoryIndex + 1,
              };
            }
          } else if (isToolComponent(clonedComponent)) {
            if (
              isAgentComponent(targetNode.data.component) &&
              isAssistantAgent(targetNode.data.component)
            ) {
              if (!targetNode.data.component.config.tools) {
                targetNode.data.component.config.tools = [];
              }
              const toolName = getUniqueName(
                clonedComponent.config.name,
                targetNode.data.component.config.tools.map(
                  (t) => t.config.name,
                ),
              );
              clonedComponent.config.name = toolName;
              targetNode.data.component.config.tools.push(clonedComponent);
              return {
                nodes: newNodes,
                edges: newEdges,
                history: [
                  ...state.history.slice(0, state.currentHistoryIndex + 1),
                  { nodes: newNodes, edges: newEdges },
                ].slice(-MAX_HISTORY),
                currentHistoryIndex: state.currentHistoryIndex + 1,
              };
            }
          } else if (isTerminationComponent(clonedComponent)) {
            console.log("Termination component added", clonedComponent);
            if (isTeamComponent(targetNode.data.component)) {
              newNodes = state.nodes.map((node) => {
                if (node.id === targetNodeId) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      component: {
                        ...node.data.component,
                        config: {
                          ...node.data.component.config,
                          termination_condition: clonedComponent,
                        },
                      },
                    },
                  };
                }
                return node;
              });

              return {
                nodes: newNodes,
                edges: newEdges,
                history: [
                  ...state.history.slice(0, state.currentHistoryIndex + 1),
                  { nodes: newNodes, edges: newEdges },
                ].slice(-MAX_HISTORY),
                currentHistoryIndex: state.currentHistoryIndex + 1,
              };
            }
          }
        }

        // Handle team and agent nodes
        if (isTeamComponent(clonedComponent)) {
          console.log("Team component added", clonedComponent);
          const newNode: CustomNode = {
            id: nanoid(),
            position,
            type: clonedComponent.component_type,
            data: {
              label: clonedComponent.label || "Team",
              component: clonedComponent,
              type: clonedComponent.component_type as NodeData["type"],
            },
          };
          newNodes.push(newNode);
        } else if (isAgentComponent(clonedComponent)) {
          console.log("Agent component added", clonedComponent);
          // Find the team node to connect to
          const teamNode = newNodes.find((n) =>
            isTeamComponent(n.data.component),
          );
          if (teamNode) {
            // Ensure unique agent name
            if (
              isAssistantAgent(clonedComponent) &&
              isTeamComponent(teamNode.data.component)
            ) {
              const existingAgents =
                teamNode.data.component.config.participants || [];
              const existingNames = existingAgents.map((p) => p.config.name);
              clonedComponent.config.name = getUniqueName(
                clonedComponent.config.name,
                existingNames,
              );
            }

            const newNode: CustomNode = {
              id: nanoid(),
              position,
              type: clonedComponent.component_type,
              data: {
                label: clonedComponent.label || clonedComponent.config.name,
                component: clonedComponent,
                type: clonedComponent.component_type as NodeData["type"],
              },
            };

            newNodes.push(newNode);

            // Add connection to team
            newEdges.push({
              id: nanoid(),
              source: teamNode.id,
              target: newNode.id,
              sourceHandle: `${teamNode.id}-agent-output-handle`,
              targetHandle: `${newNode.id}-agent-input-handle`,
              type: "agent-connection",
            });

            // Update team's participants
            if (isTeamComponent(teamNode.data.component)) {
              if (!teamNode.data.component.config.participants) {
                teamNode.data.component.config.participants = [];
              }
              teamNode.data.component.config.participants.push(
                newNode.data.component as Component<AgentConfig>,
              );
            }
          }
        }

        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(newNodes, newEdges);

        return {
          nodes: layoutedNodes,
          edges: layoutedEdges,
          history: [
            ...state.history.slice(0, state.currentHistoryIndex + 1),
            { nodes: layoutedNodes, edges: layoutedEdges },
          ].slice(-MAX_HISTORY),
          currentHistoryIndex: state.currentHistoryIndex + 1,
        };
      });
    },

    updateNode: (nodeId: string, updates: Partial<NodeData>) => {
      set((state) => {
        const newNodes = state.nodes.map((node) => {
          if (node.id !== nodeId) {
            // If this isn't the directly updated node, check if it needs related updates
            const isTeamWithUpdatedAgent =
              isTeamComponent(node.data.component) &&
              state.edges.some(
                (e) =>
                  e.type === "agent-connection" &&
                  e.target === nodeId &&
                  e.source === node.id,
              );

            if (
              isTeamWithUpdatedAgent &&
              isTeamComponent(node.data.component)
            ) {
              return {
                ...node,
                data: {
                  ...node.data,
                  component: {
                    ...node.data.component,
                    config: {
                      ...node.data.component.config,
                      participants: node.data.component.config.participants.map(
                        (participant) =>
                          participant ===
                          state.nodes.find((n) => n.id === nodeId)?.data
                            .component
                            ? updates.component
                            : participant,
                      ),
                    },
                  },
                },
              };
            }
            return node;
          }

          // This is the directly updated node
          const updatedComponent = updates.component || node.data.component;
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
              component: updatedComponent,
            },
          };
        });

        return {
          nodes: newNodes,
          history: [
            ...state.history.slice(0, state.currentHistoryIndex + 1),
            { nodes: newNodes, edges: state.edges },
          ].slice(-MAX_HISTORY),
          currentHistoryIndex: state.currentHistoryIndex + 1,
        };
      });
    },

    removeNode: (nodeId: string) => {
      set((state) => {
        const nodesToRemove = new Set<string>();
        const updatedNodes = new Map<string, CustomNode>();

        const collectNodesToRemove = (id: string) => {
          const node = state.nodes.find((n) => n.id === id);
          if (!node) return;

          nodesToRemove.add(id);

          // Find all edges connected to this node
          const connectedEdges = state.edges.filter(
            (edge) => edge.source === id || edge.target === id,
          );

          // Handle cascading deletes based on component type
          if (isTeamComponent(node.data.component)) {
            // Find and remove all connected agents
            // biome-ignore lint/complexity/noForEach: <explanation>
            connectedEdges
              .filter((e) => e.type === "agent-connection")
              .forEach((e) => collectNodesToRemove(e.target));
          } else if (isAgentComponent(node.data.component)) {
            // Update team's participants if agent is connected to a team
            const teamEdge = connectedEdges.find(
              (e) => e.type === "agent-connection",
            );
            if (teamEdge) {
              const teamNode = state.nodes.find(
                (n) => n.id === teamEdge.source,
              );
              if (teamNode && isTeamComponent(teamNode.data.component)) {
                const updatedTeamNode = {
                  ...teamNode,
                  data: {
                    ...teamNode.data,
                    component: {
                      ...teamNode.data.component,
                      config: {
                        ...teamNode.data.component.config,
                        participants:
                          teamNode.data.component.config.participants.filter(
                            (p) => !isEqual(p, node.data.component),
                          ),
                      },
                    },
                  },
                };
                updatedNodes.set(teamNode.id, updatedTeamNode);
              }
            }
          }
        };

        // Start the cascade deletion from the initial node
        collectNodesToRemove(nodeId);

        // Create new nodes array with both removals and updates
        const newNodes = state.nodes
          .filter((node) => !nodesToRemove.has(node.id))
          .map((node) => updatedNodes.get(node.id) || node);

        // Remove all affected edges
        const newEdges = state.edges.filter(
          (edge) =>
            !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target),
        );

        return {
          nodes: newNodes,
          edges: newEdges,
          history: [
            ...state.history.slice(0, state.currentHistoryIndex + 1),
            { nodes: newNodes, edges: newEdges },
          ].slice(-MAX_HISTORY),
          currentHistoryIndex: state.currentHistoryIndex + 1,
        };
      });
    },

    addEdge: (edge: CustomEdge) => {
      set((state) => ({
        edges: [...state.edges, edge],
        history: [
          ...state.history.slice(0, state.currentHistoryIndex + 1),
          { nodes: state.nodes, edges: [...state.edges, edge] },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      }));
    },

    removeEdge: (edgeId: string) => {
      set((state) => ({
        edges: state.edges.filter((edge) => edge.id !== edgeId),
        history: [
          ...state.history.slice(0, state.currentHistoryIndex + 1),
          {
            nodes: state.nodes,
            edges: state.edges.filter((edge) => edge.id !== edgeId),
          },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      }));
    },

    setSelectedNode: (nodeId) => {
      console.log("setSelectedNode", nodeId);
      set({ selectedNodeId: nodeId });
    },

    undo: () => {
      set((state) => {
        if (state.currentHistoryIndex <= 0) return state;

        const previousState = state.history[state.currentHistoryIndex - 1];
        return {
          ...state,
          nodes: previousState.nodes,
          edges: previousState.edges,
          currentHistoryIndex: state.currentHistoryIndex - 1,
        };
      });
    },

    redo: () => {
      set((state) => {
        if (state.currentHistoryIndex >= state.history.length - 1) return state;

        const nextState = state.history[state.currentHistoryIndex + 1];
        return {
          ...state,
          nodes: nextState.nodes,
          edges: nextState.edges,
          currentHistoryIndex: state.currentHistoryIndex + 1,
        };
      });
    },

    syncToJson: () => {
      const state = get();
      const teamNodes = state.nodes.filter(
        (node) =>
          node.data.component.component_type === "team" ||
          node.data.component?.componentType === "team",
      );
      if (teamNodes.length === 0) {
        console.log("syncToJson error", state.nodes);
        return null;
      }

      const teamNode = teamNodes[0];
      return buildTeamComponent(teamNode, state.nodes, state.edges);
    },

    layoutNodes: () => {
      const { nodes, edges } = get();
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges);

      set({
        nodes: layoutedNodes,
        edges: layoutedEdges,
        history: [
          ...get().history.slice(0, get().currentHistoryIndex + 1),
          { nodes: layoutedNodes, edges: layoutedEdges },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: get().currentHistoryIndex + 1,
      });
    },

    loadFromJson: (config: Component<TeamConfig>, isInitialLoad = true) => {
      // Get graph representation of team config
      const { nodes, edges } = convertTeamConfigToGraph(config);
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges);

      if (isInitialLoad) {
        // Initial load - reset history
        set({
          nodes: layoutedNodes,
          edges: layoutedEdges,
          originalComponent: config,
          history: [{ nodes: layoutedNodes, edges: layoutedEdges }],
          currentHistoryIndex: 0,
          selectedNodeId: null,
        });
      } else {
        // JSON edit - check if state actually changed
        const currentState = get();
        if (
          !isEqual(layoutedNodes, currentState.nodes) ||
          !isEqual(layoutedEdges, currentState.edges)
        ) {
          set((state) => ({
            nodes: layoutedNodes,
            edges: layoutedEdges,
            history: [
              ...state.history.slice(0, state.currentHistoryIndex + 1),
              { nodes: layoutedNodes, edges: layoutedEdges },
            ].slice(-MAX_HISTORY),
            currentHistoryIndex: state.currentHistoryIndex + 1,
          }));
        }
      }

      return { nodes: layoutedNodes, edges: layoutedEdges };
    },

    resetHistory: () => {
      set((state) => ({
        history: [{ nodes: state.nodes, edges: state.edges }],
        currentHistoryIndex: 0,
      }));
    },

    addToHistory: () => {
      set((state) => ({
        history: [
          ...state.history.slice(0, state.currentHistoryIndex + 1),
          { nodes: state.nodes, edges: state.edges },
        ].slice(-MAX_HISTORY),
        currentHistoryIndex: state.currentHistoryIndex + 1,
      }));
    },

    setActiveDragItem: (activeDragItem: DragItemData | null) => {
      set({ activeDragItem });
    },
    handleValidate: async () => {
      console.log("handleValidate");
      const component = get().syncToJson();
      if (!component) {
        throw new Error("Unable to generate valid configuration");
      }

      try {
        //   setValidationLoading(true);
        //   const validationResult = await validationAPI.validateComponent(component);
        //   setValidationResults(validationResult);
        //   // if (validationResult.is_valid) {
        //   //   messageApi.success("Validation successful");
        //   // }
        // } catch (error) {
        //   console.error("Validation error:", error);
        //   messageApi.error("Validation failed");
      } finally {
        // setValidationLoading(false);
      }
    },
    ...init,
  };
};

type teamBuilderStore = ReturnType<typeof createWordbrenchStore>;
export type WorkbrenchStoreState = TeamBuilderState;

const createWordbrenchStore = (initProps?: Partial<TeamBuilderState>) => {
  return createStore<TeamBuilderState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          ...initProps,
        })),
        {
          name: "teambuilder-store",
        },
      ),
    ),
  );
};
const mtmaiStoreContext = createContext<teamBuilderStore | null>(null);

type AppProviderProps = React.PropsWithChildren<TeamBuilderProps>;
export const TeamBuilderProvider = (props: AppProviderProps) => {
  const { children, ...etc } = props;
  const tid = useTenantId();
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const componentsQuery = useSuspenseQuery({
    ...comsGetOptions({
      path: {
        tenant: tid,
      },
      query: {
        com: props.componentId,
      },
    }),
  });
  const mystore = useMemo(() => {
    const team = componentsQuery.data as unknown as Team;
    const store = createWordbrenchStore({
      ...etc,
      team: team,
    });
    return store;
  }, [componentsQuery.data]);

  return (
    <mtmaiStoreContext.Provider value={mystore}>
      {children}
    </mtmaiStoreContext.Provider>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useTeamBuilderStore(): TeamBuilderState;
export function useTeamBuilderStore<T>(
  selector: (state: TeamBuilderState) => T,
): T;
export function useTeamBuilderStore<T>(
  selector?: (state: TeamBuilderState) => T,
) {
  const store = useContext(mtmaiStoreContext);
  if (!store)
    throw new Error("useTeamBuilderStore must in TeamBuilderProvider");
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
