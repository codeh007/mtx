"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tenant } from "mtmaiapi/api";
import { cn } from "mtxuilib/lib/utils";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().max(255).min(1),
});

interface UpdateTenantSettingsProps {
  className?: string;
  onSubmit: (opts: z.infer<typeof schema>) => void;
  isLoading: boolean;
  fieldErrors?: Record<string, string>;
  tenant: Tenant;
}

export function UpdateTenantForm({
  className,
  ...props
}: UpdateTenantSettingsProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: props.tenant.name,
    },
  });

  const nameError = errors.name?.message?.toString() || props.fieldErrors?.role;

  return (
    <div className={cn("grid gap-6", className)}>
      <form
        onSubmit={handleSubmit((d) => {
          props.onSubmit(d);
        })}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Name</Label>
            <Input
              {...register("name")}
              id="name"
              placeholder="My Tenant"
              type="name"
              autoCapitalize="none"
              autoCorrect="off"
              className=" min-w-[300px]"
              disabled={props.isLoading}
            />
            {nameError && (
              <div className="text-sm text-red-500">{nameError}</div>
            )}
          </div>
          <Button disabled={props.isLoading} className="w-fit">
            {props.isLoading && <Spinner />}
            Change Name
          </Button>
        </div>
      </form>
    </div>
  );
}
