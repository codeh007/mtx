import { MinusCircle, PlusCircle } from "lucide-react";
import type { MtComponent } from "mtmaiapi";
import { MonacoEditor } from "mtxuilib/mt/monaco";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Switch } from "mtxuilib/ui/switch";
import { Textarea } from "mtxuilib/ui/textarea";
import React, { useCallback, useRef, useState } from "react";
import type { Import } from "../../autogen_views/types/datamodel";
import { isFunctionTool } from "../../autogen_views/types/guards";

interface ToolFieldsProps {
  component: MtComponent;
  onChange: (updates: Partial<MtComponent>) => void;
}

interface ImportState {
  module: string;
  imports: string;
}

export const ToolFields = ({ component, onChange }: ToolFieldsProps) => {
  if (!isFunctionTool(component)) return null;

  const editorRef = useRef(null);
  const [showAddImport, setShowAddImport] = useState(false);
  const [importType, setImportType] = useState<"direct" | "fromModule">(
    "direct",
  );
  const [directImport, setDirectImport] = useState("");
  const [moduleImport, setModuleImport] = useState<ImportState>({
    module: "",
    imports: "",
  });

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

  const formatImport = (imp: Import): string => {
    if (!imp) return "";
    if (typeof imp === "string") {
      return imp;
    }
    return `from ${imp.module} import ${imp.imports.join(", ")}`;
  };

  const handleAddImport = () => {
    const currentImports = [...(component.config.global_imports || [])];

    if (importType === "direct" && directImport) {
      currentImports.push(directImport);
      setDirectImport("");
    } else if (
      importType === "fromModule" &&
      moduleImport.module &&
      moduleImport.imports
    ) {
      currentImports.push({
        module: moduleImport.module,
        imports: moduleImport.imports
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
      });
      setModuleImport({ module: "", imports: "" });
    }

    handleComponentUpdate({
      config: {
        ...component.config,
        global_imports: currentImports,
      },
    });
    setShowAddImport(false);
  };

  const handleRemoveImport = (index: number) => {
    const newImports = [...(component.config.global_imports || [])];
    newImports.splice(index, 1);
    handleComponentUpdate({
      config: {
        ...component.config,
        global_imports: newImports,
      },
    });
  };

  return (
    <div className="space-y-2">
      {/* <DetailGroup title="Component Details"> */}
      <div className="space-y-1">
        <label className="block" htmlFor="name">
          <span className="text-sm font-medium text-gray-700">Name</span>
          <Input
            value={component.label || ""}
            onChange={(e) => handleComponentUpdate({ label: e.target.value })}
            placeholder="Tool name"
            className="mt-1"
          />
        </label>

        <label className="block" htmlFor="description">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <Textarea
            value={component.description || ""}
            onChange={(e) =>
              handleComponentUpdate({ description: e.target.value })
            }
            placeholder="Tool description"
            rows={4}
            className="mt-1"
          />
        </label>
      </div>
      {/* </DetailGroup> */}

      {/* <DetailGroup title="Configuration"> */}
      <div className="space-y-1">
        <label className="block" htmlFor="name">
          <span className="text-sm font-medium text-gray-700">
            Function Name
          </span>
          <Input
            value={component.config.name || ""}
            onChange={(e) =>
              handleComponentUpdate({
                config: { ...component.config, name: e.target.value },
              })
            }
            placeholder="Function name"
            className="mt-1"
          />
        </label>

        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-700">
            Global Imports
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {(component.config.global_imports || []).map((imp, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className="flex items-center gap-2 bg-tertiary rounded px-2 py-1"
              >
                <span className="text-sm">{formatImport(imp)}</span>
                <Button
                  // type="text"
                  // size="small"
                  className="flex items-center justify-center h-6 w-6 p-0"
                  onClick={() => handleRemoveImport(index)}
                  // icon={<MinusCircle className="h-4 w-4" />}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {showAddImport ? (
            <div className="border rounded p-3 space-y-3">
              {/* <Select
                  value={importType}
                  onChange={setImportType}
                  style={{ width: 200 }}
                >
                  <Option value="direct">Direct Import</Option>
                  <Option value="fromModule">From Module Import</Option>
                </Select> */}

              {importType === "direct" ? (
                <>
                  <Input
                    placeholder="Package name (e.g., os)"
                    className="w-64"
                    value={directImport}
                    onChange={(e) => setDirectImport(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && directImport) {
                        handleAddImport();
                      }
                    }}
                  />
                  <Button onClick={handleAddImport} disabled={!directImport}>
                    Add
                  </Button>
                </>
              ) : (
                <div className="w-full">
                  <Input
                    placeholder="Module name (e.g., typing)"
                    className="w-64"
                    value={moduleImport.module}
                    onChange={(e) =>
                      setModuleImport((prev) => ({
                        ...prev,
                        module: e.target.value,
                      }))
                    }
                  />
                  <div className="w-full">
                    <Input
                      placeholder="Import names (comma-separated)"
                      className="w-64"
                      value={moduleImport.imports}
                      onChange={(e) =>
                        setModuleImport((prev) => ({
                          ...prev,
                          imports: e.target.value,
                        }))
                      }
                    />
                    <Button
                      onClick={handleAddImport}
                      disabled={!moduleImport.module || !moduleImport.imports}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={() => setShowAddImport(true)} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Import
            </Button>
          )}
        </div>

        <label className="block" htmlFor="source_code">
          <span className="text-sm font-medium text-gray-700">Source Code</span>
          <div className="mt-1 h-96">
            <MonacoEditor
              value={component.config.source_code || ""}
              editorRef={editorRef}
              language="python"
              onChange={(value) =>
                handleComponentUpdate({
                  config: { ...component.config, source_code: value },
                })
              }
            />
          </div>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Has Cancellation Support
          </span>
          <Switch
            checked={component.config.has_cancellation_support || false}
            onChange={(checked) =>
              handleComponentUpdate({
                config: {
                  ...component.config,
                  has_cancellation_support: checked,
                },
              })
            }
          />
        </div>
      </div>
      {/* </DetailGroup> */}
    </div>
  );
};

export default React.memo(ToolFields);
