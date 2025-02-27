"use client";
import { CursorTextIcon } from "@radix-ui/react-icons";
import { Handle, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { AutoResizingTextarea } from "mtxuilib/components/AutoResizingTextarea";
import { Checkbox } from "mtxuilib/ui/checkbox";
import { Label } from "mtxuilib/ui/label";
import { Separator } from "mtxuilib/ui/separator";
import { useState } from "react";
import { HelpTooltip } from "../../../../../components/HelpTooltip";
import { CodeEditor } from "../../../components/CodeEditor";
import { useDeleteNodeCallback } from "../../../hooks/useDeleteNodeCallback";
import { useNodeLabelChangeHandler } from "../../../hooks/useLabelChangeHandler";
import { NodeActionMenu } from "../NodeActionMenu";
import { EditableNodeTitle } from "../components/EditableNodeTitle";
import { type TextPromptNode, helpTooltipContent } from "./types";

export function TextPromptNode({ id, data }: NodeProps<TextPromptNode>) {
  const { updateNodeData } = useReactFlow();
  const { editable } = data;
  const deleteNodeCallback = useDeleteNodeCallback();
  const [inputs, setInputs] = useState({
    prompt: data.prompt,
    jsonSchema: data.jsonSchema,
  });

  const [label, setLabel] = useNodeLabelChangeHandler({
    id,
    initialValue: data.label,
  });

  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="opacity-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        className="opacity-0"
      />
      <div className="w-[30rem] space-y-4 rounded-lg bg-slate-elevation3 px-6 py-4">
        <div className="flex h-[2.75rem] justify-between">
          <div className="flex gap-2">
            <div className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded border border-slate-600">
              <CursorTextIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <EditableNodeTitle
                value={label}
                editable={data.editable}
                onChange={setLabel}
                titleClassName="text-base"
                inputClassName="text-base"
              />
              <span className="text-xs text-slate-400">Text Prompt Block</span>
            </div>
          </div>
          <NodeActionMenu
            onDelete={() => {
              deleteNodeCallback(id);
            }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Label className="text-xs text-slate-300">Prompt</Label>
            <HelpTooltip content={helpTooltipContent["prompt"]} />
          </div>
          <AutoResizingTextarea
            onChange={(event) => {
              if (!editable) {
                return;
              }
              setInputs({ ...inputs, prompt: event.target.value });
              updateNodeData(id, { prompt: event.target.value });
            }}
            value={inputs.prompt}
            placeholder="What do you want to generate?"
            className="nopan text-xs"
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex gap-2">
            <Label className="text-xs text-slate-300">Data Schema</Label>
            <Checkbox
              checked={inputs.jsonSchema !== "null"}
              onCheckedChange={(checked) => {
                if (!editable) {
                  return;
                }
                setInputs({
                  ...inputs,
                  jsonSchema: checked ? "{}" : "null",
                });
                updateNodeData(id, {
                  jsonSchema: checked ? "{}" : "null",
                });
              }}
            />
          </div>
          {inputs.jsonSchema !== "null" && (
            <div>
              <CodeEditor
                language="json"
                value={inputs.jsonSchema}
                onChange={(value) => {
                  if (!editable) {
                    return;
                  }
                  setInputs({ ...inputs, jsonSchema: value });
                  updateNodeData(id, { jsonSchema: value });
                }}
                className="nowheel nopan"
                fontSize={8}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
