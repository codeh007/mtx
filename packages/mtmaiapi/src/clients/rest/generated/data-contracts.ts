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

export interface APIMeta {
  auth?: APIMetaAuth;
  /**
   * the Pylon app ID for usepylon.com chat support
   * @example "12345678-1234-1234-1234-123456789012"
   */
  pylonAppId?: string;
  posthog?: APIMetaPosthog;
  /**
   * whether or not users can sign up for this instance
   * @example true
   */
  allowSignup?: boolean;
  /**
   * whether or not users can invite other users to this instance
   * @example true
   */
  allowInvites?: boolean;
  /**
   * whether or not users can create new tenants
   * @example true
   */
  allowCreateTenant?: boolean;
  /**
   * whether or not users can change their password
   * @example true
   */
  allowChangePassword?: boolean;
}

export interface APIMetaAuth {
  /**
   * the supported types of authentication
   * @example ["basic","google"]
   */
  schemes?: string[];
}

export interface APIMetaPosthog {
  /**
   * the PostHog API key
   * @example "phk_1234567890abcdef"
   */
  apiKey?: string;
  /**
   * the PostHog API host
   * @example "https://posthog.example.com"
   */
  apiHost?: string;
}

export type ListAPIMetaIntegration = APIMetaIntegration[];

export interface APIMetaIntegration {
  /**
   * the name of the integration
   * @example "github"
   */
  name: string;
  /** whether this integration is enabled on the instance */
  enabled: boolean;
}

export interface APIErrors {
  errors: APIError[];
}

export interface APIError {
  /**
   * a custom Hatchet error code
   * @format uint64
   * @example 1400
   */
  code?: number;
  /**
   * the field that this error is associated with, if applicable
   * @example "name"
   */
  field?: string;
  /**
   * a description for this error
   * @example "A descriptive error message"
   */
  description: string;
  /**
   * a link to the documentation for this error, if it exists
   * @example "github.com/hatchet-dev/hatchet"
   */
  docs_link?: string;
}

/** @example {"next_page":3,"num_pages":10,"current_page":2} */
export interface PaginationResponse {
  /**
   * the current page
   * @format int64
   * @example 2
   */
  current_page?: number;
  /**
   * the next page
   * @format int64
   * @example 3
   */
  next_page?: number;
  /**
   * the total number of pages for listing
   * @format int64
   * @example 10
   */
  num_pages?: number;
}

export interface APIResourceMeta {
  /**
   * the id of this resource, in UUID format
   * @minLength 0
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  id: string;
  /**
   * the time that this resource was created
   * @format date-time
   * @example "2022-12-13T15:06:48.888358-05:00"
   */
  createdAt: string;
  /**
   * the time that this resource was last updated
   * @format date-time
   * @example "2022-12-13T15:06:48.888358-05:00"
   */
  updatedAt: string;
}

export interface User {
  metadata: APIResourceMeta;
  /** The display name of the user. */
  name?: string;
  /**
   * The email address of the user.
   * @format email
   */
  email: string;
  /** Whether the user has verified their email address. */
  emailVerified: boolean;
  /** Whether the user has a password set. */
  hasPassword?: boolean;
  /** A hash of the user's email address for use with Pylon Support Chat */
  emailHash?: string;
  /** The user's token for use with Pylon Support Chat */
  userToken?: string;
}

export interface UserTenantPublic {
  /**
   * The email address of the user.
   * @format email
   */
  email: string;
  /** The display name of the user. */
  name?: string;
}

export interface UserLoginRequest {
  /**
   * The email address of the user.
   * @format email
   */
  email: string;
  /** The password of the user. */
  password: string;
}

export interface UserChangePasswordRequest {
  /** The password of the user. */
  password: string;
  /** The new password for the user. */
  newPassword: string;
}

export interface UserRegisterRequest {
  /** The name of the user. */
  name: string;
  /**
   * The email address of the user.
   * @format email
   */
  email: string;
  /** The password of the user. */
  password: string;
}

export interface UserTenantMembershipsList {
  pagination?: PaginationResponse;
  rows?: TenantMember[];
}

export interface Tenant {
  metadata: APIResourceMeta;
  /** The name of the tenant. */
  name: string;
  /** The slug of the tenant. */
  slug: string;
  /** Whether the tenant has opted out of analytics. */
  analyticsOptOut?: boolean;
  /** Whether to alert tenant members. */
  alertMemberEmails?: boolean;
}

export interface TenantMember {
  metadata: APIResourceMeta;
  /** The user associated with this tenant member. */
  user: UserTenantPublic;
  /** The role of the user in the tenant. */
  role: TenantMemberRole;
  /** The tenant associated with this tenant member. */
  tenant?: Tenant;
}

export interface TenantMemberList {
  pagination?: PaginationResponse;
  rows?: TenantMember[];
}

export enum TenantMemberRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum TenantResource {
  WORKER = "WORKER",
  EVENT = "EVENT",
  WORKFLOW_RUN = "WORKFLOW_RUN",
  CRON = "CRON",
  SCHEDULE = "SCHEDULE",
}

export interface TenantResourceLimit {
  metadata: APIResourceMeta;
  /** The resource associated with this limit. */
  resource: TenantResource;
  /** The limit associated with this limit. */
  limitValue: number;
  /** The alarm value associated with this limit to warn of approaching limit value. */
  alarmValue?: number;
  /** The current value associated with this limit. */
  value: number;
  /** The meter window for the limit. (i.e. 1 day, 1 week, 1 month) */
  window?: string;
  /**
   * The last time the limit was refilled.
   * @format date-time
   */
  lastRefill?: string;
}

export interface TenantResourcePolicy {
  /** A list of resource limits for the tenant. */
  limits: TenantResourceLimit[];
}

export interface CreateTenantInviteRequest {
  /** The email of the user to invite. */
  email: string;
  /** The role of the user in the tenant. */
  role: TenantMemberRole;
}

export interface UpdateTenantInviteRequest {
  /** The role of the user in the tenant. */
  role: TenantMemberRole;
}

export interface TenantAlertingSettings {
  metadata: APIResourceMeta;
  /** Whether to alert tenant members. */
  alertMemberEmails?: boolean;
  /** Whether to send alerts when workflow runs fail. */
  enableWorkflowRunFailureAlerts?: boolean;
  /** Whether to enable alerts when tokens are approaching expiration. */
  enableExpiringTokenAlerts?: boolean;
  /** Whether to enable alerts when tenant resources are approaching limits. */
  enableTenantResourceLimitAlerts?: boolean;
  /** The max frequency at which to alert. */
  maxAlertingFrequency: string;
  /**
   * The last time an alert was sent.
   * @format date-time
   */
  lastAlertedAt?: string;
}

export interface TenantAlertEmailGroup {
  metadata: APIResourceMeta;
  /** A list of emails for users */
  emails: string[];
}

export interface TenantAlertEmailGroupList {
  pagination?: PaginationResponse;
  rows?: TenantAlertEmailGroup[];
}

export interface CreateTenantAlertEmailGroupRequest {
  /** A list of emails for users */
  emails: string[];
}

export interface UpdateTenantAlertEmailGroupRequest {
  /** A list of emails for users */
  emails: string[];
}

export interface TenantInvite {
  metadata: APIResourceMeta;
  /** The email of the user to invite. */
  email: string;
  /** The role of the user in the tenant. */
  role: TenantMemberRole;
  /** The tenant id associated with this tenant invite. */
  tenantId: string;
  /** The tenant name for the tenant. */
  tenantName?: string;
  /**
   * The time that this invite expires.
   * @format date-time
   */
  expires: string;
}

export interface TenantInviteList {
  pagination?: PaginationResponse;
  rows?: TenantInvite[];
}

export interface QueueMetrics {
  /** The number of items in the queue. */
  numQueued: number;
  /** The number of items running. */
  numRunning: number;
  /** The number of items pending. */
  numPending: number;
}

