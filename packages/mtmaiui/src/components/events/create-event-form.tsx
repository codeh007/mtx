"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "mtxuilib/lib/utils";
import { CodeEditor } from "mtxuilib/mt/code-editor";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "mtxuilib/ui/dialog";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  key: z.string().min(1).max(255),
  data: z.object({}).passthrough(),
  additionalMetadata: z.any(),
});

interface CreateEventFormProps {
  className?: string;
  onSubmit: (opts: z.infer<typeof schema>) => void;
  isLoading: boolean;
  fieldErrors?: Record<string, string>;
}

export function CreateEventForm({ className, ...props }: CreateEventFormProps) {
  const [code, setCode] = useState<string | undefined>("{}");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const keyError = errors.key?.message?.toString() || props.fieldErrors?.name;
  const dataError = errors.data?.message?.toString() || props.fieldErrors?.data;

  return (
    <DialogContent className="w-fit max-w-[80%] min-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create a new event</DialogTitle>
      </DialogHeader>
      <div className={cn("grid gap-6", className)}>
        <form
          onSubmit={handleSubmit((d) => {
            props.onSubmit(d);
          })}
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Key</Label>
              <Input
                {...register("key")}
                id="api-token-key"
                placeholder="sample-event"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={props.isLoading}
              />
              {keyError && (
                <div className="text-sm text-red-500">{keyError}</div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inputData">Input data</Label>
              <Controller
                control={control}
                name="data"
                defaultValue={{}}
                render={({ field }) => {
                  return (
                    <CodeEditor
                      code={code || ""}
                      setCode={(value) => {
                        setCode(value);

                        // if this is valid JSON, set it as the value
                        if (!value) {
                          field.onChange({});
                          return;
                        }

                        try {
                          field.onChange(JSON.parse(value));
                        } catch (e) {} // eslint-disable-line no-empty
                      }}
                      language="json"
                    />
                  );
                }}
              />
              {dataError && (
                <div className="text-sm text-red-500">{dataError}</div>
              )}
            </div>
            <Button disabled={props.isLoading}>
              {props.isLoading && <Spinner />}
              Create event
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}