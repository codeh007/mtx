"use client";

import { useQuery } from "@tanstack/react-query";
import { AgentEventType } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { ZForm, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";

interface SiteEditProps {
  siteId: string;
}
export const SiteEdit = (props: SiteEditProps) => {
  const { siteId } = props;
  const { data } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => fetch(`/api/sites/${siteId}`).then((res) => res.json()),
  });
  const form = useZodFormV2({
    schema: zSocialTeam,
    toastValidateError: true,
    defaultValues: team,
    handleSubmit: (values) => {
      handleHumanInput({
        // component: values as TeamComponent,
        // session_id: "123",
        // task: "告诉我,您能帮我做什么事情?",
        // init_state: {},
        type: AgentEventType.CHAT_MESSAGE_INPUT,
        content: "告诉我,您能帮我做什么事情?",
      });
    },
  });

  return (
    <div>
      SiteEdit
      <DebugValue data={data} />
      <ZForm form={form.form}>
        <h1>团队编辑</h1>
        <FormField
          control={form.form.control}
          name="config.username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
    </div>
  );
};