export interface TenantQueueMetrics {
  /** The total queue metrics. */
  total?: QueueMetrics;
  workflow?: Record<string, QueueMetrics>;
  queues?: Record<string, number>;
}

export interface TenantStepRunQueueMetrics {
  queues?: Record<string, number>;
}

export interface AcceptInviteRequest {
  /**
   * @minLength 36
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  invite: string;
}

export interface RejectInviteRequest {
  /**
   * @minLength 36
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  invite: string;
}

export interface TenantList {
  pagination?: PaginationResponse;
  rows?: Tenant[];
}

export interface CreateTenantRequest {
  /** The name of the tenant. */
  name: string;
  /** The slug of the tenant. */
  slug: string;
}

export interface UpdateTenantRequest {
  /** The name of the tenant. */
  name?: string;
  /** Whether the tenant has opted out of analytics. */
  analyticsOptOut?: boolean;
  /** Whether to alert tenant members. */
  alertMemberEmails?: boolean;
  /** Whether to send alerts when workflow runs fail. */
  enableWorkflowRunFailureAlerts?: boolean;
  /** Whether to enable alerts when tokens are approaching expiration. */
  enableExpiringTokenAlerts?: boolean;
  /** Whether to enable alerts when tenant resources are approaching limits. */
  enableTenantResourceLimitAlerts?: boolean;
  /** The max frequency at which to alert. */
  maxAlertingFrequency?: string;
}

export interface Event {
  metadata: APIResourceMeta;
  /** The key for the event. */
  key: string;
  /** The tenant associated with this event. */
  tenant?: Tenant;
  /** The ID of the tenant associated with this event. */
  tenantId: string;
  /** The workflow run summary for this event. */
  workflowRunSummary?: EventWorkflowRunSummary;
  /** Additional metadata for the event. */
  additionalMetadata?: object;
}

export interface EventData {
  /** The data for the event (JSON bytes). */
  data: string;
}

export interface CreateEventRequest {
  /** The key for the event. */
  key: string;
  /** The data for the event. */
  data: object;
  /** Additional metadata for the event. */
  additionalMetadata?: object;
}

export interface BulkCreateEventRequest {
  events: CreateEventRequest[];
}

export interface BulkCreateEventResponse {
  metadata: APIResourceMeta;
  /** The events. */
  events: Event[];
}

export interface EventWorkflowRunSummary {
  /**
   * The number of pending runs.
   * @format int64
   */
  pending?: number;
  /**
   * The number of running runs.
   * @format int64
   */
  running?: number;
  /**
   * The number of queued runs.
   * @format int64
   */
  queued?: number;
  /**
   * The number of succeeded runs.
   * @format int64
   */
  succeeded?: number;
  /**
   * The number of failed runs.
   * @format int64
   */
  failed?: number;
}

export enum EventOrderByField {
  CreatedAt = "createdAt",
}

export enum EventOrderByDirection {
  Asc = "asc",
  Desc = "desc",
}

export type EventSearch = string;

export interface EventKeyList {
  pagination?: PaginationResponse;
  rows?: EventKey[];
}

/** The key for the event. */
export type EventKey = string;

/** A workflow ID. */
export type WorkflowID = string;

export interface EventList {
  pagination?: PaginationResponse;
  rows?: Event[];
}

export interface RateLimit {
  /** The key for the rate limit. */
  key: string;
  /** The ID of the tenant associated with this rate limit. */
  tenantId: string;
  /** The maximum number of requests allowed within the window. */
  limitValue: number;
  /** The current number of requests made within the window. */
  value: number;
  /** The window of time in which the limitValue is enforced. */
  window: string;
  /**
   * The last time the rate limit was refilled.
   * @format date-time
   * @example "2022-12-13T15:06:48.888358-05:00"
   */
  lastRefill: string;
}

export interface RateLimitList {
  pagination?: PaginationResponse;
  rows?: RateLimit[];
}

export enum RateLimitOrderByField {
  Key = "key",
  Value = "value",
  LimitValue = "limitValue",
}

export enum RateLimitOrderByDirection {
  Asc = "asc",
  Desc = "desc",
}

export interface ReplayEventRequest {
  eventIds: string[];
}

export interface CancelEventRequest {
  eventIds: string[];
}

export interface Workflow {
  metadata: APIResourceMeta;
  /** The name of the workflow. */
  name: string;
  /** The description of the workflow. */
  description?: string;
  /** Whether the workflow is paused. */
  isPaused?: boolean;
  versions?: WorkflowVersionMeta[];
  /** The tags of the workflow. */
  tags?: WorkflowTag[];
  /** The jobs of the workflow. */
  jobs?: Job[];
}

export interface WorkflowUpdateRequest {
  /** Whether the workflow is paused. */
  isPaused?: boolean;
}

export interface WorkflowConcurrency {
  /**
   * The maximum number of concurrent workflow runs.
   * @format int32
   */
  maxRuns: number;
  /** The strategy to use when the concurrency limit is reached. */
  limitStrategy:
    | "CANCEL_IN_PROGRESS"
    | "DROP_NEWEST"
    | "QUEUE_NEWEST"
    | "GROUP_ROUND_ROBIN";
  /** An action which gets the concurrency group for the WorkflowRun. */
  getConcurrencyGroup: string;
}

export interface WorkflowVersionMeta {
  metadata: APIResourceMeta;
  /** The version of the workflow. */
  version: string;
  /** @format int32 */
  order: number;
  workflowId: string;
  workflow?: Workflow;
}

export interface WorkflowVersion {
  metadata: APIResourceMeta;
  /** The version of the workflow. */
  version: string;
  /** @format int32 */
  order: number;
  workflowId: string;
  /** The sticky strategy of the workflow. */
  sticky?: string;
  /**
   * The default priority of the workflow.
   * @format int32
   */
  defaultPriority?: number;
  workflow?: Workflow;
  concurrency?: WorkflowConcurrency;
  triggers?: WorkflowTriggers;
  scheduleTimeout?: string;
  jobs?: Job[];
}

export interface WorkflowVersionDefinition {
  /** The raw YAML definition of the workflow. */
  rawDefinition: string;
}

export interface WorkflowTag {
  /** The name of the workflow. */
  name: string;
  /** The description of the workflow. */
  color: string;
}

export interface WorkflowList {
  metadata?: APIResourceMeta;
  rows?: Workflow[];
  pagination?: PaginationResponse;
}

export interface WorkflowTriggers {
  metadata?: APIResourceMeta;
  workflow_version_id?: string;
  tenant_id?: string;
  events?: WorkflowTriggerEventRef[];
  crons?: WorkflowTriggerCronRef[];
}

export interface WorkflowTriggerEventRef {
  parent_id?: string;
  event_key?: string;
}

export interface WorkflowTriggerCronRef {
  parent_id?: string;
  cron?: string;
}

export interface Job {
  metadata: APIResourceMeta;
  tenantId: string;
  versionId: string;
  name: string;
  /** The description of the job. */
  description?: string;
  steps: Step[];
  /** The timeout of the job. */
  timeout?: string;
}

export interface Step {
  metadata: APIResourceMeta;
  /** The readable id of the step. */
  readableId: string;
  tenantId: string;
  jobId: string;
  action: string;
  /** The timeout of the step. */
  timeout?: string;
  children?: string[];
  parents?: string[];
}

export interface WorkflowWorkersCount {
  freeSlotCount?: number;
  maxSlotCount?: number;
  workflowRunId?: string;
}

