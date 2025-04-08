import { Edit, HelpCircle, MinusCircle, PlusCircle } from "lucide-react";
import type { MtComponent } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Select } from "mtxuilib/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "mtxuilib/ui/tooltip";
import React, { useCallback, useState } from "react";
import { DetailGroup } from "../../autogen_views/detailgroup";
import type {
  Component,
  ComponentConfig,
  TerminationConfig,
} from "../../autogen_views/types/datamodel";
import {
  PROVIDERS,
  isMaxMessageTermination,
  isOrTermination,
  isTextMentionTermination,
} from "../../autogen_views/types/guards";

interface TerminationFieldsProps {
  component: Component<TerminationConfig>;
  onChange: (updates: Partial<MtComponent>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

const TERMINATION_TYPES = {
  MAX_MESSAGE: {
    label: "Max Messages",
    provider: PROVIDERS.MAX_MESSAGE,
    defaultConfig: {
      max_messages: 10,
      include_agent_event: false,
    },
  },
  TEXT_MENTION: {
    label: "Text Mention",
    provider: PROVIDERS.TEXT_MENTION,
    defaultConfig: {
      text: "TERMINATE",
    },
  },
};

const InputWithTooltip: React.FC<{
  label: string;
  tooltip: string;
  children: React.ReactNode;
}> = ({ label, tooltip, children }) => (
  <label className="block" htmlFor={label}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="size-4 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </div>
    {children}
  </label>
);

export const TerminationFields: React.FC<TerminationFieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [selectedConditionType, setSelectedConditionType] =
    useState<string>("");

  if (!component) return null;

  const handleComponentUpdate = useCallback(
    (updates: Partial<Component<ComponentConfig>>) => {
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

  const createNewCondition = (type: string) => {
    const template = TERMINATION_TYPES[type as keyof typeof TERMINATION_TYPES];
    return {
      provider: template.provider,
      component_type: "termination",
      version: 1,
      component_version: 1,
      description: `${template.label} termination condition`,
      label: template.label,
      config: template.defaultConfig,
    };
  };

  const handleAddCondition = () => {
    if (!selectedConditionType || !isOrTermination(component)) return;

    const newCondition = createNewCondition(selectedConditionType);
    const currentConditions = component.config.conditions || [];

    handleComponentUpdate({
      config: {
        conditions: [...currentConditions, newCondition],
      },
    });

    setShowAddCondition(false);
    setSelectedConditionType("");
  };

  const handleRemoveCondition = (index: number) => {
    if (!isOrTermination(component)) return;

    const currentConditions = [...component.config.conditions];
    currentConditions.splice(index, 1);

    handleComponentUpdate({
      config: {
        conditions: currentConditions,
      },
    });
  };

  if (isOrTermination(component)) {
    return (
      <DetailGroup title="Termination Conditions">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setShowAddCondition(true)}
              className="w-full"
              variant="outline"
            >
              <PlusCircle className="size-4" /> 增加条件
            </Button>
          </div>

          {showAddCondition && (
            <div className="border rounded p-4 space-y-4">
              <InputWithTooltip
                label="Condition Type"
                tooltip="Select the type of termination condition to add"
              >
                <Select
                  value={selectedConditionType}
                  onChange={setSelectedConditionType}
                  className="w-full"
                >
                  {Object.entries(TERMINATION_TYPES).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value.label}
                    </Select.Option>
                  ))}
                </Select>
              </InputWithTooltip>
              <Button
                onClick={handleAddCondition}
                disabled={!selectedConditionType}
                className="w-full"
              >
                Add
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {component.config.conditions?.map((condition, index) => (
              <div key={index} className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    onNavigate?.(
                      condition.component_type,
                      condition.label || "",
                      "conditions",
                    )
                  }
                  className="w-full flex justify-between items-center"
                >
                  <span>{condition.label || `Condition ${index + 1}`}</span>
                  <Edit className="size-4" />
                </Button>
                <Button
                  // type="text"
                  // danger
                  onClick={() => handleRemoveCondition(index)}
                  className=""
                  variant={"destructive"}
                >
                  <MinusCircle className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DetailGroup>
    );
  }

  if (isMaxMessageTermination(component)) {
    return (
      <DetailGroup title="Max Messages Configuration">
        <InputWithTooltip
          label="Max Messages"
          tooltip="Maximum number of messages before termination"
        >
          <Input
            type="number"
            min={1}
            value={component.config.max_messages}
            onChange={(value) =>
              handleComponentUpdate({
                config: { max_messages: value },
              })
            }
            className="w-full"
          />
        </InputWithTooltip>
      </DetailGroup>
    );
  }

  if (isTextMentionTermination(component)) {
    return (
      <DetailGroup title="Text Mention Configuration">
        <InputWithTooltip
          label="Termination Text"
          tooltip="Text that triggers termination when mentioned"
        >
          <Input
            defaultValue={component.config.text}
            // value={component.config.text}
            onChange={(e) =>
              handleComponentUpdate({
                config: { text: e.target.value },
              })
            }
          />
        </InputWithTooltip>
      </DetailGroup>
    );
  }

  return null;
};

export default React.memo(TerminationFields);
