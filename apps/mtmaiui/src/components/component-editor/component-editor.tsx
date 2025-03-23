import debounce from "lodash.debounce";
import { ChevronLeft, Code, FormInput } from "lucide-react";
import type { MtComponent } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, useZodForm } from "mtxuilib/mt/form/ZodForm";
import { MonacoEditor } from "mtxuilib/mt/monaco";
import { Breadcrumb } from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { z } from "zod";
import {
  isAgentComponent,
  isModelComponent,
  isTeamComponent,
  isTerminationComponent,
  isToolComponent,
} from "../../routes/components/views/types/guards";
import {
  type ComponentEditorProps,
  type EditPath,
  useComponentEditStore,
} from "./ComponentEditor.store";
import { AgentFields } from "./fields/agent-fields";
import { ModelFields } from "./fields/model-fields";
import { TeamFields } from "./fields/team-fields";
import { TerminationFields } from "./fields/termination-fields";
import { ToolFields } from "./fields/tool-fields";

export const ComponentEditor = ({
  component,
  onChange,
  onClose,
  navigationDepth = false,
}: ComponentEditorProps) => {
  const editPath = useComponentEditStore((x) => x.editPath);
  const setEditPath = useComponentEditStore((x) => x.setEditPath);
  const workingCopy = useComponentEditStore((x) => x.workingCopy);
  const setWorkingCopy = useComponentEditStore((x) => x.setWorkingCopy);
  const isJsonEditing = useComponentEditStore((x) => x.isJsonEditing);
  const setIsJsonEditing = useComponentEditStore((x) => x.setIsJsonEditing);

  const editorRef = useRef(null);

  // Reset working copy when component changes
  useEffect(() => {
    setWorkingCopy(component);
    setEditPath([]);
  }, [component, setEditPath, setWorkingCopy]);

  const getCurrentComponent = useCallback(
    (root: MtComponent) => {
      // console.log("(getCurrentComponent)editPath", editPath);
      return editPath?.reduce<MtComponent | null>((current, path) => {
        if (!current) return null;

        const field = current.config[
          path.parentField as keyof typeof current.config
        ] as MtComponent[] | MtComponent | undefined;

        if (Array.isArray(field)) {
          // If index is provided, use it directly (preferred method)
          if (
            typeof path.index === "number" &&
            path.index >= 0 &&
            path.index < field.length
          ) {
            return field[path.index];
          }

          // Fallback to label/name lookup for backward compatibility
          return (
            field.find(
              (item) =>
                item.label === path.id ||
                (item.config &&
                  "name" in item.config &&
                  item.config.name === path.id),
            ) || null
          );
        }

        return field || null;
      }, root);
    },
    [editPath],
  );

  const updateComponentAtPath = useCallback(
    (
      root: MtComponent,
      path: EditPath[],
      updates: Partial<MtComponent>,
    ): MtComponent => {
      if (path.length === 0) {
        // console.log("(更新根组件)", { path, root, updates });
        return {
          ...root,
          ...updates,
          config: {
            ...root.config,
            ...(updates.config || {}),
          },
        };
      }
      const [currentPath, ...remainingPath] = path;
      const field =
        root.config[currentPath.parentField as keyof typeof root.config];
      // console.log("(更新非根组件)", {
      //   path,
      //   root,
      //   updates,
      //   field,
      //   currentPath,
      //   remainingPath,
      // });

      const updateField = (fieldValue: any): any => {
        if (Array.isArray(fieldValue)) {
          // If we have an index, use it directly for the update
          if (
            typeof currentPath.index === "number" &&
            currentPath.index >= 0 &&
            currentPath.index < fieldValue.length
          ) {
            return fieldValue.map((item, idx) => {
              if (idx === currentPath.index) {
                return updateComponentAtPath(item, remainingPath, updates);
              }
              return item;
            });
          }

          // Fallback to label/name lookup
          return fieldValue.map((item) => {
            if (!("componentType" in item)) return item;
            if (
              item.label === currentPath.id ||
              ("name" in item.config && item.config.name === currentPath.id)
            ) {
              return updateComponentAtPath(item, remainingPath, updates);
            }
            return item;
          });
        }

        if (fieldValue && "componentType" in fieldValue) {
          return updateComponentAtPath(
            fieldValue as MtComponent,
            remainingPath,
            updates,
          );
        }

        return fieldValue;
      };

      // console.log("(更新非根组件)更新后的组件", {
      //   field,
      //   updateField: updateField(field),
      // });
      return {
        ...root,
        config: {
          ...root.config,
          [currentPath.parentField]: updateField(field),
        },
      };
    },
    [],
  );

  const handleComponentUpdate = useCallback(
    (updates: Partial<MtComponent>) => {
      const updatedComponent = updateComponentAtPath(
        workingCopy,
        editPath,
        updates,
      );
      // console.log("(component-editor)handleComponentUpdate", {
      //   updates,
      //   updatedComponent,
      // });

      setWorkingCopy(updatedComponent);
      // onChange?.(updatedComponent);
    },
    [workingCopy, editPath, updateComponentAtPath, setWorkingCopy, onChange],
  );

  const handleNavigate = useCallback(
    (
      componentType: string,
      id: string,
      parentField: string,
      index?: number,
    ) => {
      if (!navigationDepth) return;
      console.log("(handleNavigate)", {
        componentType,
        id,
        parentField,
        index,
      });
      setEditPath([...editPath, { componentType, id, parentField, index }]);
    },
    [navigationDepth, editPath, setEditPath],
  );

  const handleNavigateBack = useCallback(() => {
    setEditPath(editPath.slice(0, -1));
  }, [editPath, setEditPath]);

  const debouncedJsonUpdate = useCallback(
    debounce((value: string) => {
      try {
        const updatedComponent = JSON.parse(value);
        setWorkingCopy(updatedComponent);
      } catch (err) {
        console.error("Invalid JSON", err);
      }
    }, 500),
    [],
  );

  const currentComponent = getCurrentComponent(workingCopy) || workingCopy;
  const form = useZodForm({
    schema: z.any(),
    defaultValues: component,
  });
  // const handleSubmit = form.handleSubmit((data) => {
  //   console.log("handleSubmit", data);
  //   handleComponentUpdate(data);
  // });
  const handleSave = useCallback(() => {
    console.log("(handleSave)working copy", workingCopy);
    // handleSubmit(workingCopy);
    onChange(workingCopy);
    onClose?.();
  }, [workingCopy, onChange, onClose]);

  const renderFields = useCallback(() => {
    // console.log(
    //   "current component",
    //   isTeamComponent(currentComponent),
    //   currentComponent,
    // );
    const commonProps = {
      component: currentComponent,
      onChange: handleComponentUpdate,
    };

    if (isTeamComponent(currentComponent)) {
      return (
        <TeamFields
          component={currentComponent}
          onChange={handleComponentUpdate}
          onNavigate={handleNavigate}
        />
      );
    }
    if (isAgentComponent(currentComponent)) {
      return (
        <>
          <AgentFields
            component={currentComponent}
            onChange={handleComponentUpdate}
            onNavigate={handleNavigate}
          />
        </>
      );
    }
    if (isModelComponent(currentComponent)) {
      return (
        <>
          <ModelFields
            component={currentComponent}
            onChange={handleComponentUpdate}
          />
        </>
      );
    }
    if (isToolComponent(currentComponent)) {
      return (
        <>
          <span>ToolFields</span>
          <ToolFields {...commonProps} />
        </>
      );
    }
    if (isTerminationComponent(currentComponent)) {
      return (
        <>
          <TerminationFields
            component={currentComponent}
            onChange={handleComponentUpdate}
            onNavigate={handleNavigate}
          />
        </>
      );
    }
    return (
      <div>
        No fields for this component type: {currentComponent.componentType}
      </div>
    );
  }, [currentComponent, handleComponentUpdate, handleNavigate]);

  const breadcrumbItems = useMemo(
    () => [
      { title: workingCopy.label || "Root" },
      ...editPath.map((path) => ({
        title: path.id,
      })),
    ],
    [workingCopy.label, editPath],
  );

  return (
    <div className="flex flex-col h-full">
      <ZForm
        form={form}
        handleSubmit={() => {
          // console.log("handleSubmit(TODO)", form.getValues());
          // console.log("(handleSave)working copy", workingCopy);
          handleSave();
        }}
        className="space-y-2"
      >
        <div className="flex">
          {navigationDepth && editPath.length > 0 && (
            <Button
              onClick={handleNavigateBack}
              variant="ghost"
              size="icon"
              className="mr-2"
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <DebugValue data={{ editPath, workingCopy }} />

          <Button
            onClick={() => setIsJsonEditing(!isJsonEditing)}
            variant="ghost"
            size="icon"
          >
            {isJsonEditing ? (
              <FormInput className="size-4" />
            ) : (
              <Code className="size-4" />
            )}
          </Button>
        </div>
        {isJsonEditing ? (
          <div className="flex-1 overflow-y-auto min-h-[600px] h-lvh w-full overflow-scroll min-w-xl ">
            <MonacoEditor
              editorRef={editorRef}
              value={JSON.stringify(workingCopy, null, 2)}
              onChange={debouncedJsonUpdate}
              language="json"
              minimap={true}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">{renderFields()}</div>
        )}
        {onClose && (
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-secondary">
            <Button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              取消
            </Button>
            <Button
            // onClick={(e) => {
            //   e.preventDefault();
            //   console.log("(handleSave)working copy", workingCopy);
            //   handleSave();
            // }}
            >
              保存
            </Button>
          </div>
        )}
      </ZForm>
    </div>
  );
};