export interface WorkflowRun {
  metadata: APIResourceMeta;
  tenantId: string;
  workflowVersionId: string;
  workflowVersion?: WorkflowVersion;
  status: WorkflowRunStatus;
  displayName?: string;
  jobRuns?: JobRun[];
  triggeredBy: WorkflowRunTriggeredBy;
  input?: Record<string, any>;
  error?: string;
  /** @format date-time */
  startedAt?: string;
  /** @format date-time */
  finishedAt?: string;
  /** @example 1000 */
  duration?: number;
  /**
   * @format uuid
   * @minLength 36
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  parentId?: string;
  /**
   * @format uuid
   * @minLength 36
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  parentStepRunId?: string;
  additionalMetadata?: Record<string, any>;
}

export interface WorkflowRunShape {
  metadata: APIResourceMeta;
  tenantId: string;
  workflowId?: string;
  workflowVersionId: string;
  workflowVersion?: WorkflowVersion;
  status: WorkflowRunStatus;
  displayName?: string;
  jobRuns?: JobRun[];
  triggeredBy: WorkflowRunTriggeredBy;
  input?: Record<string, any>;
  error?: string;
  /** @format date-time */
  startedAt?: string;
  /** @format date-time */
  finishedAt?: string;
  /** @example 1000 */
  duration?: number;
  /**
   * @format uuid
   * @minLength 36
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  parentId?: string;
  /**
   * @format uuid
   * @minLength 36
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  parentStepRunId?: string;
  additionalMetadata?: Record<string, any>;
}

export interface ReplayWorkflowRunsRequest {
  /** @maxLength 500 */
  workflowRunIds: string[];
}

export interface ReplayWorkflowRunsResponse {
  workflowRuns: WorkflowRun[];
}

export interface WorkflowRunList {
  rows?: WorkflowRun[];
  pagination?: PaginationResponse;
}

export interface ScheduledWorkflows {
  metadata: APIResourceMeta;
  tenantId: string;
  workflowVersionId: string;
  workflowId: string;
  workflowName: string;
  /** @format date-time */
  triggerAt: string;
  input?: Record<string, any>;
  additionalMetadata?: Record<string, any>;
  /** @format date-time */
  workflowRunCreatedAt?: string;
  workflowRunName?: string;
  workflowRunStatus?: WorkflowRunStatus;
  /**
   * @format uuid
   * @minLength 36
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  workflowRunId?: string;
  method: "DEFAULT" | "API";
}

export interface ScheduledWorkflowsList {
  rows?: ScheduledWorkflows[];
  pagination?: PaginationResponse;
}

export enum ScheduledWorkflowsOrderByField {
  TriggerAt = "triggerAt",
  CreatedAt = "createdAt",
}

export enum ScheduledRunStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  QUEUED = "QUEUED",
  SCHEDULED = "SCHEDULED",
}

export interface CronWorkflows {
  metadata: APIResourceMeta;
  tenantId: string;
  workflowVersionId: string;
  workflowId: string;
  workflowName: string;
  cron: string;
  name?: string;
  input?: Record<string, any>;
  additionalMetadata?: Record<string, any>;
  enabled: boolean;
  method: "DEFAULT" | "API";
}

export interface CronWorkflowsList {
  rows?: CronWorkflows[];
  pagination?: PaginationResponse;
}

export enum CronWorkflowsOrderByField {
  Name = "name",
  CreatedAt = "createdAt",
}

export enum WorkflowRunOrderByField {
  CreatedAt = "createdAt",
  StartedAt = "startedAt",
  FinishedAt = "finishedAt",
  Duration = "duration",
}

export enum WorkflowRunOrderByDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export interface WorkflowRunsMetrics {
  counts?: WorkflowRunsMetricsCounts;
}

export interface WorkflowRunsMetricsCounts {
  PENDING?: number;
  RUNNING?: number;
  SUCCEEDED?: number;
  FAILED?: number;
  QUEUED?: number;
  CANCELLED?: number;
}

export enum WorkflowRunStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  QUEUED = "QUEUED",
  BACKOFF = "BACKOFF",
}

export type WorkflowRunStatusList = WorkflowRunStatus[];

export enum WorkflowKind {
  FUNCTION = "FUNCTION",
  DURABLE = "DURABLE",
  DAG = "DAG",
}

export type WorkflowKindList = WorkflowKind[];

export interface WorkflowRunsCancelRequest {
  workflowRunIds: string[];
}

export enum JobRunStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  BACKOFF = "BACKOFF",
}

export enum StepRunStatus {
  PENDING = "PENDING",
  PENDING_ASSIGNMENT = "PENDING_ASSIGNMENT",
  ASSIGNED = "ASSIGNED",
  RUNNING = "RUNNING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  CANCELLING = "CANCELLING",
  BACKOFF = "BACKOFF",
}

export interface JobRun {
  metadata: APIResourceMeta;
  tenantId: string;
  workflowRunId: string;
  workflowRun?: WorkflowRun;
  jobId: string;
  job?: Job;
  tickerId?: string;
  stepRuns?: StepRun[];
  status: JobRunStatus;
  result?: object;
  /** @format date-time */
  startedAt?: string;
  /** @format date-time */
  finishedAt?: string;
  /** @format date-time */
  timeoutAt?: string;
  /** @format date-time */
  cancelledAt?: string;
  cancelledReason?: string;
  cancelledError?: string;
}

export interface WorkflowRunTriggeredBy {
  metadata: APIResourceMeta;
  parentWorkflowRunId?: string;
  eventId?: string;
  cronParentId?: string;
  cronSchedule?: string;
}

export interface StepRun {
  metadata: APIResourceMeta;
  tenantId: string;
  jobRunId: string;
  jobRun?: Record<string, any>;
  stepId: string;
  step?: Step;
  childWorkflowsCount?: number;
  parents?: string[];
  childWorkflowRuns?: string[];
  workerId?: string;
  input?: string;
  output?: string;
  status: StepRunStatus;
  /** @format date-time */
  requeueAfter?: string;
  result?: object;
  error?: string;
  /** @format date-time */
  startedAt?: string;
  startedAtEpoch?: number;
  /** @format date-time */
  finishedAt?: string;
  finishedAtEpoch?: number;
  /** @format date-time */
  timeoutAt?: string;
  timeoutAtEpoch?: number;
  /** @format date-time */
  cancelledAt?: string;
  cancelledAtEpoch?: number;
  cancelledReason?: string;
  cancelledError?: string;
}

export enum StepRunEventReason {
  REQUEUED_NO_WORKER = "REQUEUED_NO_WORKER",
  REQUEUED_RATE_LIMIT = "REQUEUED_RATE_LIMIT",
  SCHEDULING_TIMED_OUT = "SCHEDULING_TIMED_OUT",
  ASSIGNED = "ASSIGNED",
  STARTED = "STARTED",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  FINISHED = "FINISHED",
  FAILED = "FAILED",
  RETRYING = "RETRYING",
  CANCELLED = "CANCELLED",
  TIMEOUT_REFRESHED = "TIMEOUT_REFRESHED",
  REASSIGNED = "REASSIGNED",
  TIMED_OUT = "TIMED_OUT",
  SLOT_RELEASED = "SLOT_RELEASED",
  RETRIED_BY_USER = "RETRIED_BY_USER",
  WORKFLOW_RUN_GROUP_KEY_SUCCEEDED = "WORKFLOW_RUN_GROUP_KEY_SUCCEEDED",
  WORKFLOW_RUN_GROUP_KEY_FAILED = "WORKFLOW_RUN_GROUP_KEY_FAILED",
}

export enum StepRunEventSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

export interface StepRunEvent {
  id: number;
  /** @format date-time */
  timeFirstSeen: string;
  /** @format date-time */
  timeLastSeen: string;
  stepRunId?: string;
  workflowRunId?: string;
  reason: StepRunEventReason;
  severity: StepRunEventSeverity;
  message: string;
  count: number;
  data?: object;
}

export interface StepRunEventList {
  pagination?: PaginationResponse;
  rows?: StepRunEvent[];
}

