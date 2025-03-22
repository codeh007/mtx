import debounce from "lodash.debounce";
import { ChevronLeft, Code, FormInput } from "lucide-react";
import type { MtComponent } from "mtmaiapi";
import { MonacoEditor } from "mtxuilib/mt/monaco";
import { Breadcrumb } from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [workingCopy, setWorkingCopy] = useState<MtComponent>(
    Object.assign({}, component),
  );
  const isJsonEditing = useComponentEditStore((x) => x.isJsonEditing);
  const setIsJsonEditing = useComponentEditStore((x) => x.setIsJsonEditing);

  const editorRef = useRef(null);

  // Reset working copy when component changes
  useEffect(() => {
    setWorkingCopy(component);
    setEditPath([]);
  }, [component]);

  const getCurrentComponent = useCallback(
    (root: MtComponent) => {
      return editPath.reduce<MtComponent | null>((current, path) => {
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
            if (!("component_type" in item)) return item;
            if (
              item.label === currentPath.id ||
              ("name" in item.config && item.config.name === currentPath.id)
            ) {
              return updateComponentAtPath(item, remainingPath, updates);
            }
            return item;
          });
        }

        if (fieldValue && "component_type" in fieldValue) {
          return updateComponentAtPath(
            fieldValue as MtComponent,
            remainingPath,
            updates,
          );
        }

        return fieldValue;
      };

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

      setWorkingCopy(updatedComponent);
      onChange?.(updatedComponent);
    },
    [workingCopy, editPath, updateComponentAtPath],
  );

  const handleNavigate = useCallback(
    (
      componentType: string,
      id: string,
      parentField: string,
      index?: number,
    ) => {
      if (!navigationDepth) return;
      setEditPath((prev) => [
        ...prev,
        { componentType, id, parentField, index },
      ]);
    },
    [navigationDepth],
  );

  const handleNavigateBack = useCallback(() => {
    setEditPath((prev) => prev.slice(0, -1));
  }, []);

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
        <ModelFields
          component={currentComponent}
          onChange={handleComponentUpdate}
        />
      );
    }
    if (isToolComponent(currentComponent)) {
      return <ToolFields {...commonProps} />;
    }
    if (isTerminationComponent(currentComponent)) {
      return (
        <TerminationFields
          component={currentComponent}
          onChange={handleComponentUpdate}
          onNavigate={handleNavigate}
        />
      );
    }
    return (
      <div>
        No fields for this component type: {currentComponent.componentType}
      </div>
    );

    // return null;
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

  const handleSave = useCallback(() => {
    console.log("(handleSave)working copy", workingCopy);
    onChange(workingCopy);
    onClose?.();
  }, [workingCopy, onChange, onClose]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        {navigationDepth && editPath.length > 0 && (
          <Button onClick={handleNavigateBack} variant="ghost" size="icon">
            <ChevronLeft className="size-4" />
          </Button>
        )}
        <div className="flex-1">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <Button
          onClick={() => setIsJsonEditing((prev) => !prev)}
          variant="ghost"
          // size="icon"
        >
          {isJsonEditing ? (
            <>
              <FormInput className="size-4 text-accent mr-1 inline-block" />
              Form
            </>
          ) : (
            <>
              <Code className="size-4 text-accent mr-1 inline-block" />
              JSON
            </>
          )}
        </Button>
      </div>
      {isJsonEditing ? (
        <div className="flex-1 overflow-y-auto">
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
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div>
  );
};
