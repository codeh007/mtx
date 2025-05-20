"use client";

import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { z } from "zod";

export default function DemoRunCodeForm() {
  const form = useZodFormV2({
    defaultValues: {
      task: "",
    },
    schema: z.object({
      task: z.string().min(1),
    }),
    handleSubmit: (values) => {},
  });
  return (
    <>
      <ZForm form={form.form}>
        <ButtonRun1 />
        <FormField
          control={form.form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>task</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="task"
                  // type="number"
                  // {...form.form.register("task", { valueAsNumber: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </>
  );
}

const ButtonRun1 = () => {
  const runSandboxAgent = async (task: string) => {
    const response = await fetch("/api/sandbox/run/agent", {
      method: "POST",
      body: JSON.stringify({ task }),
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <Button onClick={() => runSandboxAgent("请自我介绍, 告诉我你的能力.")}>
      运行 python 并返回结果
    </Button>
  );
};