export interface StepRunArchive {
  stepRunId: string;
  order: number;
  input?: string;
  output?: string;
  /** @format date-time */
  startedAt?: string;
  error?: string;
  retryCount: number;
  /** @format date-time */
  createdAt: string;
  startedAtEpoch?: number;
  /** @format date-time */
  finishedAt?: string;
  finishedAtEpoch?: number;
  /** @format date-time */
  timeoutAt?: string;
  timeoutAtEpoch?: number;
  /** @format date-time */
  cancelledAt?: string;
  cancelledAtEpoch?: number;
  cancelledReason?: string;
  cancelledError?: string;
}

export interface StepRunArchiveList {
  pagination?: PaginationResponse;
  rows?: StepRunArchive[];
}

export interface WorkerRuntimeInfo {
  sdkVersion?: string;
  language?: WorkerRuntimeSDKs;
  languageVersion?: string;
  os?: string;
  runtimeExtra?: string;
}

export enum WorkerRuntimeSDKs {
  GOLANG = "GOLANG",
  PYTHON = "PYTHON",
  TYPESCRIPT = "TYPESCRIPT",
}

export interface WorkerList {
  pagination?: PaginationResponse;
  rows?: Worker[];
}

export interface SemaphoreSlots {
  /**
   * The step run id.
   * @format uuid
   */
  stepRunId: string;
  /** The action id. */
  actionId: string;
  /**
   * The time this slot was started.
   * @format date-time
   */
  startedAt?: string;
  /**
   * The time this slot will timeout.
   * @format date-time
   */
  timeoutAt?: string;
  /**
   * The workflow run id.
   * @format uuid
   */
  workflowRunId: string;
  status: StepRunStatus;
}

export interface RecentStepRuns {
  metadata: APIResourceMeta;
  /** The action id. */
  actionId: string;
  status: StepRunStatus;
  /** @format date-time */
  startedAt?: string;
  /** @format date-time */
  finishedAt?: string;
  /** @format date-time */
  cancelledAt?: string;
  /** @format uuid */
  workflowRunId: string;
}

export interface Worker {
  metadata: APIResourceMeta;
  /** The name of the worker. */
  name: string;
  type: "SELFHOSTED" | "MANAGED" | "WEBHOOK";
  /**
   * The time this worker last sent a heartbeat.
   * @format date-time
   * @example "2022-12-13T15:06:48.888358-05:00"
   */
  lastHeartbeatAt?: string;
  /**
   * The time this worker last sent a heartbeat.
   * @format date-time
   * @example "2022-12-13T15:06:48.888358-05:00"
   */
  lastListenerEstablished?: string;
  /** The actions this worker can perform. */
  actions?: string[];
  /** The semaphore slot state for the worker. */
  slots?: SemaphoreSlots[];
  /** The recent step runs for the worker. */
  recentStepRuns?: RecentStepRuns[];
  /** The status of the worker. */
  status?: "ACTIVE" | "INACTIVE" | "PAUSED";
  /** The maximum number of runs this worker can execute concurrently. */
  maxRuns?: number;
  /** The number of runs this worker can execute concurrently. */
  availableRuns?: number;
  /**
   * the id of the assigned dispatcher, in UUID format
   * @format uuid
   * @minLength 36
   * @maxLength 36
   * @example "bb214807-246e-43a5-a25d-41761d1cff9e"
   */
  dispatcherId?: string;
  /** The current label state of the worker. */
  labels?: WorkerLabel[];
  /** The webhook URL for the worker. */
  webhookUrl?: string;
  /**
   * The webhook ID for the worker.
   * @format uuid
   */
  webhookId?: string;
  runtimeInfo?: WorkerRuntimeInfo;
}

export interface WorkerLabel {
  metadata: APIResourceMeta;
  /** The key of the label. */
  key: string;
  /** The value of the label. */
  value?: string;
}

export interface UpdateWorkerRequest {
  /** Whether the worker is paused and cannot accept new runs. */
  isPaused?: boolean;
}

export interface APIToken {
  metadata: APIResourceMeta;
  /**
   * The name of the API token.
   * @maxLength 255
   */
  name: string;
  /**
   * When the API token expires.
   * @format date-time
   */
  expiresAt: string;
}

export interface CreateAPITokenRequest {
  /**
   * A name for the API token.
   * @maxLength 255
   */
  name: string;
  /** The duration for which the token is valid. */
  expiresIn?: string;
}

export interface CreateAPITokenResponse {
  /** The API token. */
  token: string;
}

export interface ListAPITokensResponse {
  pagination?: PaginationResponse;
  rows?: APIToken[];
}

export interface RerunStepRunRequest {
  input: object;
}

export interface TriggerWorkflowRunRequest {
  input: object;
  additionalMetadata?: object;
}

export interface CreatePullRequestFromStepRun {
  branchName: string;
}

export interface GetStepRunDiffResponse {
  diffs: StepRunDiff[];
}

export interface StepRunDiff {
  key: string;
  original: string;
  modified: string;
}

export interface ListPullRequestsResponse {
  pullRequests: PullRequest[];
}

export interface PullRequest {
  repositoryOwner: string;
  repositoryName: string;
  pullRequestID: number;
  pullRequestTitle: string;
  pullRequestNumber: number;
  pullRequestHeadBranch: string;
  pullRequestBaseBranch: string;
  pullRequestState: PullRequestState;
}

export enum PullRequestState {
  Open = "open",
  Closed = "closed",
}

export interface LogLine {
  /**
   * The creation date of the log line.
   * @format date-time
   */
  createdAt: string;
  /** The log message. */
  message: string;
  /** The log metadata. */
  metadata: object;
}

export enum LogLineLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface LogLineList {
  pagination?: PaginationResponse;
  rows?: LogLine[];
}

export enum LogLineOrderByField {
  CreatedAt = "createdAt",
}

export enum LogLineOrderByDirection {
  Asc = "asc",
  Desc = "desc",
}

export type LogLineSearch = string;

export type LogLineLevelField = LogLineLevel[];

export interface SNSIntegration {
  metadata: APIResourceMeta;
  /**
   * The unique identifier for the tenant that the SNS integration belongs to.
   * @format uuid
   */
  tenantId: string;
  /** The Amazon Resource Name (ARN) of the SNS topic. */
  topicArn: string;
  /** The URL to send SNS messages to. */
  ingestUrl?: string;
}

export interface ListSNSIntegrations {
  pagination: PaginationResponse;
  rows: SNSIntegration[];
}

export interface SlackWebhook {
  metadata: APIResourceMeta;
  /**
   * The unique identifier for the tenant that the SNS integration belongs to.
   * @format uuid
   */
  tenantId: string;
  /** The team name associated with this slack webhook. */
  teamName: string;
  /** The team id associated with this slack webhook. */
  teamId: string;
  /** The channel name associated with this slack webhook. */
  channelName: string;
  /** The channel id associated with this slack webhook. */
  channelId: string;
}

export interface ListSlackWebhooks {
  pagination: PaginationResponse;
  rows: SlackWebhook[];
}

export interface CreateSNSIntegrationRequest {
  /** The Amazon Resource Name (ARN) of the SNS topic. */
  topicArn: string;
}

export interface WorkflowMetrics {
  /** The number of runs for a specific group key (passed via filter) */
  groupKeyRunsCount?: number;
  /** The total number of concurrency group keys. */
  groupKeyCount?: number;
}

export interface WebhookWorker {
  metadata: APIResourceMeta;
  /** The name of the webhook worker. */
  name: string;
  /** The webhook url. */
  url: string;
}

export enum WebhookWorkerRequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
}

export interface WebhookWorkerRequest {
  /**
   * The date and time the request was created.
   * @format date-time
   */
  created_at: string;
  /** The HTTP method used for the request. */
  method: WebhookWorkerRequestMethod;
  /** The HTTP status code of the response. */
  statusCode: number;
}

export interface WebhookWorkerRequestListResponse {
  /** The list of webhook requests. */
  requests?: WebhookWorkerRequest[];
}

export interface WebhookWorkerCreated {
  metadata: APIResourceMeta;
  /** The name of the webhook worker. */
  name: string;
  /** The webhook url. */
  url: string;
  /** The secret key for validation. */
  secret: string;
}

