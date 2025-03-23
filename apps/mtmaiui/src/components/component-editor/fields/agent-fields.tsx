import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Edit, HelpCircle, PlusCircle, Trash2 } from "lucide-react";
import type { MtComponent } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { Button } from "mtxuilib/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { Switch } from "mtxuilib/ui/switch";
import { Textarea } from "mtxuilib/ui/textarea";
import { Tooltip } from "mtxuilib/ui/tooltip";
import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type {
  Component,
  FunctionToolConfig,
} from "../../../routes/components/views/types/datamodel";
import {
  isAssistantAgent,
  isUserProxyAgent,
  isWebSurferAgent,
} from "../../../routes/components/views/types/guards";
import { DetailGroup } from "../../detailgroup";

interface AgentFieldsProps {
  component: MtComponent;
  onChange: (updates: Partial<MtComponent>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
  workingCopy?: MtComponent | null;
  setWorkingCopy?: (component: MtComponent | null) => void;
  editPath?: any[];
  updateComponentAtPath?: any;
  getCurrentComponent?: any;
}

const InputWithTooltip = ({
  label,
  tooltip,
  required,
  children,
}: {
  label: string;
  tooltip: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block" htmlFor={label}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-sm font-medium text-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="w-4 h-4 text-secondary" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
    {children}
  </label>
);

export const AgentFields = ({
  component,
  onChange,
  onNavigate,
  workingCopy,
  setWorkingCopy,
  editPath,
  updateComponentAtPath,
  getCurrentComponent,
}: AgentFieldsProps) => {
  if (!component) return null;

  const handleComponentUpdate = useCallback(
    (updates: Partial<MtComponent>) => {
      onChange({
        ...component,
        ...updates,
        config: {
          ...component.config,
          ...(updates.config || {}),
        },
      });
    },
    [component, onChange],
  );

  const handleConfigUpdate = useCallback(
    (field: string, value: unknown) => {
      handleComponentUpdate({
        config: {
          ...component.config,
          [field]: value,
        },
      });
    },
    [component, handleComponentUpdate],
  );

  const handleRemoveTool = useCallback(
    (toolIndex: number) => {
      if (!isAssistantAgent(component)) return;
      const newTools = [...((component.config.tools as any[]) || [])];
      newTools.splice(toolIndex, 1);
      handleConfigUpdate("tools", newTools);
    },
    [component, handleConfigUpdate],
  );

  const handleAddTool = useCallback(() => {
    if (!isAssistantAgent(component)) return;

    const blankTool: Component<FunctionToolConfig> = {
      provider: "autogen_core.tools.FunctionTool",
      component_type: "tool",
      version: 1,
      component_version: 1,
      description: "Create custom tools by wrapping standard Python functions.",
      label: "New Tool",
      config: {
        source_code: "def new_function():\n    pass",
        name: "new_function",
        description: "Description of the new function",
        global_imports: [],
        has_cancellation_support: false,
      },
    };

    // Update both working copy and actual component state
    const currentTools = component.config.tools || [];
    const updatedTools = [...currentTools, blankTool];

    // Update the actual component state
    handleConfigUpdate("tools", updatedTools);

    // If working copy functionality is available, update that too
    if (
      workingCopy &&
      setWorkingCopy &&
      updateComponentAtPath &&
      getCurrentComponent &&
      editPath
    ) {
      const updatedCopy = updateComponentAtPath(workingCopy, editPath, {
        config: {
          ...getCurrentComponent(workingCopy)?.config,
          tools: updatedTools,
        },
      });
      setWorkingCopy(updatedCopy);
    }
  }, [
    component,
    handleConfigUpdate,
    workingCopy,
    setWorkingCopy,
    updateComponentAtPath,
    getCurrentComponent,
    editPath,
  ]);

  const form = useFormContext();
  return (
    <div className="space-y-2">
      <DetailGroup title="Component Details">
        <div className="space-y-1">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>label</FormLabel>
                <FormControl>
                  <Input placeholder="Component name" {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Component description" {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </DetailGroup>
      <DetailGroup title="Configuration">
        <div className="space-y-2">
          {!isAssistantAgent(component) && (
            <div className="text-sm text-center bg-secondary/50 p-4 rounded-md">
              No agent configuration
              <DebugValue data={component} />
            </div>
          )}
          {isAssistantAgent(component) && (
            <>
              <InputWithTooltip
                label="Name"
                tooltip="Name of the assistant agent"
                required
              >
                <Input
                  value={component.config.name}
                  onChange={(e) => handleConfigUpdate("name", e.target.value)}
                />
              </InputWithTooltip>

              {/* Model Client Section */}

              <div className="space-y-2">
                <span className="text-sm font-medium text-primary">
                  Model Client
                </span>
                {component.config.model_client ? (
                  <div className="bg-secondary p-1 px-2 rounded-md">
                    <div className="flex items-center justify-between">
                      {" "}
                      <span className="text-sm">
                        {component.config.model_client.config.model}
                      </span>
                      <div className="flex items-center justify-between">
                        {component.config.model_client && onNavigate && (
                          <Button
                            onClick={() =>
                              onNavigate(
                                "model",
                                component.config.model_client?.label || "",
                                "model_client",
                              )
                            }
                            variant="outline"
                            // size={"icon"}
                            size={"default"}
                          >
                            <Edit className="size-4" /> 模型
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-secondary text-center bg-secondary/50 p-4 rounded-md">
                    No model configured
                  </div>
                )}
              </div>

              <InputWithTooltip
                label="System Message"
                tooltip="System message for the agent"
              >
                <Textarea
                  rows={4}
                  value={component.config.system_message}
                  onChange={(e) =>
                    handleConfigUpdate("system_message", e.target.value)
                  }
                />
              </InputWithTooltip>

              {/* Tools Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    Tools
                  </span>
                  <Button variant="outline" size="sm" onClick={handleAddTool}>
                    <PlusCircle className="w-4 h-4" />
                    Add Tool
                  </Button>
                </div>
                <div className="space-y-2">
                  {component.config.tools?.map((tool, index) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={(tool.label || "") + index}
                      className="bg-secondary p-1 px-2 rounded-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {tool.config.name || tool.label || ""}
                        </span>
                        <div className="flex items-center gap-2">
                          {onNavigate && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                onNavigate(
                                  "tool",
                                  tool.config.name || tool.label || "",
                                  "tools",
                                )
                              }
                            >
                              <Edit className="size-4" />
                            </Button>
                          )}
                          <Button
                            // danger
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveTool(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!component.config.tools ||
                    component.config.tools?.length === 0) && (
                    <div className="text-sm text-secondary text-center bg-secondary/50 p-4 rounded-md">
                      No tools configured
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Reflect on Tool Use
                </span>
                <Switch
                  checked={component.config.reflect_on_tool_use}
                  onChange={(checked) =>
                    handleConfigUpdate("reflect_on_tool_use", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Stream Model Client
                </span>
                <Switch
                  checked={component.config.model_client_stream}
                  onChange={(checked) =>
                    handleConfigUpdate("model_client_stream", checked)
                  }
                />
              </div>

              <InputWithTooltip
                label="Tool Call Summary Format"
                tooltip="Format for tool call summaries"
              >
                <Input
                  value={component.config.tool_call_summary_format}
                  onChange={(e) =>
                    handleConfigUpdate(
                      "tool_call_summary_format",
                      e.target.value,
                    )
                  }
                />
              </InputWithTooltip>
            </>
          )}

          {isUserProxyAgent(component) && (
            <InputWithTooltip
              label="Name"
              tooltip="Name of the user proxy agent"
              required
            >
              <Input
                value={component.config.name}
                onChange={(e) => handleConfigUpdate("name", e.target.value)}
              />
            </InputWithTooltip>
          )}

          {isWebSurferAgent(component) && (
            <>
              <InputWithTooltip
                label="Name"
                tooltip="Name of the web surfer agent"
                required
              >
                <Input
                  value={component.config.name}
                  onChange={(e) => handleConfigUpdate("name", e.target.value)}
                />
              </InputWithTooltip>
              <InputWithTooltip
                label="Start Page"
                tooltip="URL to start browsing from"
              >
                <Input
                  value={component.config.start_page || ""}
                  onChange={(e) =>
                    handleConfigUpdate("start_page", e.target.value)
                  }
                />
              </InputWithTooltip>
              <InputWithTooltip
                label="Downloads Folder"
                tooltip="Folder path to save downloads"
              >
                <Input
                  value={component.config.downloads_folder || ""}
                  onChange={(e) =>
                    handleConfigUpdate("downloads_folder", e.target.value)
                  }
                />
              </InputWithTooltip>
              <InputWithTooltip
                label="Debug Directory"
                tooltip="Directory for debugging logs"
              >
                <Input
                  value={component.config.debug_dir || ""}
                  onChange={(e) =>
                    handleConfigUpdate("debug_dir", e.target.value)
                  }
                />
              </InputWithTooltip>

              {/* Added Model Client Section for WebSurferAgent */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-primary">
                  Model Client
                </span>
                {component.config.model_client ? (
                  <div className="bg-secondary p-1 px-2 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {component.config.model_client.config.model}
                      </span>
                      <div className="flex items-center justify-between">
                        {onNavigate && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onNavigate(
                                "model",
                                component.config.model_client?.label || "",
                                "model_client",
                              )
                            }
                          >
                            <Edit className="size-4" />
                            模型配置
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-secondary text-center bg-secondary/50 p-4 rounded-md">
                    No model configured
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Headless
                </span>
                <Switch
                  checked={component.config.headless || false}
                  onChange={(checked) =>
                    handleConfigUpdate("headless", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Animate Actions
                </span>
                <Switch
                  checked={component.config.animate_actions || false}
                  onChange={(checked) =>
                    handleConfigUpdate("animate_actions", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Save Screenshots
                </span>
                <Switch
                  checked={component.config.to_save_screenshots || false}
                  onChange={(checked) =>
                    handleConfigUpdate("to_save_screenshots", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Use OCR
                </span>
                <Switch
                  checked={component.config.use_ocr || false}
                  onChange={(checked) => handleConfigUpdate("use_ocr", checked)}
                />
              </div>
              <InputWithTooltip
                label="Browser Channel"
                tooltip="Channel for the browser (e.g. beta, stable)"
              >
                <Input
                  value={component.config.browser_channel || ""}
                  onChange={(e) =>
                    handleConfigUpdate("browser_channel", e.target.value)
                  }
                />
              </InputWithTooltip>
              <InputWithTooltip
                label="Browser Data Directory"
                tooltip="Directory for browser profile data"
              >
                <Input
                  value={component.config.browser_data_dir || ""}
                  onChange={(e) =>
                    handleConfigUpdate("browser_data_dir", e.target.value)
                  }
                />
              </InputWithTooltip>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Resize Viewport
                </span>
                <Switch
                  checked={component.config.to_resize_viewport || false}
                  onChange={(checked) =>
                    handleConfigUpdate("to_resize_viewport", checked)
                  }
                />
              </div>
            </>
          )}
        </div>
      </DetailGroup>
    </div>
  );
};

export default React.memo(AgentFields);
