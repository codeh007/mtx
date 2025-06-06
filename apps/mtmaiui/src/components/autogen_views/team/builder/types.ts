// builder/types.ts
import type { Edge, Node } from "@xyflow/react";
import type { Component } from "mtmaiapi";
import { ComponentConfig } from "../../../../types/datamodel";
// import type { ComponentConfig } from "../../types/datamodel";

export interface NodeData extends Record<string, unknown> {
  // component: Component<ComponentConfig>;
  component: Component;
}

export interface EditingState {
  component: Component<ComponentConfig>;
  path: string[];
  changes?: Partial<Component<ComponentConfig>>;
}

// Define our node type that extends the XYFlow Node type
export type CustomNode = Node<NodeData>;
// export type CustomEdge = Edge;

export type EdgeTypes =
  | "model-connection"
  | "tool-connection"
  | "agent-connection"
  | "team-connection"
  | "termination-connection";

export interface CustomEdge extends Edge {
  type: EdgeTypes;
}

export interface Position {
  x: number;
  y: number;
}
export interface GraphState {
  nodes: CustomNode[];
  edges: CustomEdge[];
}

export interface FormFieldMapping {
  fieldName: string;
  type: "input" | "textarea" | "select" | "number" | "switch";
  label: string;
  required?: boolean;
  options?: { label: string; value: any }[];
  validate?: (value: any) => boolean;
}

export interface DragItem {
  config: ComponentConfig;
}

export interface NodeComponentProps {
  data: NodeData;
  selected: boolean;
  onClick: () => void;
}

export interface NodeEditorProps {
  node: CustomNode | null;
  onUpdate: (updates: Partial<NodeData>) => void;
  onClose: () => void;
}

export interface LibraryProps {
  onDragStart: (item: DragItem) => void;
}

export interface VisualizerProps {
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onNodeClick: (nodeId: string) => void;
  onConnect: (params: any) => void;
}