export interface WebhookWorkerCreateRequest {
  /** The name of the webhook worker. */
  name: string;
  /** The webhook url. */
  url: string;
  /**
   * The secret key for validation. If not provided, a random secret will be generated.
   * @minLength 32
   */
  secret?: string;
}

export interface WebhookWorkerCreateResponse {
  worker?: WebhookWorkerCreated;
}

export interface WebhookWorkerListResponse {
  pagination?: PaginationResponse;
  rows?: WebhookWorker[];
}

export interface APIResourceMetaProperties {
  metadata?: APIResourceMeta;
}

export interface CommonResult {
  Success: boolean;
  Message: string;
  other?: any;
}

export interface ChatMessage {
  metadata: APIResourceMeta;
  role: string;
  content: string;
  source?: string;
  topic?: string;
  thought?: string;
  resourceId?: string;
  msg_meta?: Record<string, any>;
  config?: {
    message_type?: string;
    source?: string;
  };
  model_usage?: ModelUsage;
}

export interface ModelUsage {
  model?: string;
  prompt_tokens?: number;
  completion_tokens?: number;
}

export interface ChatMessageList {
  metadata?: APIResourceMeta;
  rows?: ChatMessage[];
  pagination?: PaginationResponse;
}

export interface WorkerConfig {
  workerToken?: string;
}

/** 运行新任务的结果 */
export interface RunNewTaskResponse {
  description?: string;
}

/**
 * 可用的操作名称枚举：
 * - **startBlogTask**: 启动单个博客自动化操作任务
 * - **stopBlogTask**: 停止单个博客自动化操作任务
 */
export enum OperationEnum {
  StartBlogTask = "startBlogTask",
  StopBlogTask = "stopBlogTask",
}

export interface CreateBlogPostRequest {
  /**
   * The blog id.
   * @format uuid
   * @minLength 36
   * @maxLength 36
   */
  blogId: string;
  /**
   * The authord id.
   * @format uuid
   * @minLength 36
   * @maxLength 36
   */
  authorId?: string;
  /**
   * @minLength 3
   * @maxLength 200
   */
  title: string;
  /**
   * The tenant associated with this tenant blog.
   * @minLength 50
   * @maxLength 10240
   */
  content: string;
}

export interface BlogList {
  pagination?: PaginationResponse;
  rows?: Blog[];
}

export interface Blog {
  metadata: APIResourceMeta;
  title: string;
  description?: string;
  /** The tenant associated with this tenant blog. */
  tenant?: Tenant;
  config?: {
    /** The number of posts to publish per day. */
    dayPublishCount?: number;
    /** The description of the blog. */
    description?: string;
  };
  /** The status of the blog. */
  status?: string;
  /** Whether the blog is enabled. */
  enabled?: boolean;
  /** The slug of the blog. */
  slug?: string;
}

export interface CreateBlogRequest {
  /** blog title to create. */
  title?: string;
}

export interface UpdateBlogRequest {
  /**
   * @minLength 3
   * @maxLength 200
   */
  title: string;
  /** @maxLength 1024 */
  description?: string;
}

export interface BlogPost {
  metadata: APIResourceMeta;
  title: string;
  /** The tenant associated with this tenant blog */
  content: string;
  state?: {
    /** post title */
    title?: string;
    /** post topic */
    topic?: string;
    /** post outlines */
    outlines?: {
      /** post outline title */
      title?: string;
      /** post outline content */
      content?: string;
    }[];
  };
}

export interface BlogPostList {
  pagination?: PaginationResponse;
  rows?: BlogPost[];
}

export interface UpdatePostRequest {
  /**
   * The blog id.
   * @format uuid
   * @minLength 36
   * @maxLength 36
   */
  blogId: string;
  /**
   * The authord id.
   * @format uuid
   * @minLength 36
   * @maxLength 36
   */
  authorId?: string;
  /**
   * @minLength 3
   * @maxLength 200
   */
  title: string;
  /**
   * The tenant associated with this tenant blog.
   * @minLength 50
   * @maxLength 10240
   */
  content: string;
}

export interface ArtifactList {
  pagination?: PaginationResponse;
  rows?: Artifact[];
}

export interface Artifact {
  metadata: APIResourceMeta;
  title: string;
  /** The tenant associated with this tenant blog. */
  state: object;
  nextId?: string;
  prevId?: string;
}

export interface AgentRunInput {
  sessionId?: string;
  content: string;
  tenantId?: string;
  runId?: string;
  stepRunId?: string;
  resourceId?: string;
  componentId?: string;
  topic?: string;
  source?: string;
  other?:
    | BrowserData
    | PlatformAccountData
    | InstagramTask
    | ChatSessionStartEvent
    | TerminationMessage
    | CodeReviewTask
    | CodeReviewResult
    | BrowserTask
    | BrowserOpenTask
    | MtTaskResult;
}

export interface ChatHistoryList {
  pagination?: PaginationResponse;
  rows?: ChatMessage[];
}

export interface ChatSession {
  metadata?: APIResourceMeta;
  title: string;
  componentId?: string;
}

/** 聊天 Session 列表 */
export interface ChatSessionList {
  pagination?: PaginationResponse;
  rows?: ChatSession[];
}

export interface TextHighlight {
  fullMarkdown: string;
  markdownBlock: string;
  selectedText: string;
}

export interface CodeHighlight {
  startCharIndex: number;
  endCharIndex: number;
}

export interface CustomQuickAction {
  /** A UUID for the quick action. Used to identify the quick action. */
  id: string;
  /** The title of the quick action. Used in the UI to display the quick action. */
  title: string;
  /** The prompt to use when the quick action is invoked. */
  prompt: string;
  /** Whether or not to include the user's reflections in the prompt. */
  includeReflections: boolean;
  /** Whether or not to include the default prefix in the prompt. */
  includePrefix: boolean;
  /** Whether or not to include the last 5 (or less) messages in the prompt. */
  includeRecentHistory: boolean;
}

/** 生成内容的反思规则 */
export interface Reflections {
  /** 生成内容时要遵循的样式规则 */
  styleRules: string[];
  /** 生成内容时要记住的关于用户的关键内容 */
  content: string[];
}

/** 工具内容长度,(文章,代码内容长度) */
export enum ArtifactLengthOptions {
  Shortest = "shortest",
  Short = "short",
  Long = "long",
  Longest = "longest",
}

export interface ArtifactToolResponse {
  artifact?: string;
  title?: string;
  language?: string;
  type?: string;
}

/** 阅读级别 */
export enum ReadingLevelOptions {
  Pirate = "pirate",
  Child = "child",
  Teenager = "teenager",
  College = "college",
  Phd = "phd",
}

export type SelectorGroupChatComponent = ComponentModel & {
  provider: "autogen_agentchat.teams.SelectorGroupChat";
  config: SelectorGroupChatConfig;
};

export type RoundRobinGroupChatComponent = ComponentModel & {
  provider: "autogen_agentchat.teams.RoundRobinGroupChat";
  config: RoundRobinGroupChatConfig;
};

export interface TeamConfigBase {
  participants: AgentComponent[];
  max_turns: number;
  termination_condition: TextMentionTerminationComponent;
}

export interface AgStateProperties {
  /** @default "1.0.0" */
  version?: string;
  type: StateType;
  componentId?: string;
  chatId?: string;
  topic?: string;
  source?: string;
  state:
    | AssistantAgentState
    | TeamState
    | RoundRobinManagerState
    | SelectorManagerState
    | SwarmManagerState
    | MagenticOneOrchestratorState
    | SocietyOfMindAgentState
    | ChatAgentContainerState
    | BaseGroupChatManagerState;
}

export type AgState = APIResourceMetaProperties & AgStateProperties;

export interface AgStateList {
  pagination?: PaginationResponse;
  rows?: AgState[];
}

