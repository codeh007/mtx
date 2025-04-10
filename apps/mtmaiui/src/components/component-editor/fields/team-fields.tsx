import { Edit, Timer } from "lucide-react";
import type { MtComponent } from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Textarea } from "mtxuilib/ui/textarea";
import React, { useCallback } from "react";
import type {
  RoundRobinGroupChatConfig,
  SelectorGroupChatConfig,
} from "../../autogen_views/types/datamodel";
import {
  isInstagramTeam,
  isRoundRobinTeam,
  isSelectorTeam,
} from "../../autogen_views/types/guards";

interface TeamFieldsProps {
  component: MtComponent;
  onChange: (updates: Partial<MtComponent>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const TeamFields = ({
  component,
  onChange,
  onNavigate,
}: TeamFieldsProps) => {
  // if (!isSelectorTeam(component) && !isRoundRobinTeam(component)) return null;

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
      if (isSelectorTeam(component)) {
        handleComponentUpdate({
          config: {
            ...component.config,
            [field]: value,
          } as SelectorGroupChatConfig,
        });
      } else if (isRoundRobinTeam(component)) {
        handleComponentUpdate({
          config: {
            ...component.config,
            [field]: value,
          } as RoundRobinGroupChatConfig,
        });
      }
    },
    [component, handleComponentUpdate],
  );

  return (
    <div className=" ">
      {/* <DetailGroup title="Component Details"> */}
      <div className="space-y-4">
        <label className="block" htmlFor="name">
          <span className="text-sm font-medium text-primary">Name</span>
          <Input
            value={component.label || ""}
            onChange={(e) => handleComponentUpdate({ label: e.target.value })}
            placeholder="Team name"
            className="mt-1"
          />
        </label>

        <label className="block" htmlFor="description">
          <span className="text-sm font-medium text-primary">Description</span>
          <Textarea
            value={component.description || ""}
            onChange={(e) =>
              handleComponentUpdate({ description: e.target.value })
            }
            placeholder="Team description"
            rows={4}
            className="mt-1"
          />
        </label>
      </div>
      {/* </DetailGroup> */}

      {/* <DetailGroup title="Configuration"> */}
      {isSelectorTeam(component) && (
        <div className="space-y-4">
          <label className="block" htmlFor="selector_prompt">
            <span className="text-sm font-medium text-primary">
              Selector Prompt
            </span>
            <Textarea
              value={component.config.selector_prompt || ""}
              onChange={(e) =>
                handleConfigUpdate("selector_prompt", e.target.value)
              }
              placeholder="Prompt for the selector"
              rows={4}
              className="mt-1"
            />
          </label>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Model</h3>
            <div className="p-4 rounded-md">
              {component.config.model_client ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {component.config.model_client.config.model}
                  </span>
                  {onNavigate && (
                    <Button
                      // type="text"
                      onClick={() =>
                        onNavigate(
                          "model",
                          component.config.model_client?.label || "",
                          "model_client",
                        )
                      }
                      variant="ghost"
                      size="icon"
                    >
                      <Edit className="size-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-sm text-center">No model configured</div>
              )}
            </div>
          </div>
        </div>
      )}

      {isInstagramTeam(component) && (
        <div className="space-y-4 bg-amber-100">
          <label className="block" htmlFor="selector_prompt">
            <span className="text-sm font-medium text-primary">
              Instagram Team
            </span>
          </label>
        </div>
      )}

      <div className="space-y-2 mt-4">
        <h3 className="text-sm font-medium text-primary">
          Termination Condition
        </h3>
        <div className="bg-secondary p-4 rounded-md">
          {component.config.termination_condition ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-secondary" />
                <span className="text-sm">
                  {component.config.termination_condition.label ||
                    component.config.termination_condition.component_type}
                </span>
              </div>
              {onNavigate && (
                <Button
                  onClick={() =>
                    onNavigate(
                      "termination",
                      component.config.termination_condition?.label || "",
                      "termination_condition",
                    )
                  }
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-secondary text-center">
              No termination condition configured
            </div>
          )}
        </div>
      </div>
      {/* </DetailGroup> */}
    </div>
  );
};

export default React.memo(TeamFields);
