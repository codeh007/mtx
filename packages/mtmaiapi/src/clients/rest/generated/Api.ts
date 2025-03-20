/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AcceptInviteRequest,
  AgEvent,
  AgEventList,
  AgState,
  AgStateList,
  AgStateUpsert,
  APIError,
  APIErrors,
  APIMeta,
  Artifact,
  ArtifactList,
  AssignedAction,
  Blog,
  BlogList,
  Browser,
  BrowserList,
  CancelEventRequest,
  ChatMessage,
  ChatMessageList,
  ChatMessageUpsert,
  ChatSession,
  ChatSessionList,
  CommonResult,
  CreateAPITokenRequest,
  CreateAPITokenResponse,
  CreateBlogRequest,
  CreatePostRequest,
  CreateSiteHostRequest,
  CreateSiteRequest,
  CreateSNSIntegrationRequest,
  CreateTenantAlertEmailGroupRequest,
  CreateTenantInviteRequest,
  CreateTenantRequest,
  CronWorkflowsList,
  CronWorkflowsOrderByField,
  Endpoint,
  EndpointList,
  Env,
  EnvList,
  Event,
  EventData,
  EventKey,
  EventKeyList,
  EventList,
  EventOrderByDirection,
  EventOrderByField,
  EventSearch,
  FlowNames,
  FrontendConfig,
  Gallery,
  GalleryList,
  HfAccount,
  ListAPIMetaIntegration,
  ListAPITokensResponse,
  ListSlackWebhooks,
  ListSNSIntegrations,
  LogLineLevelField,
  LogLineList,
  LogLineOrderByDirection,
  LogLineOrderByField,
  LogLineSearch,
  Model,
  ModelList,
  ModelRun,
  MtComponent,
  MtComponentList,
  MtComponentNew,
  MtResource,
  MtResourceList,
  MtResourceUpsert,
  Platform,
  PlatformAccount,
  PlatformAccountList,
  PlatformList,
  Post,
  PostList,
  PromptList,
  Proxy,
  ProxyList,
  RateLimitList,
  RateLimitOrderByDirection,
  RateLimitOrderByField,
  RejectInviteRequest,
  ReplayWorkflowRunsRequest,
  ReplayWorkflowRunsResponse,
  RerunStepRunRequest,
  ScheduledRunStatus,
  ScheduledWorkflows,
  ScheduledWorkflowsList,
  ScheduledWorkflowsOrderByField,
  SiderbarConfig,
  Site,
  SiteHost,
  SiteHostList,
  SiteList,
  SNSIntegration,
  StepRun,
  StepRunArchiveList,
  StepRunEventList,
  Tenant,
  TenantAlertEmailGroup,
  TenantAlertEmailGroupList,
  TenantAlertingSettings,
  TenantInvite,
  TenantInviteList,
  TenantMember,
  TenantMemberList,
  TenantParameter,
  TenantQueueMetrics,
  TenantResourcePolicy,
  TenantSetting,
  TenantStepRunQueueMetrics,
  TriggerWorkflowRunRequest,
  UiAgentState,
  UpdateBlogRequest,
  UpdateEndpointRequest,
  UpdateSiteRequest,
  UpdateTenantAlertEmailGroupRequest,
  UpdateTenantInviteRequest,
  UpdateTenantRequest,
  UpdateWorkerRequest,
  User,
  UserChangePasswordRequest,
  UserLoginRequest,
  UserRegisterRequest,
  UserTenantMembershipsList,
  WebhookWorkerCreated,
  WebhookWorkerCreateRequest,
  WebhookWorkerListResponse,
  WebhookWorkerRequestListResponse,
  Worker,
  WorkerConfig,
  WorkerList,
  Workflow,
  WorkflowID,
  WorkflowKindList,
  WorkflowList,
  WorkflowMetrics,
  WorkflowRun,
  WorkflowRunList,
  WorkflowRunOrderByDirection,
  WorkflowRunOrderByField,
  WorkflowRunsCancelRequest,
  WorkflowRunShape,
  WorkflowRunsMetrics,
  WorkflowRunStatus,
  WorkflowRunStatusList,
  WorkflowUpdateRequest,
  WorkflowVersion,
  WorkflowWorkersCount,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Gets the readiness status
   *
   * @tags Healthcheck
   * @name ReadinessGet
   * @summary Get readiness
   * @request GET:/api/ready
   */
  readinessGet = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/api/ready`,
      method: "GET",
      ...params,
    });
  /**
   * @description Gets the liveness status
   *
   * @tags Healthcheck
   * @name LivenessGet
   * @summary Get liveness
   * @request GET:/api/live
   */
  livenessGet = (params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/api/live`,
      method: "GET",
      ...params,
    });
  /**
   * @description Gets metadata for the Hatchet instance
   *
   * @tags Metadata
   * @name MetadataGet
   * @summary Get metadata
   * @request GET:/api/v1/meta
   */
  metadataGet = (params: RequestParams = {}) =>
    this.request<APIMeta, APIErrors>({
      path: `/api/v1/meta`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description Gets metadata for the Hatchet cloud instance
   *
   * @tags Metadata
   * @name CloudMetadataGet
   * @summary Get cloud metadata
   * @request GET:/api/v1/cloud/metadata
   */
  cloudMetadataGet = (params: RequestParams = {}) =>
    this.request<APIErrors, APIErrors>({
      path: `/api/v1/cloud/metadata`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description List all integrations
   *
   * @tags Metadata
   * @name MetadataListIntegrations
   * @summary List integrations
   * @request GET:/api/v1/meta/integrations
   * @secure
   */
  metadataListIntegrations = (params: RequestParams = {}) =>
    this.request<ListAPIMetaIntegration, APIErrors>({
      path: `/api/v1/meta/integrations`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Logs in a user.
   *
   * @tags User
   * @name UserUpdateLogin
   * @summary Login user
   * @request POST:/api/v1/users/login
   */
  userUpdateLogin = (data: UserLoginRequest, params: RequestParams = {}) =>
    this.request<User, APIErrors>({
      path: `/api/v1/users/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Starts the OAuth flow
   *
   * @tags User
   * @name UserUpdateGoogleOauthStart
   * @summary Start OAuth flow
   * @request GET:/api/v1/users/google/start
   */
  userUpdateGoogleOauthStart = (params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/v1/users/google/start`,
      method: "GET",
      ...params,
    });
  /**
   * @description Completes the OAuth flow
   *
   * @tags User
   * @name UserUpdateGoogleOauthCallback
   * @summary Complete OAuth flow
   * @request GET:/api/v1/users/google/callback
   */
  userUpdateGoogleOauthCallback = (params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/v1/users/google/callback`,
      method: "GET",
      ...params,
    });
  /**
   * @description Starts the OAuth flow
   *
   * @tags User
   * @name UserUpdateGithubOauthStart
   * @summary Start OAuth flow
   * @request GET:/api/v1/users/github/start
   */
  userUpdateGithubOauthStart = (params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/v1/users/github/start`,
      method: "GET",
      ...params,
    });
  /**
   * @description Completes the OAuth flow
   *
   * @tags User
   * @name UserUpdateGithubOauthCallback
   * @summary Complete OAuth flow
   * @request GET:/api/v1/users/github/callback
   */
  userUpdateGithubOauthCallback = (params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/v1/users/github/callback`,
      method: "GET",
      ...params,
    });
  /**
   * @description Starts the OAuth flow
   *
   * @tags User
   * @name UserUpdateSlackOauthStart
   * @request GET:/api/v1/tenants/{tenant}/slack/start
   * @secure
   */
  userUpdateSlackOauthStart = (tenant: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/v1/tenants/${tenant}/slack/start`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description Completes the OAuth flow
   *
   * @tags User
   * @name UserUpdateSlackOauthCallback
   * @summary Complete OAuth flow
   * @request GET:/api/v1/users/slack/callback
   * @secure
   */
  userUpdateSlackOauthCallback = (params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/v1/users/slack/callback`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description List SNS integrations
   *
   * @tags SNS
   * @name SnsList
   * @summary List SNS integrations
   * @request GET:/api/v1/tenants/{tenant}/sns
   * @secure
   */
  snsList = (tenant: string, params: RequestParams = {}) =>
    this.request<ListSNSIntegrations, APIErrors>({
      path: `/api/v1/tenants/${tenant}/sns`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Create SNS integration
   *
   * @tags SNS
   * @name SnsCreate
   * @summary Create SNS integration
   * @request POST:/api/v1/tenants/{tenant}/sns
   * @secure
   */
  snsCreate = (
    tenant: string,
    data: CreateSNSIntegrationRequest,
    params: RequestParams = {},
  ) =>
    this.request<SNSIntegration, APIErrors>({
      path: `/api/v1/tenants/${tenant}/sns`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a new tenant alert email group
   *
   * @tags Tenant
   * @name AlertEmailGroupCreate
   * @summary Create tenant alert email group
   * @request POST:/api/v1/tenants/{tenant}/alerting-email-groups
   * @secure
   */
  alertEmailGroupCreate = (
    tenant: string,
    data: CreateTenantAlertEmailGroupRequest,
    params: RequestParams = {},
  ) =>
    this.request<TenantAlertEmailGroup, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/alerting-email-groups`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Gets a list of tenant alert email groups
   *
   * @tags Tenant
   * @name AlertEmailGroupList
   * @summary List tenant alert email groups
   * @request GET:/api/v1/tenants/{tenant}/alerting-email-groups
   * @secure
   */
  alertEmailGroupList = (tenant: string, params: RequestParams = {}) =>
    this.request<TenantAlertEmailGroupList, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/alerting-email-groups`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Gets the resource policy for a tenant
   *
   * @tags Tenant
   * @name TenantResourcePolicyGet
   * @summary Create tenant alert email group
   * @request GET:/api/v1/tenants/{tenant}/resource-policy
   * @secure
   */
  tenantResourcePolicyGet = (tenant: string, params: RequestParams = {}) =>
    this.request<TenantResourcePolicy, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/resource-policy`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Updates a tenant alert email group
   *
   * @tags Tenant
   * @name AlertEmailGroupUpdate
   * @summary Update tenant alert email group
   * @request PATCH:/api/v1/alerting-email-groups/{alert-email-group}
   * @secure
   */
  alertEmailGroupUpdate = (
    alertEmailGroup: string,
    data: UpdateTenantAlertEmailGroupRequest,
    params: RequestParams = {},
  ) =>
    this.request<TenantAlertEmailGroup, APIErrors | APIError>({
      path: `/api/v1/alerting-email-groups/${alertEmailGroup}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Deletes a tenant alert email group
   *
   * @tags Tenant
   * @name AlertEmailGroupDelete
   * @summary Delete tenant alert email group
   * @request DELETE:/api/v1/alerting-email-groups/{alert-email-group}
   * @secure
   */
  alertEmailGroupDelete = (
    alertEmailGroup: string,
    params: RequestParams = {},
  ) =>
    this.request<void, APIErrors | APIError>({
      path: `/api/v1/alerting-email-groups/${alertEmailGroup}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Delete SNS integration
   *
   * @tags SNS
   * @name SnsDelete
   * @summary Delete SNS integration
   * @request DELETE:/api/v1/sns/{sns}
   * @secure
   */
  snsDelete = (sns: string, params: RequestParams = {}) =>
    this.request<void, APIErrors>({
      path: `/api/v1/sns/${sns}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description List Slack webhooks
   *
   * @tags Slack
   * @name SlackWebhookList
   * @summary List Slack integrations
   * @request GET:/api/v1/tenants/{tenant}/slack
   * @secure
   */
  slackWebhookList = (tenant: string, params: RequestParams = {}) =>
    this.request<ListSlackWebhooks, APIErrors>({
      path: `/api/v1/tenants/${tenant}/slack`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Delete Slack webhook
   *
   * @tags Slack
   * @name SlackWebhookDelete
   * @summary Delete Slack webhook
   * @request DELETE:/api/v1/slack/{slack}
   * @secure
   */
  slackWebhookDelete = (slack: string, params: RequestParams = {}) =>
    this.request<void, APIErrors>({
      path: `/api/v1/slack/${slack}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Gets the current user
   *
   * @tags User
   * @name UserGetCurrent
   * @summary Get current user
   * @request GET:/api/v1/users/current
   * @secure
   */
  userGetCurrent = (params: RequestParams = {}) =>
    this.request<User, APIErrors>({
      path: `/api/v1/users/current`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update a user password.
   *
   * @tags User
   * @name UserUpdatePassword
   * @summary Change user password
   * @request POST:/api/v1/users/password
   * @secure
   */
  userUpdatePassword = (
    data: UserChangePasswordRequest,
    params: RequestParams = {},
  ) =>
    this.request<User, APIErrors>({
      path: `/api/v1/users/password`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Registers a user.
   *
   * @tags User
   * @name UserCreate
   * @summary Register user
   * @request POST:/api/v1/users/register
   */
  userCreate = (data: UserRegisterRequest, params: RequestParams = {}) =>
    this.request<User, APIErrors>({
      path: `/api/v1/users/register`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Logs out a user.
   *
   * @tags User
   * @name UserUpdateLogout
   * @summary Logout user
   * @request POST:/api/v1/users/logout
   * @secure
   */
  userUpdateLogout = (params: RequestParams = {}) =>
    this.request<User, APIErrors>({
      path: `/api/v1/users/logout`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Lists all tenant memberships for the current user
   *
   * @tags User
   * @name TenantMembershipsList
   * @request GET:/api/v1/users/memberships
   * @secure
   */
  tenantMembershipsList = (params: RequestParams = {}) =>
    this.request<UserTenantMembershipsList, APIErrors>({
      path: `/api/v1/users/memberships`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Lists all tenant invites for the current user
   *
   * @tags Tenant
   * @name UserListTenantInvites
   * @summary List tenant invites
   * @request GET:/api/v1/users/invites
   * @secure
   */
  userListTenantInvites = (params: RequestParams = {}) =>
    this.request<TenantInviteList, APIErrors>({
      path: `/api/v1/users/invites`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Accepts a tenant invite
   *
   * @tags Tenant
   * @name TenantInviteAccept
   * @summary Accept tenant invite
   * @request POST:/api/v1/users/invites/accept
   * @secure
   */
  tenantInviteAccept = (
    data: AcceptInviteRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, APIErrors | APIError>({
      path: `/api/v1/users/invites/accept`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Rejects a tenant invite
   *
   * @tags Tenant
   * @name TenantInviteReject
   * @summary Reject tenant invite
   * @request POST:/api/v1/users/invites/reject
   * @secure
   */
  tenantInviteReject = (
    data: RejectInviteRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, APIErrors | APIError>({
      path: `/api/v1/users/invites/reject`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description Creates a new tenant
   *
   * @tags Tenant
   * @name TenantCreate
   * @summary Create tenant
   * @request POST:/api/v1/tenants
   * @secure
   */
  tenantCreate = (data: CreateTenantRequest, params: RequestParams = {}) =>
    this.request<Tenant, APIErrors | APIError>({
      path: `/api/v1/tenants`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing tenant
   *
   * @tags Tenant
   * @name TenantUpdate
   * @summary Update tenant
   * @request PATCH:/api/v1/tenants/{tenant}
   * @secure
   */
  tenantUpdate = (
    tenant: string,
    data: UpdateTenantRequest,
    params: RequestParams = {},
  ) =>
    this.request<Tenant, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Gets the alerting settings for a tenant
   *
   * @tags Tenant
   * @name TenantAlertingSettingsGet
   * @summary Get tenant alerting settings
   * @request GET:/api/v1/tenants/{tenant}/alerting/settings
   * @secure
   */
  tenantAlertingSettingsGet = (tenant: string, params: RequestParams = {}) =>
    this.request<TenantAlertingSettings, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/alerting/settings`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a new tenant invite
   *
   * @tags Tenant
   * @name TenantInviteCreate
   * @summary Create tenant invite
   * @request POST:/api/v1/tenants/{tenant}/invites
   * @secure
   */
  tenantInviteCreate = (
    tenant: string,
    data: CreateTenantInviteRequest,
    params: RequestParams = {},
  ) =>
    this.request<TenantInvite, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/invites`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Gets a list of tenant invites
   *
   * @tags Tenant
   * @name TenantInviteList
   * @summary List tenant invites
   * @request GET:/api/v1/tenants/{tenant}/invites
   * @secure
   */
  tenantInviteList = (tenant: string, params: RequestParams = {}) =>
    this.request<TenantInviteList, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/invites`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Updates a tenant invite
   *
   * @name TenantInviteUpdate
   * @summary Update invite
   * @request PATCH:/api/v1/tenants/{tenant}/invites/{tenant-invite}
   * @secure
   */
  tenantInviteUpdate = (
    tenant: string,
    tenantInvite: string,
    data: UpdateTenantInviteRequest,
    params: RequestParams = {},
  ) =>
    this.request<TenantInvite, APIErrors>({
      path: `/api/v1/tenants/${tenant}/invites/${tenantInvite}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Deletes a tenant invite
   *
   * @name TenantInviteDelete
   * @summary Delete invite
   * @request DELETE:/api/v1/tenants/{tenant}/invites/{tenant-invite}
   * @secure
   */
  tenantInviteDelete = (
    tenant: string,
    tenantInvite: string,
    params: RequestParams = {},
  ) =>
    this.request<TenantInvite, APIErrors>({
      path: `/api/v1/tenants/${tenant}/invites/${tenantInvite}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Create an API token for a tenant
   *
   * @tags API Token
   * @name ApiTokenCreate
   * @summary Create API Token
   * @request POST:/api/v1/tenants/{tenant}/api-tokens
   * @secure
   */
  apiTokenCreate = (
    tenant: string,
    data: CreateAPITokenRequest,
    params: RequestParams = {},
  ) =>
    this.request<CreateAPITokenResponse, APIErrors>({
      path: `/api/v1/tenants/${tenant}/api-tokens`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description List API tokens for a tenant
   *
   * @tags API Token
   * @name ApiTokenList
   * @summary List API Tokens
   * @request GET:/api/v1/tenants/{tenant}/api-tokens
   * @secure
   */
  apiTokenList = (tenant: string, params: RequestParams = {}) =>
    this.request<ListAPITokensResponse, APIErrors>({
      path: `/api/v1/tenants/${tenant}/api-tokens`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Revoke an API token for a tenant
   *
   * @tags API Token
   * @name ApiTokenUpdateRevoke
   * @summary Revoke API Token
   * @request POST:/api/v1/api-tokens/{api-token}
   * @secure
   */
  apiTokenUpdateRevoke = (apiToken: string, params: RequestParams = {}) =>
    this.request<void, APIErrors>({
      path: `/api/v1/api-tokens/${apiToken}`,
      method: "POST",
      secure: true,
      ...params,
    });
  /**
   * @description Get the queue metrics for the tenant
   *
   * @tags Workflow
   * @name TenantGetQueueMetrics
   * @summary Get workflow metrics
   * @request GET:/api/v1/tenants/{tenant}/queue-metrics
   * @secure
   */
  tenantGetQueueMetrics = (
    tenant: string,
    query?: {
      /** A list of workflow IDs to filter by */
      workflows?: WorkflowID[];
      /**
       * A list of metadata key value pairs to filter by
       * @example ["key1:value1","key2:value2"]
       */
      additionalMetadata?: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<TenantQueueMetrics, APIErrors>({
      path: `/api/v1/tenants/${tenant}/queue-metrics`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get the queue metrics for the tenant
   *
   * @tags Tenant
   * @name TenantGetStepRunQueueMetrics
   * @summary Get step run metrics
   * @request GET:/api/v1/tenants/{tenant}/step-run-queue-metrics
   * @secure
   */
  tenantGetStepRunQueueMetrics = (tenant: string, params: RequestParams = {}) =>
    this.request<TenantStepRunQueueMetrics, APIErrors>({
      path: `/api/v1/tenants/${tenant}/step-run-queue-metrics`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Lists all events for a tenant.
   *
   * @tags Event
   * @name EventList
   * @summary List events
   * @request GET:/api/v1/tenants/{tenant}/events
   * @secure
   */
  eventList = (
    tenant: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int64
       */
      limit?: number;
      /** A list of keys to filter by */
      keys?: EventKey[];
      /** A list of workflow IDs to filter by */
      workflows?: WorkflowID[];
      /** A list of workflow run statuses to filter by */
      statuses?: WorkflowRunStatusList;
      /** The search query to filter for */
      search?: EventSearch;
      /** What to order by */
      orderByField?: EventOrderByField;
      /** The order direction */
      orderByDirection?: EventOrderByDirection;
      /**
       * A list of metadata key value pairs to filter by
       * @example ["key1:value1","key2:value2"]
       */
      additionalMetadata?: string[];
      /** A list of event ids to filter by */
      eventIds?: string[];
    },
    params: RequestParams = {},
  ) =>
    this.request<EventList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/events`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Cancels all runs for a list of events.
   *
   * @tags Event
   * @name EventUpdateCancel
   * @summary Replay events
   * @request POST:/api/v1/tenants/{tenant}/events/cancel
   * @secure
   */
  eventUpdateCancel = (
    tenant: string,
    data: CancelEventRequest,
    params: RequestParams = {},
  ) =>
    this.request<
      {
        workflowRunIds?: string[];
      },
      APIErrors
    >({
      path: `/api/v1/tenants/${tenant}/events/cancel`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Lists all rate limits for a tenant.
   *
   * @tags Rate Limits
   * @name RateLimitList
   * @summary List rate limits
   * @request GET:/api/v1/tenants/{tenant}/rate-limits
   * @secure
   */
  rateLimitList = (
    tenant: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int64
       */
      limit?: number;
      /** The search query to filter for */
      search?: string;
      /** What to order by */
      orderByField?: RateLimitOrderByField;
      /** The order direction */
      orderByDirection?: RateLimitOrderByDirection;
    },
    params: RequestParams = {},
  ) =>
    this.request<RateLimitList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/rate-limits`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Gets a list of tenant members
   *
   * @tags Tenant
   * @name TenantMemberList
   * @summary List tenant members
   * @request GET:/api/v1/tenants/{tenant}/members
   * @secure
   */
  tenantMemberList = (tenant: string, params: RequestParams = {}) =>
    this.request<TenantMemberList, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/members`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a member from a tenant
   *
   * @tags Tenant
   * @name TenantMemberDelete
   * @summary Delete a tenant member
   * @request DELETE:/api/v1/tenants/{tenant}/members/{member}
   * @secure
   */
  tenantMemberDelete = (
    tenant: string,
    member: string,
    params: RequestParams = {},
  ) =>
    this.request<TenantMember, APIErrors>({
      path: `/api/v1/tenants/${tenant}/members/${member}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get an event.
   *
   * @tags Event
   * @name EventGet
   * @summary Get event data
   * @request GET:/api/v1/events/{event}
   * @secure
   */
  eventGet = (event: string, params: RequestParams = {}) =>
    this.request<Event, APIErrors>({
      path: `/api/v1/events/${event}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get the data for an event.
   *
   * @tags Event
   * @name EventDataGet
   * @summary Get event data
   * @request GET:/api/v1/events/{event}/data
   * @secure
   */
  eventDataGet = (event: string, params: RequestParams = {}) =>
    this.request<EventData, APIErrors>({
      path: `/api/v1/events/${event}/data`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Lists all event keys for a tenant.
   *
   * @tags Event
   * @name EventKeyList
   * @summary List event keys
   * @request GET:/api/v1/tenants/{tenant}/events/keys
   * @secure
   */
  eventKeyList = (tenant: string, params: RequestParams = {}) =>
    this.request<EventKeyList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/events/keys`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get all workflows for a tenant
   *
   * @tags Workflow
   * @name WorkflowList
   * @summary Get workflows
   * @request GET:/api/v1/tenants/{tenant}/workflows
   * @secure
   */
  workflowList = (
    tenant: string,
    query?: {
      /**
       * The number to skip
       * @format int
       * @default 0
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int
       * @default 50
       */
      limit?: number;
      /** Search by name */
      name?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<WorkflowList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflows`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get all scheduled workflow runs for a tenant
   *
   * @tags Workflow
   * @name WorkflowScheduledList
   * @summary Get scheduled workflow runs
   * @request GET:/api/v1/tenants/{tenant}/workflows/scheduled
   * @secure
   */
  workflowScheduledList = (
    tenant: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int64
       */
      limit?: number;
      /** The order by field */
      orderByField?: ScheduledWorkflowsOrderByField;
      /** The order by direction */
      orderByDirection?: WorkflowRunOrderByDirection;
      /**
       * The workflow id to get runs for.
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      workflowId?: string;
      /**
       * The parent workflow run id
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      parentWorkflowRunId?: string;
      /**
       * The parent step run id
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      parentStepRunId?: string;
      /**
       * A list of metadata key value pairs to filter by
       * @example ["key1:value1","key2:value2"]
       */
      additionalMetadata?: string[];
      /** A list of scheduled run statuses to filter by */
      statuses?: ScheduledRunStatus[];
    },
    params: RequestParams = {},
  ) =>
    this.request<ScheduledWorkflowsList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflows/scheduled`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a scheduled workflow run for a tenant
   *
   * @tags Workflow
   * @name WorkflowScheduledGet
   * @summary Get scheduled workflow run
   * @request GET:/api/v1/tenants/{tenant}/workflows/scheduled/{scheduledId}
   * @secure
   */
  workflowScheduledGet = (
    tenant: string,
    scheduledId: string,
    params: RequestParams = {},
  ) =>
    this.request<ScheduledWorkflows, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflows/scheduled/${scheduledId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a scheduled workflow run for a tenant
   *
   * @tags Workflow
   * @name WorkflowScheduledDelete
   * @summary Delete scheduled workflow run
   * @request DELETE:/api/v1/tenants/{tenant}/workflows/scheduled/{scheduledId}
   * @secure
   */
  workflowScheduledDelete = (
    tenant: string,
    scheduledId: string,
    params: RequestParams = {},
  ) =>
    this.request<void, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/workflows/scheduled/${scheduledId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Get all cron job workflow runs for a tenant
   *
   * @tags Workflow
   * @name CronWorkflowList
   * @summary Get cron job workflows
   * @request GET:/api/v1/tenants/{tenant}/workflows/crons
   * @secure
   */
  cronWorkflowList = (
    tenant: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int64
       */
      limit?: number;
      /**
       * The workflow id to get runs for.
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      workflowId?: string;
      /**
       * A list of metadata key value pairs to filter by
       * @example ["key1:value1","key2:value2"]
       */
      additionalMetadata?: string[];
      /** The order by field */
      orderByField?: CronWorkflowsOrderByField;
      /** The order by direction */
      orderByDirection?: WorkflowRunOrderByDirection;
    },
    params: RequestParams = {},
  ) =>
    this.request<CronWorkflowsList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflows/crons`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Cancel a batch of workflow runs
   *
   * @tags Workflow Run
   * @name WorkflowRunCancel
   * @summary Cancel workflow runs
   * @request POST:/api/v1/tenants/{tenant}/workflows/cancel
   * @secure
   */
  workflowRunCancel = (
    tenant: string,
    data: WorkflowRunsCancelRequest,
    params: RequestParams = {},
  ) =>
    this.request<
      {
        workflowRunIds?: string[];
      },
      APIErrors
    >({
      path: `/api/v1/tenants/${tenant}/workflows/cancel`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a workflow for a tenant
   *
   * @tags Workflow
   * @name WorkflowGet
   * @summary Get workflow
   * @request GET:/api/v1/workflows/{workflow}
   * @secure
   */
  workflowGet = (workflow: string, params: RequestParams = {}) =>
    this.request<Workflow, APIErrors>({
      path: `/api/v1/workflows/${workflow}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Delete a workflow for a tenant
   *
   * @tags Workflow
   * @name WorkflowDelete
   * @summary Delete workflow
   * @request DELETE:/api/v1/workflows/{workflow}
   * @secure
   */
  workflowDelete = (workflow: string, params: RequestParams = {}) =>
    this.request<void, APIErrors>({
      path: `/api/v1/workflows/${workflow}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Update a workflow for a tenant
   *
   * @tags Workflow
   * @name WorkflowUpdate
   * @summary Update workflow
   * @request PATCH:/api/v1/workflows/{workflow}
   * @secure
   */
  workflowUpdate = (
    workflow: string,
    data: WorkflowUpdateRequest,
    params: RequestParams = {},
  ) =>
    this.request<Workflow, APIErrors>({
      path: `/api/v1/workflows/${workflow}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a workflow version for a tenant
   *
   * @tags Workflow
   * @name WorkflowVersionGet
   * @summary Get workflow version
   * @request GET:/api/v1/workflows/{workflow}/versions
   * @secure
   */
  workflowVersionGet = (
    workflow: string,
    query?: {
      /**
       * The workflow version. If not supplied, the latest version is fetched.
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<WorkflowVersion, APIErrors>({
      path: `/api/v1/workflows/${workflow}/versions`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Trigger a new workflow run for a tenant
   *
   * @tags Workflow Run
   * @name WorkflowRunCreate
   * @summary Trigger workflow run
   * @request POST:/api/v1/workflows/{workflow}/trigger
   * @secure
   */
  workflowRunCreate = (
    workflow: string,
    data: TriggerWorkflowRunRequest,
    query?: {
      /** The workflow version. If not supplied, the latest version is fetched. */
      version?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<WorkflowRun, APIErrors>({
      path: `/api/v1/workflows/${workflow}/trigger`,
      method: "POST",
      query: query,
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the metrics for a workflow version
   *
   * @tags Workflow
   * @name WorkflowGetMetrics
   * @summary Get workflow metrics
   * @request GET:/api/v1/workflows/{workflow}/metrics
   * @secure
   */
  workflowGetMetrics = (
    workflow: string,
    query?: {
      /** A status of workflow run statuses to filter by */
      status?: WorkflowRunStatus;
      /** A group key to filter metrics by */
      groupKey?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<WorkflowMetrics, APIErrors>({
      path: `/api/v1/workflows/${workflow}/metrics`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Lists log lines for a step run.
   *
   * @tags Log
   * @name LogLineList
   * @summary List log lines
   * @request GET:/api/v1/step-runs/{step-run}/logs
   * @secure
   */
  logLineList = (
    stepRun: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int64
       */
      limit?: number;
      /** A list of levels to filter by */
      levels?: LogLineLevelField;
      /** The search query to filter for */
      search?: LogLineSearch;
      /** What to order by */
      orderByField?: LogLineOrderByField;
      /** The order direction */
      orderByDirection?: LogLineOrderByDirection;
    },
    params: RequestParams = {},
  ) =>
    this.request<LogLineList, APIErrors>({
      path: `/api/v1/step-runs/${stepRun}/logs`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List events for a step run
   *
   * @tags Step Run
   * @name StepRunListEvents
   * @summary List events for step run
   * @request GET:/api/v1/step-runs/{step-run}/events
   * @secure
   */
  stepRunListEvents = (
    stepRun: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int64
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<StepRunEventList, APIErrors>({
      path: `/api/v1/step-runs/${stepRun}/events`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List events for all step runs for a workflow run
   *
   * @tags Step Run
   * @name WorkflowRunListStepRunEvents
   * @summary List events for all step runs for a workflow run
   * @request GET:/api/v1/tenants/{tenant}/workflow-runs/{workflow-run}/step-run-events
   * @secure
   */
  workflowRunListStepRunEvents = (
    tenant: string,
    workflowRun: string,
    query?: {
      /**
       * Last ID of the last event
       * @format int32
       */
      lastId?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<StepRunEventList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflow-runs/${workflowRun}/step-run-events`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description List archives for a step run
   *
   * @tags Step Run
   * @name StepRunListArchives
   * @summary List archives for step run
   * @request GET:/api/v1/step-runs/{step-run}/archives
   * @secure
   */
  stepRunListArchives = (
    stepRun: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int64
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<StepRunArchiveList, APIErrors>({
      path: `/api/v1/step-runs/${stepRun}/archives`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a count of the workers available for workflow
   *
   * @tags Workflow
   * @name WorkflowGetWorkersCount
   * @summary Get workflow worker count
   * @request GET:/api/v1/tenants/{tenant}/workflows/{workflow}/worker-count
   * @secure
   */
  workflowGetWorkersCount = (
    tenant: string,
    workflow: string,
    params: RequestParams = {},
  ) =>
    this.request<WorkflowWorkersCount, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflows/${workflow}/worker-count`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get all workflow runs for a tenant
   *
   * @tags Workflow
   * @name WorkflowRunList
   * @summary Get workflow runs
   * @request GET:/api/v1/tenants/{tenant}/workflows/runs
   * @secure
   */
  workflowRunList = (
    tenant: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /**
       * The number to limit by
       * @format int64
       */
      limit?: number;
      /**
       * The event id to get runs for.
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      eventId?: string;
      /**
       * The workflow id to get runs for.
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      workflowId?: string;
      /**
       * The parent workflow run id
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      parentWorkflowRunId?: string;
      /**
       * The parent step run id
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      parentStepRunId?: string;
      /** A list of workflow run statuses to filter by */
      statuses?: WorkflowRunStatusList;
      /** A list of workflow kinds to filter by */
      kinds?: WorkflowKindList;
      /**
       * A list of metadata key value pairs to filter by
       * @example ["key1:value1","key2:value2"]
       */
      additionalMetadata?: string[];
      /**
       * The time after the workflow run was created
       * @format date-time
       * @example "2021-01-01T00:00:00Z"
       */
      createdAfter?: string;
      /**
       * The time before the workflow run was created
       * @format date-time
       * @example "2021-01-01T00:00:00Z"
       */
      createdBefore?: string;
      /**
       * The time after the workflow run was finished
       * @format date-time
       * @example "2021-01-01T00:00:00Z"
       */
      finishedAfter?: string;
      /**
       * The time before the workflow run was finished
       * @format date-time
       * @example "2021-01-01T00:00:00Z"
       */
      finishedBefore?: string;
      /** The order by field */
      orderByField?: WorkflowRunOrderByField;
      /** The order by direction */
      orderByDirection?: WorkflowRunOrderByDirection;
    },
    params: RequestParams = {},
  ) =>
    this.request<WorkflowRunList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflows/runs`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Replays a list of workflow runs.
   *
   * @tags Workflow Run
   * @name WorkflowRunUpdateReplay
   * @summary Replay workflow runs
   * @request POST:/api/v1/tenants/{tenant}/workflow-runs/replay
   * @secure
   */
  workflowRunUpdateReplay = (
    tenant: string,
    data: ReplayWorkflowRunsRequest,
    params: RequestParams = {},
  ) =>
    this.request<ReplayWorkflowRunsResponse, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflow-runs/replay`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a summary of  workflow run metrics for a tenant
   *
   * @tags Workflow
   * @name WorkflowRunGetMetrics
   * @summary Get workflow runs metrics
   * @request GET:/api/v1/tenants/{tenant}/workflows/runs/metrics
   * @secure
   */
  workflowRunGetMetrics = (
    tenant: string,
    query?: {
      /**
       * The event id to get runs for.
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      eventId?: string;
      /**
       * The workflow id to get runs for.
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      workflowId?: string;
      /**
       * The parent workflow run id
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      parentWorkflowRunId?: string;
      /**
       * The parent step run id
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      parentStepRunId?: string;
      /**
       * A list of metadata key value pairs to filter by
       * @example ["key1:value1","key2:value2"]
       */
      additionalMetadata?: string[];
      /**
       * The time after the workflow run was created
       * @format date-time
       * @example "2021-01-01T00:00:00Z"
       */
      createdAfter?: string;
      /**
       * The time before the workflow run was created
       * @format date-time
       * @example "2021-01-01T00:00:00Z"
       */
      createdBefore?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<WorkflowRunsMetrics, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflows/runs/metrics`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a workflow run for a tenant
   *
   * @tags Workflow
   * @name WorkflowRunGet
   * @summary Get workflow run
   * @request GET:/api/v1/tenants/{tenant}/workflow-runs/{workflow-run}
   * @secure
   */
  workflowRunGet = (
    tenant: string,
    workflowRun: string,
    params: RequestParams = {},
  ) =>
    this.request<WorkflowRun, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflow-runs/${workflowRun}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a workflow run for a tenant
   *
   * @tags Workflow
   * @name WorkflowRunGetShape
   * @summary Get workflow run
   * @request GET:/api/v1/tenants/{tenant}/workflow-runs/{workflow-run}/shape
   * @secure
   */
  workflowRunGetShape = (
    tenant: string,
    workflowRun: string,
    params: RequestParams = {},
  ) =>
    this.request<WorkflowRunShape, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflow-runs/${workflowRun}/shape`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a step run by id
   *
   * @tags Step Run
   * @name StepRunGet
   * @summary Get step run
   * @request GET:/api/v1/tenants/{tenant}/step-runs/{step-run}
   * @secure
   */
  stepRunGet = (tenant: string, stepRun: string, params: RequestParams = {}) =>
    this.request<StepRun, APIErrors>({
      path: `/api/v1/tenants/${tenant}/step-runs/${stepRun}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Reruns a step run
   *
   * @tags Step Run
   * @name StepRunUpdateRerun
   * @summary Rerun step run
   * @request POST:/api/v1/tenants/{tenant}/step-runs/{step-run}/rerun
   * @secure
   */
  stepRunUpdateRerun = (
    tenant: string,
    stepRun: string,
    data: RerunStepRunRequest,
    params: RequestParams = {},
  ) =>
    this.request<StepRun, APIErrors>({
      path: `/api/v1/tenants/${tenant}/step-runs/${stepRun}/rerun`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Attempts to cancel a step run
   *
   * @tags Step Run
   * @name StepRunUpdateCancel
   * @summary Attempts to cancel a step run
   * @request POST:/api/v1/tenants/{tenant}/step-runs/{step-run}/cancel
   * @secure
   */
  stepRunUpdateCancel = (
    tenant: string,
    stepRun: string,
    params: RequestParams = {},
  ) =>
    this.request<StepRun, APIErrors>({
      path: `/api/v1/tenants/${tenant}/step-runs/${stepRun}/cancel`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get the schema for a step run
   *
   * @tags Step Run
   * @name StepRunGetSchema
   * @summary Get step run schema
   * @request GET:/api/v1/tenants/{tenant}/step-runs/{step-run}/schema
   * @secure
   */
  stepRunGetSchema = (
    tenant: string,
    stepRun: string,
    params: RequestParams = {},
  ) =>
    this.request<object, APIErrors>({
      path: `/api/v1/tenants/${tenant}/step-runs/${stepRun}/schema`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get all workers for a tenant
   *
   * @tags Worker
   * @name WorkerList
   * @summary Get workers
   * @request GET:/api/v1/tenants/{tenant}/worker
   * @secure
   */
  workerList = (tenant: string, params: RequestParams = {}) =>
    this.request<WorkerList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/worker`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update a worker
   *
   * @tags Worker
   * @name WorkerUpdate
   * @summary Update worker
   * @request PATCH:/api/v1/workers/{worker}
   * @secure
   */
  workerUpdate = (
    worker: string,
    data: UpdateWorkerRequest,
    params: RequestParams = {},
  ) =>
    this.request<Worker, APIErrors>({
      path: `/api/v1/workers/${worker}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get a worker
   *
   * @tags Worker
   * @name WorkerGet
   * @summary Get worker
   * @request GET:/api/v1/workers/{worker}
   * @secure
   */
  workerGet = (worker: string, params: RequestParams = {}) =>
    this.request<Worker, APIErrors>({
      path: `/api/v1/workers/${worker}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Lists all webhooks
   *
   * @name WebhookList
   * @summary List webhooks
   * @request GET:/api/v1/tenants/{tenant}/webhook-workers
   * @secure
   */
  webhookList = (tenant: string, params: RequestParams = {}) =>
    this.request<WebhookWorkerListResponse, APIErrors>({
      path: `/api/v1/tenants/${tenant}/webhook-workers`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a webhook
   *
   * @name WebhookCreate
   * @summary Create a webhook
   * @request POST:/api/v1/tenants/{tenant}/webhook-workers
   * @secure
   */
  webhookCreate = (
    tenant: string,
    data: WebhookWorkerCreateRequest,
    params: RequestParams = {},
  ) =>
    this.request<WebhookWorkerCreated, APIErrors>({
      path: `/api/v1/tenants/${tenant}/webhook-workers`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Deletes a webhook
   *
   * @name WebhookDelete
   * @summary Delete a webhook
   * @request DELETE:/api/v1/webhook-workers/{webhook}
   * @secure
   */
  webhookDelete = (webhook: string, params: RequestParams = {}) =>
    this.request<void, APIErrors>({
      path: `/api/v1/webhook-workers/${webhook}`,
      method: "DELETE",
      secure: true,
      ...params,
    });
  /**
   * @description Lists all requests for a webhook
   *
   * @name WebhookRequestsList
   * @summary List webhook requests
   * @request GET:/api/v1/webhook-workers/{webhook}/requests
   * @secure
   */
  webhookRequestsList = (webhook: string, params: RequestParams = {}) =>
    this.request<WebhookWorkerRequestListResponse, APIErrors>({
      path: `/api/v1/webhook-workers/${webhook}/requests`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get the input for a workflow run.
   *
   * @tags Workflow Run
   * @name WorkflowRunGetInput
   * @summary Get workflow run input
   * @request GET:/api/v1/tenants/{tenant}/workflow-runs/{workflow-run}/input
   * @secure
   */
  workflowRunGetInput = (
    tenant: string,
    workflowRun: string,
    params: RequestParams = {},
  ) =>
    this.request<Record<string, any>, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflow-runs/${workflowRun}/input`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a workflow by its name
   *
   * @tags Workflow
   * @name WorkflowGetByName
   * @summary Get workflow version
   * @request GET:/api/v1/tenants/{tenant}/workflows/byName/{name}
   * @secure
   */
  workflowGetByName = (
    tenant: string,
    name: FlowNames,
    params: RequestParams = {},
  ) =>
    this.request<Workflow, APIErrors>({
      path: `/api/v1/tenants/${tenant}/workflows/byName/${name}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 获取worker配置
   *
   * @name WorkerConfig
   * @summary 获取worker配置, 内部使用免去配置 token环境变量的麻烦
   * @request GET:/api/v1/worker/config
   * @secure
   */
  workerConfig = (params: RequestParams = {}) =>
    this.request<WorkerConfig, any>({
      path: `/api/v1/worker/config`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags mtmai
   * @name MtmaiWorkerConfig
   * @request GET:/api/v1/mtmai/worker_config
   */
  mtmaiWorkerConfig = (params: RequestParams = {}) =>
    this.request<
      {
        /** token */
        token: string;
        /** grpcHostPort */
        grpcHostPort: string;
        /** searxng url */
        searxng?: string;
      },
      any
    >({
      path: `/api/v1/mtmai/worker_config`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description Get the blogs for the tenant
   *
   * @tags Tenant
   * @name BlogList
   * @summary Get tenant blogs
   * @request GET:/api/v1/tenants/{tenant}/blogs
   * @secure
   */
  blogList = (tenant: string, params: RequestParams = {}) =>
    this.request<BlogList, any>({
      path: `/api/v1/tenants/${tenant}/blogs`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Creates a new blog
   *
   * @tags artifact
   * @name BlogCreate
   * @summary Create blog post
   * @request POST:/api/v1/tenants/{tenant}/blogs
   * @secure
   */
  blogCreate = (
    tenant: string,
    data: CreateBlogRequest,
    params: RequestParams = {},
  ) =>
    this.request<Blog, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/blogs`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the blogs for the tenant
   *
   * @tags Tenant
   * @name BlogGet
   * @request GET:/api/v1/tenants/{tenant}/blogs/{blog}
   * @secure
   */
  blogGet = (tenant: string, blog: string, params: RequestParams = {}) =>
    this.request<Blog, APIErrors>({
      path: `/api/v1/tenants/${tenant}/blogs/${blog}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing blog
   *
   * @tags blog
   * @name BlogUpdate
   * @summary Update blog
   * @request PATCH:/api/v1/tenants/{tenant}/blogs/{blog}
   * @secure
   */
  blogUpdate = (
    tenant: string,
    blog: string,
    data: UpdateBlogRequest,
    params: RequestParams = {},
  ) =>
    this.request<Blog, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/blogs/${blog}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the sites for the tenant
   *
   * @tags site
   * @name SiteList
   * @request GET:/api/v1/tenants/{tenant}/sites
   * @secure
   */
  siteList = (tenant: string, params: RequestParams = {}) =>
    this.request<SiteList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/sites`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description create site
   *
   * @tags site
   * @name SiteCreate
   * @request POST:/api/v1/tenants/{tenant}/sites
   * @secure
   */
  siteCreate = (
    tenant: TenantParameter,
    data: CreateSiteRequest,
    params: RequestParams = {},
  ) =>
    this.request<Site, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/sites`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the site for the tenant
   *
   * @tags site
   * @name SiteGet
   * @request GET:/api/v1/tenants/{tenant}/sites/{site}
   * @secure
   */
  siteGet = (tenant: string, site: string, params: RequestParams = {}) =>
    this.request<Site, APIErrors>({
      path: `/api/v1/tenants/${tenant}/sites/${site}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing site
   *
   * @tags Tenant
   * @name SiteUpdate
   * @summary Update tenant
   * @request PATCH:/api/v1/tenants/{tenant}/sites/{site}
   * @secure
   */
  siteUpdate = (
    tenant: string,
    site: string,
    data: UpdateSiteRequest,
    params: RequestParams = {},
  ) =>
    this.request<Site, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/sites/${site}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 前端根据域名获取site公开数据
   *
   * @tags site
   * @name SiteGetByHost
   * @request GET:/api/v1/tenants/{tenant}/sites/byHost/{host}
   * @secure
   */
  siteGetByHost = (tenant: string, host: string, params: RequestParams = {}) =>
    this.request<Site, APIErrors>({
      path: `/api/v1/tenants/${tenant}/sites/byHost/${host}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get the site-hosts for the tenant
   *
   * @tags site-host
   * @name SiteHostList
   * @request GET:/api/v1/tenants/{tenant}/site-hosts
   * @secure
   */
  siteHostList = (
    tenant: string,
    query?: {
      /**
       * The number to skip
       * @format int64
       */
      offset?: number;
      /** The host name */
      host?: string;
      /** The site id */
      siteId?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<SiteHostList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/site-hosts`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description create site-host
   *
   * @tags site-host
   * @name SiteHostCreate
   * @request POST:/api/v1/tenants/{tenant}/site-hosts
   * @secure
   */
  siteHostCreate = (
    tenant: TenantParameter,
    data: CreateSiteHostRequest,
    params: RequestParams = {},
  ) =>
    this.request<SiteHost, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/site-hosts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the site-host for the tenant
   *
   * @tags site-host
   * @name SiteHostGet
   * @request GET:/api/v1/tenants/{tenant}/site-hosts/{host}
   * @secure
   */
  siteHostGet = (tenant: string, host: string, params: RequestParams = {}) =>
    this.request<SiteHost, APIErrors>({
      path: `/api/v1/tenants/${tenant}/site-hosts/${host}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing site-host
   *
   * @tags Tenant
   * @name SiteHostUpdate
   * @summary Update tenant
   * @request PATCH:/api/v1/tenants/{tenant}/site-hosts/{host}
   * @secure
   */
  siteHostUpdate = (
    tenant: TenantParameter,
    host: string,
    data: SiteHost,
    params: RequestParams = {},
  ) =>
    this.request<SiteHost, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/site-hosts/${host}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the posts for the site
   *
   * @tags posts
   * @name PostListPublic
   * @request GET:/api/v1/posts/public
   */
  postListPublic = (
    query?: {
      /**
       * The site id
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      siteId?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<PostList, APIErrors>({
      path: `/api/v1/posts/public`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * @description Get the post for the tenant
   *
   * @tags site
   * @name PostGet
   * @request GET:/api/v1/tenants/{tenant}/posts/{post}
   * @secure
   */
  postGet = (tenant: string, post: string, params: RequestParams = {}) =>
    this.request<Post, APIErrors>({
      path: `/api/v1/tenants/${tenant}/posts/${post}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get the posts for the site
   *
   * @tags posts
   * @name PostList
   * @request GET:/api/v1/tenants/{tenant}/posts
   * @secure
   */
  postList = (
    tenant: string,
    query?: {
      /**
       * The site id
       * @format uuid
       * @minLength 36
       * @maxLength 36
       */
      siteId?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<PostList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/posts`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description create post
   *
   * @tags post
   * @name PostCreate
   * @request POST:/api/v1/tenants/{tenant}/posts
   * @secure
   */
  postCreate = (
    tenant: TenantParameter,
    data: CreatePostRequest,
    params: RequestParams = {},
  ) =>
    this.request<Post, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/posts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the artifacts for the tenant
   *
   * @tags artifact
   * @name ArtifactList
   * @summary 获取租户下的artifacts列表
   * @request GET:/api/v1/tenants/{tenant}/artifacts
   * @secure
   */
  artifactList = (tenant: string, params: RequestParams = {}) =>
    this.request<ArtifactList, any>({
      path: `/api/v1/tenants/${tenant}/artifacts`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Get a blog post by id
   *
   * @tags artifact
   * @name ArtifactGet
   * @summary Get step run
   * @request GET:/api/v1/tenants/{tenant}/artifacts/{artifact}
   * @secure
   */
  artifactGet = (
    tenant: string,
    artifact: string,
    params: RequestParams = {},
  ) =>
    this.request<Artifact, APIErrors>({
      path: `/api/v1/tenants/${tenant}/artifacts/${artifact}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 获取团队列表
   *
   * @tags coms
   * @name ComsList
   * @request GET:/api/v1/tenants/{tenant}/comps
   * @secure
   */
  comsList = (
    tenant: TenantParameter,
    query?: {
      /** The team label */
      label?: string;
      /**
       * The gallery name
       * @default "default"
       */
      gallery?: string;
      /** The component type */
      type?: string;
      /** The component provider */
      provider?: string;
      /** The component description */
      description?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MtComponentList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/comps`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Upsert an mtcomponent
   *
   * @tags coms
   * @name ComsUpsert
   * @request PATCH:/api/v1/tenants/{tenant}/comps/{com}
   * @secure
   */
  comsUpsert = (
    tenant: TenantParameter,
    com: string,
    data: MtComponent,
    params: RequestParams = {},
  ) =>
    this.request<MtComponent, APIErrors>({
      path: `/api/v1/tenants/${tenant}/comps/${com}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags coms
   * @name ComsGet
   * @request GET:/api/v1/tenants/{tenant}/comps/get
   * @secure
   */
  comsGet = (
    tenant: TenantParameter,
    query: {
      /** The component id */
      com: string;
      /** The component type */
      type?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MtComponent, APIErrors>({
      path: `/api/v1/tenants/${tenant}/comps/get`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags coms
   * @name ComsNew
   * @request POST:/api/v1/tenants/{tenant}/comps/new
   * @secure
   */
  comsNew = (
    tenant: TenantParameter,
    data: MtComponentNew,
    params: RequestParams = {},
  ) =>
    this.request<MtComponent, APIErrors>({
      path: `/api/v1/tenants/${tenant}/comps/new`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取画廊列表
   *
   * @tags galleries
   * @name GalleryList
   * @summary 获取租户下的画廊列表
   * @request GET:/api/v1/tenants/{tenant}/galleries
   * @secure
   */
  galleryList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<GalleryList, any>({
      path: `/api/v1/tenants/${tenant}/galleries`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description create gallery
   *
   * @tags galleries
   * @name GalleryCreate
   * @request POST:/api/v1/tenants/{tenant}/galleries
   * @secure
   */
  galleryCreate = (
    tenant: TenantParameter,
    data: Gallery,
    params: RequestParams = {},
  ) =>
    this.request<Gallery, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/galleries`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取画廊列表
   *
   * @tags galleries
   * @name GalleryGet
   * @request GET:/api/v1/tenants/{tenant}/gallery/{gallery}
   * @secure
   */
  galleryGet = (
    tenant: TenantParameter,
    gallery: string,
    params: RequestParams = {},
  ) =>
    this.request<Gallery, any>({
      path: `/api/v1/tenants/${tenant}/gallery/${gallery}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 获取agEvent列表
   *
   * @tags agEvents
   * @name AgEventList
   * @summary 获取租户下的agEvent列表
   * @request GET:/api/v1/tenants/{tenant}/agEvents
   * @secure
   */
  agEventList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<AgEventList, any>({
      path: `/api/v1/tenants/${tenant}/agEvents`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 获取agEvent列表
   *
   * @tags agEvents
   * @name AgEventGet
   * @summary 获取租户下的agEvent列表
   * @request GET:/api/v1/tenants/{tenant}/agEvents/{agEvent}
   * @secure
   */
  agEventGet = (
    tenant: TenantParameter,
    agEvent: string,
    params: RequestParams = {},
  ) =>
    this.request<AgEvent, any>({
      path: `/api/v1/tenants/${tenant}/agEvents/${agEvent}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags model
   * @name ModelList
   * @request GET:/api/v1/tenants/{tenant}/models
   * @secure
   */
  modelList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<ModelList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/models`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 大语言模型配置
   *
   * @tags model
   * @name ModelCreate
   * @request POST:/api/v1/tenants/{tenant}/models
   * @secure
   */
  modelCreate = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<Model, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/models`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags model
   * @name ModelGet
   * @request GET:/api/v1/tenants/{tenant}/models/{model}
   * @secure
   */
  modelGet = (
    tenant: TenantParameter,
    model: string,
    params: RequestParams = {},
  ) =>
    this.request<Model, APIErrors>({
      path: `/api/v1/tenants/${tenant}/models/${model}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an model
   *
   * @tags model
   * @name ModelUpdate
   * @request PATCH:/api/v1/tenants/{tenant}/models/{model}
   * @secure
   */
  modelUpdate = (
    tenant: TenantParameter,
    model: string,
    data: Model,
    params: RequestParams = {},
  ) =>
    this.request<Model, APIErrors>({
      path: `/api/v1/tenants/${tenant}/models/${model}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags model_run
   * @name ModelRunsList
   * @request GET:/api/v1/tenants/{tenant}/model_runs
   * @secure
   */
  modelRunsList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<ModelList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/model_runs`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags model_run
   * @name ModelRunGet
   * @request GET:/api/v1/tenants/{tenant}/model_runs/{model_run}
   * @secure
   */
  modelRunGet = (
    tenant: TenantParameter,
    modelRun: string,
    params: RequestParams = {},
  ) =>
    this.request<ModelRun, APIErrors>({
      path: `/api/v1/tenants/${tenant}/model_runs/${modelRun}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an model
   *
   * @tags model_run
   * @name ModelRunUpsert
   * @request PATCH:/api/v1/tenants/{tenant}/model_runs/{model_run}
   * @secure
   */
  modelRunUpsert = (
    tenant: TenantParameter,
    modelRun: string,
    data: ModelRun,
    params: RequestParams = {},
  ) =>
    this.request<ModelRun, APIErrors>({
      path: `/api/v1/tenants/${tenant}/model_runs/${modelRun}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Get the blogs for the tenant
   *
   * @tags prompt
   * @name PromptList
   * @summary 提示词列表
   * @request GET:/api/v1/tenants/{tenant}/prompts
   * @secure
   */
  promptList = (tenant: string, params: RequestParams = {}) =>
    this.request<PromptList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/prompts`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags prompt
   * @name PromptGet
   * @summary 获取单个提示词
   * @request GET:/api/v1/tenants/{tenant}/prompts/{prompt}
   * @secure
   */
  promptGet = (tenant: string, prompt: string, params: RequestParams = {}) =>
    this.request<EventSearch, APIErrors | APIError | void>({
      path: `/api/v1/tenants/${tenant}/prompts/${prompt}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags admin
   * @name AdminReleaseConn
   * @request POST:/api/v1/admin/releaseConn
   * @secure
   */
  adminReleaseConn = (params: RequestParams = {}) =>
    this.request<CommonResult, APIErrors>({
      path: `/api/v1/admin/releaseConn`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags frontend
   * @name FrontendGetConfig
   * @request GET:/api/v1/frontend/config
   */
  frontendGetConfig = (params: RequestParams = {}) =>
    this.request<FrontendConfig, any>({
      path: `/api/v1/frontend/config`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags frontend
   * @name FrontendGetSiderbar
   * @request GET:/api/v1/frontend/siderbar
   */
  frontendGetSiderbar = (params: RequestParams = {}) =>
    this.request<SiderbarConfig, any>({
      path: `/api/v1/frontend/siderbar`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags hf
   * @name HfAccountGet
   * @request GET:/api/v1/hf/account
   * @secure
   */
  hfAccountGet = (params: RequestParams = {}) =>
    this.request<HfAccount, APIErrors>({
      path: `/api/v1/hf/account`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 环境变量
   *
   * @tags env
   * @name EnvList
   * @request GET:/api/v1/env
   * @secure
   */
  envList = (params: RequestParams = {}) =>
    this.request<EnvList, APIErrors>({
      path: `/api/v1/env`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an existing env
   *
   * @tags env
   * @name EnvUpdate
   * @summary Update blog
   * @request PATCH:/api/v1/env
   * @secure
   */
  envUpdate = (data: UpdateBlogRequest, params: RequestParams = {}) =>
    this.request<Blog, APIErrors | APIError>({
      path: `/api/v1/env`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 环境变量
   *
   * @tags env
   * @name EnvGet
   * @request GET:/api/v1/env/{name}
   * @secure
   */
  envGet = (name: string, params: RequestParams = {}) =>
    this.request<Env, APIErrors>({
      path: `/api/v1/env/${name}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags endpoint
   * @name EndpointList
   * @request GET:/api/v1/endpoint
   * @secure
   */
  endpointList = (params: RequestParams = {}) =>
    this.request<EndpointList, APIErrors>({
      path: `/api/v1/endpoint`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an endpoint
   *
   * @tags endpoint
   * @name EndpointUpdate
   * @summary Update endpoint
   * @request PATCH:/api/v1/endpoint
   * @secure
   */
  endpointUpdate = (data: UpdateEndpointRequest, params: RequestParams = {}) =>
    this.request<Endpoint, APIErrors | APIError>({
      path: `/api/v1/endpoint`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags platform
   * @name PlatformList
   * @request GET:/api/v1/tenants/{tenant}/platforms
   * @secure
   */
  platformList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<PlatformList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/platforms`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description create platform
   *
   * @tags platform
   * @name PlatformCreate
   * @request POST:/api/v1/tenants/{tenant}/platforms
   * @secure
   */
  platformCreate = (
    tenant: TenantParameter,
    data: Platform,
    params: RequestParams = {},
  ) =>
    this.request<Platform, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/platforms`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags platform
   * @name PlatformGet
   * @request GET:/api/v1/tenants/{tenant}/platforms/{platform}
   * @secure
   */
  platformGet = (
    tenant: TenantParameter,
    platform: string,
    params: RequestParams = {},
  ) =>
    this.request<Platform, any>({
      path: `/api/v1/tenants/${tenant}/platforms/${platform}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an platform
   *
   * @tags platform
   * @name PlatformUpdate
   * @summary Update platform
   * @request PATCH:/api/v1/tenants/{tenant}/platforms/{platform}
   * @secure
   */
  platformUpdate = (
    tenant: TenantParameter,
    platform: string,
    data: Platform,
    params: RequestParams = {},
  ) =>
    this.request<Platform, APIErrors>({
      path: `/api/v1/tenants/${tenant}/platforms/${platform}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags platform_account
   * @name PlatformAccountList
   * @request GET:/api/v1/tenants/{tenant}/platform_accounts
   * @secure
   */
  platformAccountList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<PlatformAccountList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/platform_accounts`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description create platform_account
   *
   * @tags platform_account
   * @name PlatformAccountCreate
   * @request POST:/api/v1/tenants/{tenant}/platform_accounts
   * @secure
   */
  platformAccountCreate = (
    tenant: TenantParameter,
    data: PlatformAccount,
    params: RequestParams = {},
  ) =>
    this.request<PlatformAccount, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/platform_accounts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags platform_account
   * @name PlatformAccountGet
   * @request GET:/api/v1/tenants/{tenant}/platform_accounts/{platform_account}
   * @secure
   */
  platformAccountGet = (
    tenant: TenantParameter,
    platformAccount: string,
    params: RequestParams = {},
  ) =>
    this.request<PlatformAccount, any>({
      path: `/api/v1/tenants/${tenant}/platform_accounts/${platformAccount}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an platform_account
   *
   * @tags platform_account
   * @name PlatformAccountUpdate
   * @summary Update platform_account
   * @request PATCH:/api/v1/tenants/{tenant}/platform_accounts/{platform_account}
   * @secure
   */
  platformAccountUpdate = (
    tenant: TenantParameter,
    platformAccount: string,
    data: PlatformAccount,
    params: RequestParams = {},
  ) =>
    this.request<PlatformAccount, APIErrors>({
      path: `/api/v1/tenants/${tenant}/platform_accounts/${platformAccount}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags browser
   * @name BrowserList
   * @request GET:/api/v1/tenants/{tenant}/browsers
   * @secure
   */
  browserList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<BrowserList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/browsers`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description create browser
   *
   * @tags browser
   * @name BrowserCreate
   * @request POST:/api/v1/tenants/{tenant}/browsers
   * @secure
   */
  browserCreate = (
    tenant: TenantParameter,
    data: Browser,
    params: RequestParams = {},
  ) =>
    this.request<Browser, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/browsers`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags browser
   * @name BrowserGet
   * @request GET:/api/v1/tenants/{tenant}/browsers/{browser}
   * @secure
   */
  browserGet = (
    tenant: TenantParameter,
    browser: string,
    params: RequestParams = {},
  ) =>
    this.request<Browser, any>({
      path: `/api/v1/tenants/${tenant}/browsers/${browser}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an browser
   *
   * @tags browser
   * @name BrowserUpdate
   * @summary Update browser
   * @request PATCH:/api/v1/tenants/{tenant}/browsers/{browser}
   * @secure
   */
  browserUpdate = (
    tenant: TenantParameter,
    browser: string,
    data: Browser,
    params: RequestParams = {},
  ) =>
    this.request<Browser, APIErrors>({
      path: `/api/v1/tenants/${tenant}/browsers/${browser}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags proxy
   * @name ProxyList
   * @request GET:/api/v1/proxies
   * @secure
   */
  proxyList = (params: RequestParams = {}) =>
    this.request<ProxyList, APIErrors>({
      path: `/api/v1/proxies`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description create proxy
   *
   * @tags proxy
   * @name ProxyCreate
   * @request POST:/api/v1/proxies
   * @secure
   */
  proxyCreate = (data: Proxy, params: RequestParams = {}) =>
    this.request<Proxy, APIErrors | APIError>({
      path: `/api/v1/proxies`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags proxy
   * @name ProxyGet
   * @request GET:/api/v1/proxies/{proxy}
   * @secure
   */
  proxyGet = (proxy: string, params: RequestParams = {}) =>
    this.request<Proxy, APIErrors>({
      path: `/api/v1/proxies/${proxy}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Update an proxy
   *
   * @tags proxy
   * @name ProxyUpdate
   * @summary Update proxy
   * @request PATCH:/api/v1/proxies/{proxy}
   * @secure
   */
  proxyUpdate = (proxy: string, data: Proxy, params: RequestParams = {}) =>
    this.request<Proxy, APIErrors>({
      path: `/api/v1/proxies/${proxy}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取租户下的 agent 状态
   *
   * @tags agState
   * @name AgStateList
   * @request GET:/api/v1/tenants/{tenant}/agStates
   * @secure
   */
  agStateList = (
    tenant: TenantParameter,
    query?: {
      /** The topic */
      topic?: string;
      /** The source */
      source?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<AgStateList, any>({
      path: `/api/v1/tenants/${tenant}/agStates`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Upsert an agState
   *
   * @tags agState
   * @name AgStateUpsert
   * @request PATCH:/api/v1/tenants/{tenant}/agStates
   * @secure
   */
  agStateUpsert = (
    tenant: TenantParameter,
    data: AgStateUpsert,
    params: RequestParams = {},
  ) =>
    this.request<AgState, APIErrors>({
      path: `/api/v1/tenants/${tenant}/agStates`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取租户下的 agent 状态
   *
   * @tags agState
   * @name AgStateGet
   * @request GET:/api/v1/tenants/{tenant}/agState
   * @secure
   */
  agStateGet = (
    tenant: TenantParameter,
    query?: {
      /** The agState id */
      state?: string;
      /** The chat id */
      chat?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<AgState, APIErrors>({
      path: `/api/v1/tenants/${tenant}/agState`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 获取聊天消息
   *
   * @tags chat
   * @name ChatMessagesList
   * @request GET:/api/v1/tenants/{tenant}/chat/{chat}/messages
   * @secure
   */
  chatMessagesList = (
    tenant: string,
    chat: string,
    params: RequestParams = {},
  ) =>
    this.request<ChatMessageList, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/chat/${chat}/messages`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 获取聊天列表
   *
   * @tags chat
   * @name ChatSessionList
   * @request GET:/api/v1/tenants/{tenant}/chat/sessions
   * @secure
   */
  chatSessionList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<ChatSessionList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/chat/sessions`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 保存 聊天消息
   *
   * @tags chat
   * @name ChatMessageUpsert
   * @request POST:/api/v1/tenants/{tenant}/chat/sessions
   * @secure
   */
  chatMessageUpsert = (
    tenant: TenantParameter,
    data: ChatMessageUpsert,
    params: RequestParams = {},
  ) =>
    this.request<ChatMessage, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/chat/sessions`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取聊天列表
   *
   * @tags chat
   * @name ChatSessionGet
   * @summary 获取租户下的聊天列表
   * @request GET:/api/v1/tenants/{tenant}/chat/sessions/{session}
   * @secure
   */
  chatSessionGet = (
    tenant: TenantParameter,
    session?: string,
    query?: {
      /** The topic id */
      topic?: string;
      /** The message type */
      messageType?: string;
      /** The role */
      role?: string;
      /** The source */
      source?: string;
      /** The step run id */
      stepRunId?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ChatSession, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/chat/sessions/${session}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 获取聊天界面状态
   *
   * @tags ui_agent
   * @name UiAgentGet
   * @request GET:/api/v1/tenants/{tenant}/ag_ui
   * @secure
   */
  uiAgentGet = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<UiAgentState, APIErrors>({
      path: `/api/v1/tenants/${tenant}/ag_ui`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name TagsApi
   * @request TAGS:/api/v1/dispatcher/listen/{workerId}
   * @secure
   */
  tagsApi = (workerId: string, params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/api/v1/dispatcher/listen/${workerId}`,
      method: "TAGS",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @name DispatcherListen
   * @request POST:/api/v1/dispatcher/listen/{workerId}
   * @secure
   */
  dispatcherListen = (workerId: string, params: RequestParams = {}) =>
    this.request<AssignedAction, APIErrors | APIError>({
      path: `/api/v1/dispatcher/listen/${workerId}`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 获取资源列表
   *
   * @tags resource
   * @name ResourceList
   * @request GET:/api/v1/tenants/{tenant}/resources
   * @secure
   */
  resourceList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<MtResourceList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/resources`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 保存 资源
   *
   * @tags resource
   * @name ResourceUpsert
   * @request POST:/api/v1/tenants/{tenant}/resources
   * @secure
   */
  resourceUpsert = (
    tenant: TenantParameter,
    data: MtResourceUpsert,
    params: RequestParams = {},
  ) =>
    this.request<MtResource, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/resources`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取资源
   *
   * @tags resource
   * @name ResourceGet
   * @summary 获取租户下的资源
   * @request GET:/api/v1/tenants/{tenant}/resources/{resource}
   * @secure
   */
  resourceGet = (
    tenant: TenantParameter,
    resource?: string,
    params: RequestParams = {},
  ) =>
    this.request<MtResource, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/resources/${resource}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags settings
   * @name SettingsList
   * @request GET:/api/v1/tenants/{tenant}/settings
   * @secure
   */
  settingsList = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<ModelList, APIErrors>({
      path: `/api/v1/tenants/${tenant}/settings`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags settings
   * @name SettingsUpsert
   * @request POST:/api/v1/tenants/{tenant}/settings
   * @secure
   */
  settingsUpsert = (tenant: TenantParameter, params: RequestParams = {}) =>
    this.request<TenantSetting, APIErrors | APIError>({
      path: `/api/v1/tenants/${tenant}/settings`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags settings
   * @name SettingsGet
   * @request GET:/api/v1/tenants/{tenant}/settings/{setting}
   * @secure
   */
  settingsGet = (
    tenant: TenantParameter,
    setting: string,
    params: RequestParams = {},
  ) =>
    this.request<TenantSetting, APIErrors>({
      path: `/api/v1/tenants/${tenant}/settings/${setting}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