export type AgStateUpsert = AgStateProperties & {
  /** 状态id */
  stateId?: string;
  /** 组件id */
  componentId: string;
  /** 聊天id */
  chatId: string;
  /** 租户id */
  tenantId?: string;
};

export enum StateType {
  AssistantAgentState = "AssistantAgentState",
  TeamState = "TeamState",
  RoundRobinManagerState = "RoundRobinManagerState",
  SelectorManagerState = "SelectorManagerState",
  SwarmManagerState = "SwarmManagerState",
  MagenticOneOrchestratorState = "MagenticOneOrchestratorState",
  SocietyOfMindAgentState = "SocietyOfMindAgentState",
  ChatAgentContainerState = "ChatAgentContainerState",
  BaseGroupChatManagerState = "BaseGroupChatManagerState",
}

export interface BaseState {
  type?: StateType;
  version?: string;
}

export type AssistantAgentState = BaseState & {
  type?: "AssistantAgentState";
  llm_context?: any;
};

export type TeamState = BaseState & {
  type?: "TeamState";
  agent_states?: any;
};

export type RoundRobinManagerState = BaseGroupChatManagerState & {
  type?: "RoundRobinManagerState";
  next_speaker_index?: number;
};

export type SelectorManagerState = BaseState & {
  type?: "SelectorManagerState";
  previous_speaker?: string;
};

export type SwarmManagerState = BaseState & {
  type?: "SwarmManagerState";
  current_speaker?: string;
};

export type MagenticOneOrchestratorState = BaseState & {
  type?: "MagenticOneOrchestratorState";
  task?: string;
  facts?: string;
  plan?: string;
  n_rounds?: number;
  n_stalls?: number;
};

export type SocietyOfMindAgentState = BaseState & {
  type?: "SocietyOfMindAgentState";
  inner_team_state?: any;
};

export type ChatAgentContainerState = BaseState & {
  type?: "ChatAgentContainerState";
  agent_state?: any;
  message_buffer?: ChatMessage[];
};

export type BaseGroupChatManagerState = BaseState & {
  type?: "BaseGroupChatManagerState";
  message_thread?: AgentEvent[];
  current_turn?: number;
};

export type MtComponent = APIResourceMetaProperties & MtComponentProperties;

export interface MtComponentList {
  pagination?: PaginationResponse;
  rows?: MtComponent[];
}

export interface MtComponentProperties {
  componentType: ComponentTypes;
  provider: string;
  label: string;
  description: string;
  /** @default 1 */
  version: number;
  /** @default 1 */
  componentVersion: number;
  galleryId?: string;
  config: Record<string, any>;
}

export interface ComponentModel {
  /** Unique identifier for the component. */
  id?: string;
  /** Describes how the component can be instantiated. */
  provider: string;
  /** Logical type of the component. If missing, the component assumes the default type of the provider. */
  componentType: ComponentTypes;
  /** Version of the component specification. If missing, the component assumes whatever is the current version of the library used to load it. This is obviously dangerous and should be used for user authored ephmeral config. For all other configs version should be specified. */
  version: number;
  /** Version of the component. If missing, the component assumes the default version of the provider. */
  componentVersion: number;
  /** Description of the component. */
  description: string;
  /** Human readable label for the component. If missing the component assumes the class name of the provider. */
  label: string;
}

export interface GalleryComponents {
  agents: ComponentModel[];
  models: ComponentModel[];
  tools: ComponentModel[];
  terminations: ComponentModel[];
}

export interface GalleryItems {
  teams: object[];
  components: GalleryComponents;
}

export interface Gallery {
  metadata: APIResourceMeta;
  name: string;
  url: string;
  author: string;
  homepage: string;
  description: string;
  tags: string[];
  license: string;
  lastSynced?: string;
}

export interface GalleryList {
  pagination?: PaginationResponse;
  rows?: Gallery[];
}

export interface GalleryUpdate {
  metadata: APIResourceMeta;
  name: string;
  userId: string;
}

export interface GalleryMetadata {
  author: string;
  created_at: string;
  updated_at: string;
  version: string;
  description?: string;
  tags?: string[];
  license?: string;
  homepage?: string;
  category?: string;
  last_synced?: string;
}

export interface AgEvent {
  metadata?: APIResourceMeta;
  userId?: string;
  data: object;
  framework: string;
  stepRunId: string;
  meta?: any;
}

export enum EventTypes {
  WorkflowRunStart = "WorkflowRunStart",
  WorkflowRunEnd = "WorkflowRunEnd",
  StepRun = "StepRun",
  TextMessage = "TextMessage",
  ModelClientStreamingChunkEvent = "ModelClientStreamingChunkEvent",
  EventNewAgentState = "EventNewAgentState",
}

export interface AgEventList {
  pagination?: PaginationResponse;
  rows?: AgEvent[];
}

export interface Outline {
  /** Title of the Wikipedia page */
  pageTitle: string;
  /** Titles and descriptions for each section of the Wikipedia page */
  sections: Section[];
}

export enum FlowNames {
  Assisant = "assisant",
  Ag = "ag",
  Browser = "browser",
  TenantSettings = "tenant_settings",
  Smola = "smola",
}

export enum TerminationTypes {
  MaxMessageTermination = "MaxMessageTermination",
  StopMessageTermination = "StopMessageTermination",
  TextMentionTermination = "TextMentionTermination",
  TimeoutTermination = "TimeoutTermination",
}

export type OrTerminationComponent = ComponentModel & {
  componentType: "termination";
  config: OrTerminationConfig;
};

export interface OrTerminationConfig {
  conditions: Record<string, any>[];
}

export type TenantComponent = ComponentModel & {
  provider: "mtmai.tenant.Tenant";
  config: TenantComponentConfig;
};

export interface TenantComponentConfig {
  default_openai_api_key?: string;
}

export type SystemComponent = ComponentModel & {
  provider: "mtmai.system.System";
  config: SystemConfig;
};

export interface SystemConfig {
  default_openai_api_key?: string;
}

export enum ComponentTypes {
  Team = "team",
  Agent = "agent",
  Model = "model",
  Tool = "tool",
  Termination = "termination",
}

export interface RequestUsage {
  prompt_tokens: number;
  completion_tokens: number;
}

export interface FunctionCall {
  id: string;
  arguments: string;
  name: string;
}

export interface FunctionExecutionResult {
  call_id: string;
  content: string;
}

export interface BaseMessageConfig {
  source?: string;
  models_usage?: RequestUsage;
}

export interface ImageContent {
  url: string;
  alt?: string;
  data?: string;
}

export type StopMessageConfig = BaseMessageConfig & {
  content: string;
};

export type HandoffMessageConfig = BaseMessageConfig & {
  content: string;
  target: string;
};

export type ToolCallMessageConfig = BaseMessageConfig & {
  content: FunctionCall[];
};

export type ToolCallResultMessageConfig = BaseMessageConfig & {
  content: FunctionExecutionResult[];
};

export interface TeamResult {
  task_result: object;
  usage: string;
  duration: number;
}

export interface ChatMessageUpsert {
  tenantId: string;
  content: string;
  componentId?: string;
  threadId?: string;
  runId?: string;
  role?: string;
  topic?: string;
  /** @default "user" */
  source: string;
  messageType?: string;
  agentType?: string;
  workflowRunId?: string;
  stepRunId?: string;
  thought?: string;
}

export type AgentMessageConfig =
  | StopMessageConfig
  | HandoffMessageConfig
  | ToolCallMessageConfig
  | ToolCallResultMessageConfig;

export type MemoryConfig = ComponentModel;

export interface MtTaskResult {
  messages: Record<string, any>[];
  stop_reason: string;
}

export enum AgentTypes {
  AssistantAgent = "AssistantAgent",
  UserProxyAgent = "UserProxyAgent",
  MultimodalWebSurfer = "MultimodalWebSurfer",
  FileSurfer = "FileSurfer",
  MagenticOneCoderAgent = "MagenticOneCoderAgent",
}

