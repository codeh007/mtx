import { createLazyFileRoute } from "@tanstack/react-router";
import { AgentEventType } from "mtmaiapi";
import { zSocialTeamConfig } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import { Button } from "mtxuilib/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { get_default_social_team_component } from "../../../components/autogen_views/team/inline_teams/teams";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleNewChat = useWorkbenchStore((x) => x.handleNewChat);
  const handleRunTeam = useWorkbenchStore((x) => x.handleRunTeam);

  const form = useZodFormV2({
    schema: zSocialTeamConfig,
    toastValidateError: true,
    defaultValues: {
      username: "saibichquyenll2015",
      password: "qSJPn07c7",
      otp_key: "MCF3M4XZHTFWKYXUGV4CQX3LFXMKMWFP",
    },
    handleSubmit: (values) => {
      handleNewChat({
        type: AgentEventType.START_NEW_CHAT_INPUT,
        task: "你好",
        config: values,
      });
    },
  });

  return (
    <>
      <ZForm {...form}>
        <h1>新建社交媒体会话</h1>
        <FormField
          control={form.form.control}
          name="username"
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
        <FormField
          control={form.form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.form.control}
          name="otp_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>otp_key</FormLabel>
              <FormControl>
                <Input {...field} placeholder="otp_key" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />

      <Button
        onClick={() => {
          const team = get_default_social_team_component();
          handleRunTeam({
            component: team,
            session_id: "123",
            task: "告诉我,您能帮我做什么事情?",
            init_state: {},
          });
        }}
      >
        运行团队
      </Button>
    </>
  );
}
