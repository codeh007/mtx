import { zodResolver } from "@hookform/resolvers/zod";
import type { TenantAlertingSettings } from "mtmaiapi";
import { cn } from "mtxuilib/lib/utils";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";
import { Label } from "mtxuilib/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "mtxuilib/ui/select";
import { Switch } from "mtxuilib/ui/switch";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  maxAlertingFrequency: z.string(),
  enableWorkflowRunFailureAlerts: z.boolean().optional(),
  enableExpiringTokenAlerts: z.boolean().optional(),
  enableTenantResourceLimitAlerts: z.boolean().optional(),
});

interface UpdateTenantAlertingSettingsProps {
  className?: string;
  onSubmit: (opts: z.infer<typeof schema>) => void;
  isLoading: boolean;
  fieldErrors?: Record<string, string>;
  alertingSettings: TenantAlertingSettings;
}

export function UpdateTenantAlertingSettings({
  className,
  ...props
}: UpdateTenantAlertingSettingsProps) {
  const [enabledWorkflowAlerting, setEnabledWorkflowAlerting] = useState(
    props.alertingSettings.enableWorkflowRunFailureAlerts,
  );

  const [enabledExpiringTokenAlerting, setEnabledExpiringTokenAlerting] =
    useState(props.alertingSettings.enableExpiringTokenAlerts);

  const [enableTenantResourceLimitAlerts, setEnableTenantResourceLimitAlerts] =
    useState(props.alertingSettings.enableTenantResourceLimitAlerts);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      maxAlertingFrequency: props.alertingSettings.maxAlertingFrequency,
    },
  });

  const freqError =
    errors.maxAlertingFrequency?.message?.toString() || props.fieldErrors?.role;

  return (
    <div>
      <form
        onSubmit={handleSubmit((d) => {
          props.onSubmit({
            ...d,
            enableWorkflowRunFailureAlerts: enabledWorkflowAlerting,
            enableExpiringTokenAlerts: enabledExpiringTokenAlerting,
            enableTenantResourceLimitAlerts: enableTenantResourceLimitAlerts,
          });
        })}
        className={cn("grid gap-6", className)}
      >
        <div className="flex items-center space-x-2">
          <Switch
            id="eta"
            checked={enabledExpiringTokenAlerting}
            onClick={() => {
              setEnabledExpiringTokenAlerting((checkedState) => !checkedState);
            }}
          />
          <Label htmlFor="eta" className="text-sm">
            Enable Expiring Token Alerts
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="atrl"
            checked={enableTenantResourceLimitAlerts}
            onClick={() => {
              setEnableTenantResourceLimitAlerts(
                (checkedState) => !checkedState,
              );
            }}
          />
          <Label htmlFor="atrl" className="text-sm">
            Enable Tenant Resource Limit Alerts
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="awrf"
            checked={enabledWorkflowAlerting}
            onClick={() => {
              setEnabledWorkflowAlerting((checkedState) => !checkedState);
            }}
          />
          <Label htmlFor="awrf" className="text-sm">
            Enable Workflow Run Failure Alerts
          </Label>
        </div>

        <div className="grid gap-4">
          {enabledWorkflowAlerting && (
            <div className="grid gap-2">
              <Label htmlFor="maxAlertingFrequency">
                Max Workflow Run Failure Alerting Frequency
              </Label>
              <Controller
                control={control}
                name="maxAlertingFrequency"
                render={({ field }) => {
                  return (
                    <Select onValueChange={field.onChange} {...field}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          id="maxAlertingFrequency"
                          placeholder="Frequency..."
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5m">5 minutes</SelectItem>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {freqError && (
                <div className="text-sm text-red-500">{freqError}</div>
              )}
            </div>
          )}
          <Button disabled={props.isLoading}>
            {props.isLoading && <Spinner />}
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