export enum ToolTypes {
  PythonFunction = "PythonFunction",
}

export interface Model {
  metadata?: APIResourceMeta;
  config?: ModelConfig;
}

export interface ModelConfig {
  model: string;
  model_type: ModelTypes;
  api_key?: string;
  base_url?: string;
  timeout?: number;
  max_retries?: number;
  frequency_penalty?: number;
  logit_bias?: number;
  max_tokens?: number;
  n?: number;
  presence_penalty?: number;
  response_format?: ResponseFormat;
  seed?: number;
  stop?: string[];
  temperature?: number;
  top_p?: number;
  user?: string;
  organization?: string;
  default_headers?: Record<string, any>;
  model_info?: ModelInfo;
}

export enum ModelFamily {
  R1 = "r1",
  Openai = "openai",
  Unknown = "unknown",
}

export interface ModelInfo {
  family: ModelFamily;
  vision: boolean;
  function_calling: boolean;
  json_output: boolean;
}

export enum ModelTypes {
  OpenAIChatCompletionClient = "OpenAIChatCompletionClient",
  AzureOpenAIChatCompletionClient = "AzureOpenAIChatCompletionClient",
}

export type AzureOpenAIModelConfig = ModelConfig & {
  model_type: "AzureOpenAIChatCompletionClient";
  azure_deployment: string;
  api_version: string;
  azure_endpoint: string;
  azure_ad_token_provider: string;
};

export type OpenAIModelConfig = ModelConfig & {
  model_type: "OpenAIChatCompletionClient";
};

export type ToolComponent = ComponentModel & {
  componentType: "tool";
  config: ToolConfig;
};

export interface ToolConfig {
  name: string;
  description?: string;
  source_code?: string;
  global_imports?: string[];
  has_cancellation_support?: boolean;
}

export type HandoffComponent = ComponentModel & HandoffConfig;

export interface HandoffConfig {
  target: string;
}

export type ModelComponent = ComponentModel & {
  componentType: "model";
  config: ModelConfig;
};

export enum ResponseFormat {
  JsonObject = "json_object",
  Text = "text",
}

export enum RunStatus {
  Created = "created",
  Active = "active",
  AwaitingInput = "awaiting_input",
  Timeout = "timeout",
  Complete = "complete",
  Error = "error",
  Stopped = "stopped",
}

export interface Section {
  /** Title of the section */
  section_title: string;
  /** Content of the section */
  description: string;
  /** Titles and descriptions for each subsection of the Wikipedia page */
  subsections?: Subsection[];
}

export interface Subsection {
  /** Title of the subsection */
  subsectionTitle: string;
  /** Content of the subsection */
  description: string;
}

export type RoundRobinGroupChatConfig = TeamConfigBase & {
  participants: AgentComponent[];
  termination_condition: TextMentionTerminationComponent;
};

export type SelectorGroupChatConfig = TeamConfigBase & {
  participants: AgentComponent[];
  termination_condition: TextMentionTerminationComponent;
  model_client?: ModelComponent;
};

export type MaxMessageTerminationComponent = ComponentModel & {
  componentType: "termination";
  provider: "autogen_agentchat.conditions.MaxMessageTermination";
  config: MaxMessageTerminationConfig;
};

export type StopMessageTerminationComponent = ComponentModel & {
  componentType: "termination";
  provider: "autogen_agentchat.conditions.StopMessageTermination";
  config: StopMessageTerminationConfig;
};

export interface StopMessageTerminationConfig {
  text: string;
}

export type MaxMessageTerminationConfig = {
  termination_type: "MaxMessageTermination";
  max_messages: number;
};

export type TextMentionTerminationComponent = ComponentModel & {
  componentType: "termination";
  provider: "autogen_agentchat.conditions.TextMentionTermination";
  config: TextMentionTerminationConfig;
};

export interface TextMentionTerminationConfig {
  text: string;
}

export type AssistantAgentComponent = AgentComponent & {
  provider: "mtmai.agents.assistant_agent.AssistantAgent";
  config: AssistantAgentConfig;
};

export type AssistantAgentConfig = AgentConfig & {
  model_client: ModelComponent;
};

export type InstagramAgentComponent = AgentComponent & {
  provider: "mtmai.agents.instagram_agent.InstagramAgent";
  config: InstagramAgentConfig;
};

export type InstagramAgentConfig = AgentConfig;

export enum TeamTypes {
  RoundRobinGroupChat = "RoundRobinGroupChat",
  SelectorGroupChat = "SelectorGroupChat",
  MagenticOneGroupChat = "MagenticOneGroupChat",
  InstagramTeam = "InstagramTeam",
}

export interface ModelContext {
  some?: string;
}

/**
 * @format uuid
 * @minLength 36
 * @maxLength 36
 */
export type TenantParameter = string;

export type HttpCommonStatusResponse = any;

export interface Prompt {
  metadata: APIResourceMeta;
  title: string;
  content: string;
  tags: string[];
}

export interface PromptList {
  pagination?: PaginationResponse;
  rows?: Artifact[];
}

export interface ComponentGet {
  id?: string;
  label?: string;
}

export type BadRequest = APIErrors;

/** Forbidden */
export type Forbidden = APIErrors;

/** Not found */
export type NotFound = APIErrors;

export interface ModelList {
  pagination?: PaginationResponse;
  rows?: Model[];
}

export interface UpdateModel {
  metadata?: APIResourceMeta;
  name?: string;
}

export interface FormField {
  name: string;
  type: string;
}

