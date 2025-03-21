import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { stringify as convertToYAML } from "yaml";
import { DeleteNodeCallbackContext } from "../../../store/DeleteNodeCallbackContext";
import { useWorkflowHasChangesStore } from "../../../store/WorkflowHasChangesStore";
import { useWorkflowPanelStore } from "../../../store/WorkflowPanelStore";
import type {
  AWSSecretParameter,
  BitwardenSensitiveInformationParameter,
  WorkflowApiResponse,
  WorkflowParameterValueType,
} from "../types/workflowTypes";
import type {
  BitwardenLoginCredentialParameterYAML,
  BlockYAML,
  ContextParameterYAML,
  ParameterYAML,
  WorkflowCreateYAMLRequest,
  WorkflowParameterYAML,
} from "../types/workflowYamlTypes";
import { WorkflowHeader } from "./WorkflowHeader";
import { WorkflowParametersStateContext } from "./WorkflowParametersStateContext";
import { type AppNode, type WorkflowBlockNode, nodeTypes } from "./nodes";
import { type LoopNode, isLoopNode } from "./nodes/LoopNode/types";
import { isTaskNode } from "./nodes/TaskNode/types";
import { WorkflowNodeLibraryPanel } from "./panels/WorkflowNodeLibraryPanel";
import { WorkflowParametersPanel } from "./panels/WorkflowParametersPanel";
import "./reactFlowOverrideStyles.css";
// import { updateWorkflowMutation } from "mtmaiapi/@tanstack/react-query.gen";
import { useTheme } from "next-themes";
import { edgeTypes } from "./edges/EdgeWithAddButton";
import {
  convertEchoParameters,
  createNode,
  defaultEdge,
  generateNodeLabel,
  getAdditionalParametersForEmailBlock,
  getOutputParameterKey,
  getWorkflowBlocks,
  layout,
  nodeAdderNode,
  startNode,
} from "./workflowEditorUtils";
import { toast } from "mtxuilib/ui/use-toast";

function convertToParametersYAML(
  parameters: ParametersState,
): Array<
  | WorkflowParameterYAML
  | BitwardenLoginCredentialParameterYAML
  | ContextParameterYAML
> {
  return parameters.map((parameter) => {
    if (parameter.parameterType === "workflow") {
      return {
        parameter_type: "workflow",
        key: parameter.key,
        description: parameter.description || null,
        workflow_parameter_type: parameter.dataType,
        ...(parameter.defaultValue === null
          ? {}
          : { default_value: parameter.defaultValue }),
      };
    }
    if (parameter.parameterType === "context") {
      return {
        parameter_type: "context",
        key: parameter.key,
        description: parameter.description || null,
        source_parameter_key: parameter.sourceParameterKey,
      };
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return {
        parameter_type: "bitwarden_login_credential",
        key: parameter.key,
        description: parameter.description || null,
        bitwarden_collection_id: parameter.collectionId,
        url_parameter_key: parameter.urlParameterKey,
        bitwarden_client_id_aws_secret_key: "SKYVERN_BITWARDEN_CLIENT_ID",
        bitwarden_client_secret_aws_secret_key:
          "SKYVERN_BITWARDEN_CLIENT_SECRET",
        bitwarden_master_password_aws_secret_key:
          "SKYVERN_BITWARDEN_MASTER_PASSWORD",
      };
    }
  });
}

export type ParametersState = Array<
  | {
      key: string;
      parameterType: "workflow";
      dataType: WorkflowParameterValueType;
      description?: string | null;
      defaultValue: unknown;
    }
  | {
      key: string;
      parameterType: "credential";
      collectionId: string;
      urlParameterKey: string;
      description?: string | null;
    }
  | {
      key: string;
      parameterType: "context";
      sourceParameterKey: string;
      description?: string | null;
    }
>;

type Props = {
  initialTitle: string;
  initialNodes: Array<AppNode>;
  initialEdges: Array<Edge>;
  initialParameters: ParametersState;
  workflow: WorkflowApiResponse;
  workflowPermanentId: string;
};

