import { createLazyFileRoute } from "@tanstack/react-router";
import {
  type AssistantAgent,
  type AssistantAgentConfig,
  ModelTypes,
  type MtOpenAiChatCompletionClient,
  ProviderTypes,
  type TeamComponent,
  type Terminations,
} from "mtmaiapi";
import { zSocialTeam } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useState } from "react";
import { MtmaiuiConfig } from "../../../lib/core/config";
import { useWorkbenchStore } from "../../../stores/workbrench.store";
import { ParticipantsInput } from "./ParticipantsInput";

export const Route = createLazyFileRoute("/session/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleRunTeam = useWorkbenchStore((x) => x.handleRunTeam);

  const [participants, setParticipants] = useState<AssistantAgent[]>([
    {
      provider: ProviderTypes.ASSISTANT_AGENT,
      label: "assistant",
      component_type: "agent",
      description: "assistant",
      config: {
        name: "user123",
        description: "pass123",
        tools: [],
        reflect_on_tool_use: false,
        tool_call_summary_format: "{result}",
        model_client: {
          provider: ProviderTypes.MT_OPEN_AI_CHAT_COMPLETION_CLIENT,
          config: {
            api_key: MtmaiuiConfig.default_open_ai_key,
            base_url: MtmaiuiConfig.default_open_base_url,
            model: "gpt-4o",
            model_type: ModelTypes.OPEN_AI_CHAT_COMPLETION_CLIENT,
          },
        } satisfies MtOpenAiChatCompletionClient,
      } satisfies AssistantAgentConfig,
    } satisfies AssistantAgent,
  ]);
  const form = useZodFormV2({
    schema: zSocialTeam,
    toastValidateError: true,
    defaultValues: {
      provider: ProviderTypes.SOCIAL_TEAM,
      component_type: "team",
      label: "social team",
      description: "social team",
      config: {
        username: "saibichquyenll2015",
        password: "qSJPn07c7",
        otp_key: "MCF3M4XZHTFWKYXUGV4CQX3LFXMKMWFP",
        proxy_url: "http://localhost:10809",
        max_turns: 10,
        participants: participants,
        termination_condition: {
          provider: ProviderTypes.TEXT_MENTION_TERMINATION,
          config: {
            text: "TERMINATE",
          },
        } satisfies Terminations,
      },
    },
    handleSubmit: (values) => {
      handleRunTeam({
        component: values as TeamComponent,
        session_id: "123",
        task: "告诉我,您能帮我做什么事情?",
        init_state: {},
      });
    },
  });

  return (
    <>
      <ZForm {...form}>
        <h1>新建社交媒体会话</h1>
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
        <FormField
          control={form.form.control}
          name="config.password"
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
          name="config.otp_key"
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

        <ParticipantsInput
          participants={participants}
          onChange={setParticipants}
        />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </>
  );
}