export interface SchemaForm {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface ModelRunProperties {
  request?: Record<string, string>;
  response?: Record<string, string>;
}

export type ModelRun = APIResourceMetaProperties & ModelRunProperties;

export type ModelRunUpsert = ModelRunProperties;

/** site */
export interface Site {
  metadata: APIResourceMeta;
  /** site 标题 */
  title: string;
  /** site 描述 */
  description: string;
}

export interface SiteList {
  pagination?: PaginationResponse;
  rows?: Site[];
}

export interface CreateSiteRequest {
  /** site 标题 */
  title: string;
  /** site 描述 */
  description: string;
  /** 入站域名(指定绑定入站域名) */
  host?: string;
}

export type CreateSiteResponse = Site;

export interface UpdateSiteRequest {
  /** site 标题 */
  title?: string;
}

/** site-host */
export interface SiteHost {
  metadata: APIResourceMeta;
  /** site-host 标题 */
  title: string;
  /** site-host 描述 */
  description: string;
  /** 绑定域名 */
  host: string;
}

export interface SiteHostList {
  pagination?: PaginationResponse;
  rows?: SiteHost[];
}

export interface CreateSiteHostRequest {
  /** 站点ID */
  siteId: string;
  /** site-host 标题 */
  title: string;
  /** site-host 描述 */
  description: string;
  /** 绑定域名 */
  host: string;
}

export type CreateSiteHostResponse = SiteHost;

export type UpdateSiteHostRequest = SiteHost;

export type UpdateSiteHostResponse = SiteHost;

export interface Post {
  metadata: APIResourceMeta;
  title: string;
  /** The tenant associated with this tenant blog */
  content: string;
}

export interface PostList {
  pagination?: PaginationResponse;
  rows?: Post[];
}

export interface CreatePostRequest {
  /**
   * @format uuid
   * @minLength 36
   * @maxLength 36
   */
  siteId: string;
  /**
   * @minLength 3
   * @maxLength 200
   */
  title: string;
  /**
   * The tenant associated with this tenant blog.
   * @minLength 50
   * @maxLength 10240
   */
  content: string;
  /**
   * The slug of the post
   * @minLength 3
   * @maxLength 200
   */
  slug: string;
  /**
   * @format uuid
   * @minLength 36
   * @maxLength 36
   */
  authorId?: string;
  status?: "draft" | "published";
}

export interface FrontendConfig {
  /** Cookie access token */
  cookieAccessToken: string;
  /** Dashboard path */
  dashPath: string;
  /** Hot key debug */
  hotKeyDebug: string;
  /** 实验性质，默认租户的access token */
  defaultTenantAccessToken: string;
}

export interface SiderbarConfig {
  /** logo */
  logo?: string;
  sideritems?: DashSidebarItem[];
}

export interface DashSidebarItem {
  /** 名称 */
  title: string;
  /** url 例如/login */
  url: string;
  /** 图标 */
  icon?: string;
  /** 默认展开 */
  defaultExpanded?: boolean;
  /** 只允许超级管理员查看 */
  adminOnly?: boolean;
  children?: DashSidebarItemLeaf[];
}

export interface DashSidebarItemLeaf {
  /** 名称 */
  title: string;
  /** url 例如/login */
  url: string;
  /** 图标 */
  icon?: string;
  /** 只允许超级管理员查看 */
  adminOnly?: boolean;
}

export interface HfAccount {
  metadata: APIResourceMeta;
  /** The username of the hf account. */
  username: string;
  /** The token of the hf account. */
  token: string;
}

/** 环境变量 */
export interface Env {
  metadata: APIResourceMeta;
  /** 环境变量名称 */
  name: string;
  /** 环境变量值 */
  value: string;
}

export interface EnvList {
  pagination?: PaginationResponse;
  rows?: Env[];
}

export interface Endpoint {
  metadata: APIResourceMeta;
  name: string;
  url: string;
  token: string;
  type: string;
}

export interface EndpointList {
  pagination?: PaginationResponse;
  rows?: Endpoint[];
}

export interface UpdateEndpointRequest {
  name?: string;
  url?: string;
  token?: string;
}

export interface Platform {
  metadata: APIResourceMeta;
  name: string;
  description?: string;
  url: string;
  loginUrl?: string;
  properties?: object;
  tags?: string[];
}

export interface PlatformList {
  pagination?: PaginationResponse;
  rows?: Platform[];
}

export interface PlatformUpdate {
  metadata: APIResourceMeta;
  name: string;
  description?: string;
  url: string;
  loginUrl?: string;
  properties?: object;
  tags?: string[];
}

export interface PlatformAccountProperties {
  username: string;
  email?: string;
  password?: string;
  token?: string;
  type?: string;
  platform: string;
  enabled?: boolean;
  comment?: string;
  tags?: string[];
  properties?: any;
}

export type PlatformAccount = APIResourceMetaProperties &
  PlatformAccountProperties;

export interface PlatformAccountList {
  pagination?: PaginationResponse;
  rows?: PlatformAccount[];
}

export type PlatformAccountUpdate = PlatformAccountProperties;

export interface Browser {
  metadata: APIResourceMeta;
  name: string;
  description?: string;
  url: string;
  loginUrl?: string;
  properties?: object;
  tags?: string[];
}

export interface BrowserList {
  pagination?: PaginationResponse;
  rows?: Browser[];
}

export interface BrowserUpdate {
  metadata: APIResourceMeta;
  name: string;
  description?: string;
  url: string;
  loginUrl?: string;
  properties?: object;
  tags?: string[];
}

export interface Proxy {
  metadata: APIResourceMeta;
  name: string;
  description?: string;
  url: string;
  loginUrl?: string;
  properties?: object;
  tags?: string[];
}

export interface ProxyList {
  pagination?: PaginationResponse;
  rows?: Proxy[];
}

export interface ProxyUpdate {
  metadata: APIResourceMeta;
  name: string;
  description?: string;
  url: string;
  loginUrl?: string;
  properties?: object;
  tags?: string[];
}

export interface UiAgentState {
  welcome?: ChatWelcome;
  /** 线程ID(sessionId) */
  thread_id?: string;
  /** 当前选定的 team id */
  team_id?: string;
}

export interface QuickStart {
  /** 图标 */
  icon?: string;
  /** 组件ID (团队ID) */
  com_id?: string;
  /** 摘要 */
  title?: string;
  /** 提交跟 agent 的内容 */
  content: string;
  /** html class name */
  cn?: string;
}

export interface ChatWelcome {
  /** 欢迎语标题 */
  title?: string;
  /** 欢迎语内容 */
  content?: string;
  /** 主标题 */
  subTitle?: string;
  quick_starts?: QuickStart[];
}

export interface AssignedAction {
  tenantId: string;
  workflowRunId?: string;
  getGroupKeyRunId?: string;
  jobId: string;
  jobName?: string;
  stepId: string;
  stepRunId?: string;
  actionId: string;
  actionType: string;
  actionPayload: string;
  stepName: string;
  retryCount: number;
  additional_metadata?: string;
  child_workflow_index?: number;
  child_workflow_key?: string;
  parent_workflow_run_id?: string;
}

export interface MtResourceProperties {
  /** The resource title */
  title: string;
  /** The resource description */
  description?: string;
  /** The resource version */
  version?: string;
  /** The resource url */
  url?: string;
  /** The resource type */
  type: string;
  content?: Record<string, any>;
}

export type MtResource = APIResourceMetaProperties & MtResourceProperties;

export interface MtResourceList {
  metadata?: APIResourceMeta;
  rows?: MtResource[];
  pagination?: PaginationResponse;
}

export type MtResourceUpsert = APIResourceMetaProperties & MtResourceProperties;

export interface PlatformAccountData {
  type?: "platform_account";
  email?: string;
  password?: string;
  username?: string;
  api_token?: string;
}

export interface BrowserData {
  type?: "browser";
  cookies?: string;
  session?: string;
}

export interface InstagramTask {
  resourceId?: string;
  content?: string;
}

export interface ChatSessionStartEvent {
  type?: string;
  threadId?: string;
  source?: string;
}

export interface TerminationMessage {
  reason?: string;
  content?: string;
}

export interface CodeReviewTask {
  session_id: string;
  code_writing_task: string;
  code_writing_scratchpad: string;
  code: string;
}

export interface CodeReviewResult {
  review: string;
  session_id: string;
  approved: boolean;
}

/** 浏览器(browser use)任务 */
export interface BrowserTask {
  content: string;
}

/** 打开浏览器备用,一般用于调试目的Open a browser and navigate to a URL. */
export interface BrowserOpenTask {
  url: string;
}

export type InstagramTeamComponent = ComponentModel & {
  provider: "mtmai.teams.instagram_team.InstagramTeam";
  config: InstagramTeamConfig;
};

export type InstagramTeamConfig = TeamConfigBase & {
  participants: (InstagramAgentComponent | AssistantAgentComponent)[];
  termination_condition: OrTerminationComponent;
};

/** 浏览器配置(未完成) */
export interface BrowserConfig {
  persistent?: boolean;
}

export type AgentComponent = ComponentModel & {
  componentType: "agent";
  config: AgentConfig;
};

export interface AgentConfig {
  name: string;
  description: string;
  model_context?: Record<string, any>;
  memory?: MemoryConfig;
  /** @default false */
  model_client_stream: boolean;
  system_message?: string;
  model_client: ModelComponent;
  /** @default [] */
  tools: ToolComponent[];
  /** @default [] */
  handoffs: string[];
  /** @default false */
  reflect_on_tool_use: boolean;
  /** @default "{result}" */
  tool_call_summary_format: string;
}

export interface TenantSetting {
  /** The id of the tenant setting */
  id?: string;
}

export enum AgentEventType {
  ThoughtEvent = "ThoughtEvent",
  TextMessage = "TextMessage",
}

export type AgentEvent = ThoughtEvent | TextMessage;

export interface TextMessage {
  type?: "TextMessage";
  source?: string;
  content?: string;
  metadata?: Record<string, any>;
  models_usage?: Record<string, any>;
}

export interface ThoughtEvent {
  type: "ThoughtEvent";
  source: string;
  content?: string;
  metadata?: Record<string, any>;
  models_usage?: Record<string, any>;
}