export type AddNodeProps = {
  nodeType: NonNullable<WorkflowBlockNode["type"]>;
  previous: string | null;
  next: string | null;
  parent?: string;
  connectingEdgeType: string;
};

export function FlowRenderer({
  initialTitle,
  initialEdges,
  initialNodes,
  initialParameters,
  workflow,
  workflowPermanentId,
}: Props) {
  const queryClient = useQueryClient();
  const { workflowPanelState, setWorkflowPanelState, closeWorkflowPanel } =
    useWorkflowPanelStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [parameters, setParameters] = useState(initialParameters);
  const [title, setTitle] = useState(initialTitle);
  const nodesInitialized = useNodesInitialized();
  const { hasChanges, setHasChanges } = useWorkflowHasChangesStore();
  // const blocker = useLeaveConfirm((hasChanges) => {
  //   return hasChanges && nextLocation.pathname !== currentLocation.pathname;
  // });
  useLeaveConfirm(hasChanges);

  const updateWorkflow = useMutation({
    // ...updateWorkflowMutation(),
  });

  const saveWorkflowMutation = useMutation({
    mutationFn: async (data: {
      parameters: Array<ParameterYAML>;
      blocks: Array<BlockYAML>;
      title: string;
    }) => {
      if (!workflowPermanentId) {
        return;
      }
      const requestBody: WorkflowCreateYAMLRequest = {
        title: data.title,
        description: workflow.description,
        proxy_location: workflow.proxy_location,
        webhook_callback_url: workflow.webhook_callback_url,
        totp_verification_url: workflow.totp_verification_url,
        workflow_definition: {
          parameters: data.parameters,
          blocks: data.blocks,
        },
        is_saved_task: workflow.is_saved_task,
      };
      const yaml = convertToYAML(requestBody);
      // return client.put<string, WorkflowApiResponse>(
      //   `/workflows/${workflowPermanentId}`,
      //   yaml,
      //   {
      //     headers: {
      //       "Content-Type": "text/plain",
      //     },
      //   },
      // );
      const result = await updateWorkflow.mutateAsync({
        body: {
          yaml: yaml,
        },
        path: {
          workflow_permanent_id: workflowPermanentId,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Changes saved",
        description: "Your changes have been saved",
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["workflow", workflowPermanentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
      setHasChanges(false);
    },
    onError: (error) => {
      // const detail = (error.response?.data as { detail?: string }).detail;
      toast({
        title: "Error",
        // description: detail ? detail : error.message,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function doLayout(nodes: Array<AppNode>, edges: Array<Edge>) {
    const layoutedElements = layout(nodes, edges);
    setNodes(layoutedElements.nodes);
    setEdges(layoutedElements.edges);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (nodesInitialized) {
      doLayout(nodes, edges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesInitialized]);

  async function handleSave() {
    const blocks = getWorkflowBlocks(nodes);
    const parametersInYAMLConvertibleJSON = convertToParametersYAML(parameters);
    const filteredParameters = workflow.workflow_definition.parameters.filter(
      (parameter) => {
        return (
          parameter.parameter_type === "aws_secret" ||
          parameter.parameter_type === "bitwarden_sensitive_information"
        );
      },
    ) as Array<AWSSecretParameter | BitwardenSensitiveInformationParameter>;

    const echoParameters = convertEchoParameters(filteredParameters);

    const overallParameters = [
      ...parameters,
      ...echoParameters,
    ] as Array<ParameterYAML>;

    // if there is an email node, we need to add the email aws secret parameters
    const emailAwsSecretParameters = getAdditionalParametersForEmailBlock(
      blocks,
      overallParameters,
    );

    return saveWorkflowMutation.mutateAsync({
      parameters: [
        ...echoParameters,
        ...parametersInYAMLConvertibleJSON,
        ...emailAwsSecretParameters,
      ],
      blocks,
      title,
    });
  }

  const theme = useTheme();

  function addNode({
    nodeType,
    previous,
    next,
    parent,
    connectingEdgeType,
  }: AddNodeProps) {
    const newNodes: Array<AppNode> = [];
    const newEdges: Array<Edge> = [];
    const id = nanoid();
    const node = createNode(
      { id, parentId: parent },
      nodeType,
      generateNodeLabel(nodes.map((node) => node.data.label)),
    );
    newNodes.push(node);
    if (previous) {
      const newEdge = {
        id: `edge-${previous}-${id}`,
        type: "edgeWithAddButton",
        source: previous,
        target: id,
        style: {
          strokeWidth: 2,
        },
      };
      newEdges.push(newEdge);
    }
    if (next) {
      const newEdge = {
        id: `edge-${id}-${next}`,
        type: connectingEdgeType,
        source: id,
        target: next,
        style: {
          strokeWidth: 2,
        },
      };
      newEdges.push(newEdge);
    }

    if (nodeType === "loop") {
      // when loop node is first created it needs an adder node so nodes can be added inside the loop
      const startNodeId = nanoid();
      const adderNodeId = nanoid();
      newNodes.push(startNode(startNodeId, id));
      newNodes.push(nodeAdderNode(adderNodeId, id));
      newEdges.push(defaultEdge(startNodeId, adderNodeId));
    }

    const editedEdges = previous
      ? edges.filter((edge) => edge.source !== previous)
      : edges;

    const previousNode = nodes.find((node) => node.id === previous);
    const previousNodeIndex = previousNode
      ? nodes.indexOf(previousNode)
      : nodes.length - 1;

    // creating some memory for no reason, maybe check it out later
    const newNodesAfter = [
      ...nodes.slice(0, previousNodeIndex + 1),
      ...newNodes,
      ...nodes.slice(previousNodeIndex + 1),
    ];

    setHasChanges(true);
    doLayout(newNodesAfter, [...editedEdges, ...newEdges]);
  }

  function deleteNode(id: string) {
    const node = nodes.find((node) => node.id === id);
    if (!node) {
      return;
    }
    const deletedNodeLabel = node.data.label;
    const newNodes = nodes.filter((node) => node.id !== id);
    const newEdges = edges.flatMap((edge) => {
      if (edge.source === id) {
        return [];
      }
      if (edge.target === id) {
        const nextEdge = edges.find((edge) => edge.source === id);
        if (nextEdge) {
          // connect the old incoming edge to the next node if both of them exist
          // also take the type of the old edge for plus button edge vs default
          return [
            {
              ...edge,
              type: nextEdge.type,
              target: nextEdge.target,
            },
          ];
        }
        return [edge];
      }
      return [edge];
    });

    if (newNodes.every((node) => node.type === "nodeAdder")) {
      // No user created nodes left, so return to the empty state.
      doLayout([], []);
      return;
    }

    // if any node was using the output parameter of the deleted node, remove it from their parameter keys
    const newNodesWithUpdatedParameters = newNodes.map((node) => {
      if (node.type === "task") {
        return {
          ...node,
          data: {
            ...node.data,
            parameterKeys: node.data.parameterKeys.filter(
              (parameter) =>
                parameter !== getOutputParameterKey(deletedNodeLabel),
            ),
          },
        };
      }
      if (node.type === "loop") {
        return {
          ...node,
          data: {
            ...node.data,
            loopValue:
              node.data.loopValue === getOutputParameterKey(deletedNodeLabel)
                ? ""
                : node.data.loopValue,
          },
        };
      }
      return node;
    });
    setHasChanges(true);
    doLayout(newNodesWithUpdatedParameters, newEdges);
  }

  function getWorkflowErrors(): Array<string> {
    const errors: Array<string> = [];

    // check loop node parameters
    const loopNodes: Array<LoopNode> = nodes.filter(isLoopNode);
    const emptyLoopNodes = loopNodes.filter(
      (node: LoopNode) => node.data.loopValue === "",
    );
    if (emptyLoopNodes.length > 0) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      emptyLoopNodes.forEach((node) => {
        errors.push(
          `${node.data.label}: Loop value parameter must be selected`,
        );
      });
    }

    // check task node json fields
    const taskNodes = nodes.filter(isTaskNode);
    // biome-ignore lint/complexity/noForEach: <explanation>
    taskNodes.forEach((node) => {
      try {
        JSON.parse(node.data.dataSchema);
      } catch {
        errors.push(`${node.data.label}: Data schema is not valid JSON`);
      }
      try {
        JSON.parse(node.data.errorCodeMapping);
      } catch {
        errors.push(`${node.data.label}: Error messages is not valid JSON`);
      }
    });

    return errors;
  }

  return (
    <>
      {/* // 离开页面 未保存提示框 */}
      {/* <Dialog
        open={blocker.state === "blocked"}
        onOpenChange={(open) => {
          if (!open) {
            blocker.reset?.();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              Your workflow has unsaved changes. Do you want to save them before
              leaving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                blocker.proceed?.();
              }}
            >
              Continue without saving
            </Button>
            <Button
              onClick={() => {
                handleSave().then(() => {
                  blocker.proceed?.();
                });
              }}
              disabled={saveWorkflowMutation.isPending}
            >
              {saveWorkflowMutation.isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <WorkflowParametersStateContext.Provider
        value={[parameters, setParameters]}
      >
        <DeleteNodeCallbackContext.Provider value={deleteNode}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              const dimensionChanges = changes.filter(
                (change) => change.type === "dimensions",
              );
              const tempNodes = [...nodes];
              // biome-ignore lint/complexity/noForEach: <explanation>
              dimensionChanges.forEach((change) => {
                const node = tempNodes.find((node) => node.id === change.id);
                if (node) {
                  if (node.measured?.width) {
                    node.measured.width = change.dimensions?.width;
                  }
                  if (node.measured?.height) {
                    node.measured.height = change.dimensions?.height;
                  }
                }
              });
              if (dimensionChanges.length > 0) {
                doLayout(tempNodes, edges);
              }
              if (
                changes.some((change) => {
                  return (
                    change.type === "add" ||
                    change.type === "remove" ||
                    change.type === "replace"
                  );
                })
              ) {
                setHasChanges(true);
              }
              onNodesChange(changes);
            }}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            colorMode="dark"
            fitView
            fitViewOptions={{
              maxZoom: 1,
            }}
            className="bg-red-200 p-0"
          >
            <Background
              variant={BackgroundVariant.Dots}
              bgColor={theme.theme === "dark" ? "#051016" : "#eeeeee"}
            />
            <Controls position="bottom-left" />
            <Panel
              position="top-center"
              className="h-20 m-0 p-0 backdrop-blur-sm bg-white/10"
            >
              <WorkflowHeader
                title={title}
                workflowPermanentId={workflow.workflow_permanent_id}
                onTitleChange={(newTitle) => {
                  setTitle(newTitle);
                  setHasChanges(true);
                }}
                parametersPanelOpen={
                  workflowPanelState.active &&
                  workflowPanelState.content === "parameters"
                }
                onParametersClick={() => {
                  if (
                    workflowPanelState.active &&
                    workflowPanelState.content === "parameters"
                  ) {
                    closeWorkflowPanel();
                  } else {
                    setWorkflowPanelState({
                      active: true,
                      content: "parameters",
                    });
                  }
                }}
                onSave={async () => {
                  const errors = getWorkflowErrors();
                  if (errors.length > 0) {
                    toast({
                      title: "Can not save workflow because of errors:",
                      description: (
                        <div className="space-y-2">
                          {errors.map((error) => (
                            <p key={error}>{error}</p>
                          ))}
                        </div>
                      ),
                      variant: "destructive",
                    });
                    return;
                  }
                  await handleSave();
                }}
              />
            </Panel>
            {workflowPanelState.active && (
              <Panel position="top-right">
                {workflowPanelState.content === "parameters" && (
                  <WorkflowParametersPanel />
                )}
                {workflowPanelState.content === "nodeLibrary" && (
                  <WorkflowNodeLibraryPanel
                    onNodeClick={(props) => {
                      addNode(props);
                    }}
                  />
                )}
              </Panel>
            )}
          </ReactFlow>
        </DeleteNodeCallbackContext.Provider>
      </WorkflowParametersStateContext.Provider>
    </>
  );
}
