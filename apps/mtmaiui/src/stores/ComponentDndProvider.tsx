"use client";

import { useRouterState } from "@tanstack/react-router";
import { useEdgesState, useNodesState } from "@xyflow/react";
import type React from "react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useTransition,
} from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenantId } from "../hooks/useAuth";
import { useNav } from "../hooks/useNav";
import { useTeamBuilderStore } from "./teamBuildStore";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  CustomEdge,
  CustomNode,
  DragItem,
} from "../routes/components/views/team/builder/types";
import type { ComponentTypes } from "../types/datamodel";
import type { DragItemData } from "./teamBuildStore";

export interface ComponentsProps {
  queryParams?: Record<string, any>;
}

export interface ComponentDndState extends ComponentsProps {
  isPending: boolean;
}

export const createComponentDndSlice: StateCreator<
  ComponentDndState,
  [],
  [],
  ComponentDndState
> = (set, get, init) => {
  return {
    isPending: false,
    setQueryParams: (queryParams: Record<string, any>) => {
      set({ queryParams });
    },
    ...init,
  };
};

type componentDndStore = ReturnType<typeof createComponentsStore>;
const createComponentsStore = (initProps?: Partial<ComponentDndState>) => {
  return createStore<ComponentDndState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createComponentDndSlice(...a),
          ...initProps,
        })),
        {
          name: "component-dnd-store",
        },
      ),
    ),
  );
};
const componentsStoreContext = createContext<componentDndStore | null>(null);

export const ComponentDndProvider = (
  props: React.PropsWithChildren<ComponentsProps>,
) => {
  const { children, ...etc } = props;
  const tid = useTenantId();
  const nav = useNav();
  const [isPending, startTransition] = useTransition();
  const matches = useRouterState({ select: (s) => s.matches });
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const [testDrawerVisible, setTestDrawerVisible] = useState(false);
  const {
    undo,
    redo,
    loadFromJson,
    syncToJson,
    addNode,
    layoutNodes,
    resetHistory,
    history,
    updateNode,
  } = useTeamBuilderStore();

  const [activeDragItem, setActiveDragItem] = useState<DragItemData | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const onDragStart = (item: DragItem) => {
    // We can add any drag start logic here if needed
  };
  const handleDragStart = (event: DragStartEvent) => {
    console.log("handleDragStart", event);
    const { active } = event;
    if (active.data.current) {
      setActiveDragItem(active.data.current as DragItemData);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active.data?.current?.current) return;

    const draggedItem = active.data.current.current;
    const dropZoneId = over.id as string;

    const [nodeId] = dropZoneId.split("@@@");
    // Find target node
    const targetNode = nodes.find((node) => node.id === nodeId);
    if (!targetNode) return;

    // Validate drop
    const isValid = validateDropTarget(
      draggedItem.type,
      targetNode.data.component.component_type,
    );
    if (!isValid) return;

    const position = {
      x: event.delta.x,
      y: event.delta.y,
    };

    // Pass both new node data AND target node id
    addNode(position, draggedItem.config, nodeId);
    setActiveDragItem(null);
  };

  const handleTestDrawerClose = () => {
    // console.log("TestDrawer closed");
    setTestDrawerVisible(false);
  };
  const validateDropTarget = (
    draggedType: ComponentTypes,
    targetType: ComponentTypes,
  ): boolean => {
    const validTargets: Record<ComponentTypes, ComponentTypes[]> = {
      model: ["team", "agent"],
      tool: ["agent"],
      agent: ["team"],
      team: [],
      termination: ["team"],
    };
    return validTargets[draggedType]?.includes(targetType) || false;
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over?.id || !active.data.current) return;

    const draggedType = active.data.current.type;
    const targetNode = nodes.find((node) => node.id === over.id);
    if (!targetNode) return;

    const isValid = validateDropTarget(
      draggedType,
      targetNode.data.component.component_type,
    );
    // Add visual feedback class to target node
    if (isValid) {
      targetNode.className = "drop-target-valid";
    } else {
      targetNode.className = "drop-target-invalid";
    }
  };
  const mystore = useMemo(
    () =>
      createComponentsStore({
        ...etc,
        components: [],
        isPending,
      }),
    [etc, isPending],
  );
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      <componentsStoreContext.Provider value={mystore}>
        {children}
      </componentsStoreContext.Provider>
    </DndContext>
  );
};

const DEFAULT_USE_SHALLOW = false;
export function useComponentDndStore(): ComponentDndState;
export function useComponentDndStore<T>(
  selector: (state: ComponentDndState) => T,
): T;
export function useComponentDndStore<T>(
  selector?: (state: ComponentDndState) => T,
) {
  const store = useContext(componentsStoreContext);
  if (!store)
    throw new Error("useComponentDndStore must in ComponentDndProvider");
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
