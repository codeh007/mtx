import {
  type AssistantAgentComponent,
  type AssistantAgentConfig,
  ModelTypes,
  type MtOpenAiChatCompletionClientComponent,
  ProviderTypes,
  type SocialTeamComponent,
  type TextMentionTermination,
} from "mtmaiapi";

export function get_default_social_team_component() {
  const social_team: SocialTeamComponent = {
    provider: ProviderTypes.MTMAI_TEAMS_TEAM_SOCIAL_SOCIAL_TEAM,
    component_type: "team",
    label: "social team",
    description: "social team",
    config: {
      username: "user123",
      password: "pass123",
      otp_key: "otp123",
      proxy_url: "http://localhost:8080",
      participants: [
        {
          provider: ProviderTypes.AUTOGEN_AGENTCHAT_AGENTS_ASSISTANT_AGENT,
          label: "assistant",
          component_type: "agent",
          description: "assistant",
          config: {
            name: "user123",
            description: "pass123",
            model_client: {
              provider:
                ProviderTypes.MTMAI_MODEL_CLIENT_MT_OPEN_AI_CHAT_COMPLETION_CLIENT,
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
        provider:
          ProviderTypes.AUTOGEN_AGENTCHAT_CONDITIONS_TEXT_MENTION_TERMINATION,
        config: {
          text: "TERMINATE",
        },
      } satisfies TextMentionTermination,
    },
  };

  return social_team;
}
