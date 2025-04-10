import { createLazyFileRoute } from "@tanstack/react-router";
import {
  type AssistantAgentComponent,
  type AssistantAgentConfig,
  ModelTypes,
  type MtOpenAiChatCompletionClientComponent,
  ProviderTypes,
  type Terminations,
} from "mtmaiapi";
import { zSocialTeamComponent } from "mtmaiapi/gomtmapi/zod.gen";
import { ZForm, ZFormToolbar, useZodFormV2 } from "mtxuilib/mt/form/ZodForm";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "mtxuilib/ui/form";
import { Input } from "mtxuilib/ui/input";
import { useFormContext } from "react-hook-form";
import { useWorkbenchStore } from "../../../stores/workbrench.store";

export const Route = createLazyFileRoute("/session/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleRunTeam = useWorkbenchStore((x) => x.handleRunTeam);
  const form = useZodFormV2({
    schema: zSocialTeamComponent,
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
        proxy_url: "http://localhost:8080",
        max_turns: 10,
        participants: [
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
                  api_key: "sk-proj-123",
                  model: "gpt-4o",
                  model_type: ModelTypes.OPEN_AI_CHAT_COMPLETION_CLIENT,
                },
              } satisfies MtOpenAiChatCompletionClientComponent,
            } satisfies AssistantAgentConfig,
          } satisfies AssistantAgentComponent,
        ],
        termination_condition: {
          provider: ProviderTypes.TEXT_MENTION_TERMINATION,
          config: {
            text: "TERMINATE",
          },
        } satisfies Terminations,
      },
    },
    handleSubmit: (values) => {
      // const social_team: SocialTeamComponent = {
      //   provider: ProviderTypes.SOCIAL_TEAM,
      //   component_type: "team",
      //   label: "social team",
      //   description: "social team",
      //   config: {
      //     username: "user123",
      //     password: "pass123",
      //     otp_key: "otp123",
      //     proxy_url: "http://localhost:8080",
      //     max_turns: 10,
      //     participants: [
      //       {
      //         provider: ProviderTypes.ASSISTANT_AGENT,
      //         label: "assistant",
      //         component_type: "agent",
      //         description: "assistant",
      //         config: {
      //           name: "user123",
      //           description: "pass123",
      //           tools: [],
      //           reflect_on_tool_use: false,
      //           tool_call_summary_format: "{result}",
      //           model_client: {
      //             provider: ProviderTypes.MT_OPEN_AI_CHAT_COMPLETION_CLIENT,
      //             config: {
      //               api_key: "sk-proj-123",
      //               model: "gpt-4o",
      //               model_type: ModelTypes.OPEN_AI_CHAT_COMPLETION_CLIENT,
      //             },
      //           } satisfies MtOpenAiChatCompletionClientComponent,
      //         } satisfies AssistantAgentConfig,
      //       } satisfies AssistantAgentComponent,
      //     ],
      //     termination_condition: {
      //       provider: ProviderTypes.TEXT_MENTION_TERMINATION,
      //       config: {
      //         text: "TERMINATE",
      //       },
      //     } satisfies Terminations,
      //   },
      // };
      handleRunTeam({
        component: values,
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

        <ParticipantsFields />
      </ZForm>
      <ZFormToolbar form={form.form} />
    </>
  );
}

export const ParticipantsFields = () => {
  const form = useFormContext();
  return (
    <>
      <h1>ParticipantsFields</h1>
    </>
  );
};
