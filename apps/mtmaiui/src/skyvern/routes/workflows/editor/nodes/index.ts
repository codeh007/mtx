import { memo } from "react";
import { CodeBlockNode as CodeBlockNodeComponent } from "./CodeBlockNode/CodeBlockNode";
import type { CodeBlockNode } from "./CodeBlockNode/types";
import { DownloadNode as DownloadNodeComponent } from "./DownloadNode/DownloadNode";
import type { DownloadNode } from "./DownloadNode/types";
import { FileParserNode as FileParserNodeComponent } from "./FileParserNode/FileParserNode";
import type { FileParserNode } from "./FileParserNode/types";
import { LoopNode as LoopNodeComponent } from "./LoopNode/LoopNode";
import type { LoopNode } from "./LoopNode/types";
import { NodeAdderNode as NodeAdderNodeComponent } from "./NodeAdderNode/NodeAdderNode";
import type { NodeAdderNode } from "./NodeAdderNode/types";
import { SendEmailNode as SendEmailNodeComponent } from "./SendEmailNode/SendEmailNode";
import type { SendEmailNode } from "./SendEmailNode/types";
import { StartNode as StartNodeComponent } from "./StartNode/StartNode";
import type { StartNode } from "./StartNode/types";
import { TaskNodeNode as TaskNodeComponent } from "./TaskNode/TaskNode";
import type { TaskNode } from "./TaskNode/types";
import { TextPromptNode as TextPromptNodeComponent } from "./TextPromptNode/TextPromptNode";
import type { TextPromptNode } from "./TextPromptNode/types";
import { UploadNode as UploadNodeComponent } from "./UploadNode/UploadNode";
import type { UploadNode } from "./UploadNode/types";

export type UtilityNode = StartNode | NodeAdderNode;

export type WorkflowBlockNode =
  | LoopNode
  | TaskNode
  | TextPromptNode
  | SendEmailNode
  | CodeBlockNode
  | FileParserNode
  | UploadNode
  | DownloadNode;

export function isUtilityNode(node: AppNode): node is UtilityNode {
  return node.type === "nodeAdder" || node.type === "start";
}

export function isWorkflowBlockNode(node: AppNode): node is WorkflowBlockNode {
  return node.type !== "nodeAdder" && node.type !== "start";
}

export type AppNode = UtilityNode | WorkflowBlockNode;

export const nodeTypes = {
  loop: memo(LoopNodeComponent),
  task: memo(TaskNodeComponent),
  textPrompt: memo(TextPromptNodeComponent),
  sendEmail: memo(SendEmailNodeComponent),
  codeBlock: memo(CodeBlockNodeComponent),
  fileParser: memo(FileParserNodeComponent),
  upload: memo(UploadNodeComponent),
  download: memo(DownloadNodeComponent),
  nodeAdder: memo(NodeAdderNodeComponent),
  start: memo(StartNodeComponent),
};
