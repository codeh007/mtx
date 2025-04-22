import { relations } from "drizzle-orm/relations";
import {
  site,
  siteHost,
  tenant,
  event,
  endpoint,
  user,
  post,
  messages,
  workflowRun,
  stepRun,
  controllerPartition,
  schedulerPartition,
  tenantWorkerPartition,
  apiToken,
  action,
  agentNode,
  agentNodeRun,
  chat,
  artifact,
  assisant,
  blog,
  blogConfig,
  blogPost,
  chatMessage,
  comment,
  ticker,
  getGroupKeyRun,
  worker,
  dispatcher,
  webhookWorker,
  integration,
  job,
  workflowVersion,
  workflow,
  jobRun,
  jobRunLookupData,
  logLine,
  media,
  messagesGroup,
  prompt,
  reply,
  snsIntegration,
  service,
  slackAppWebhook,
  socialMediaAgency,
  step,
  stepDesiredWorkerLabel,
  rateLimit,
  stepRateLimit,
  stepRunResultArchive,
  streamEvent,
  tenantAlertEmailGroup,
  tenantAlertingSettings,
  tenantInviteLink,
  tenantMember,
  tenantResourceLimit,
  tenantResourceLimitAlert,
  tenantVcsProvider,
  userOauth,
  userPassword,
  userSession,
  webhookWorkerRequest,
  webhookWorkerWorkflow,
  workerAssignEvent,
  workerLabel,
  workflowConcurrency,
  workflowRunStickyState,
  workflowTriggers,
  workflowTriggerCronRef,
  workflowRunTriggeredBy,
  workflowTriggerScheduledRef,
  workflowTag,
  workflowTriggerEventRef,
  actionToWorker,
  blogPostToTag,
  tag,
  mediaToUser,
  serviceToWorker,
  stepOrder,
  stepRunOrder,
  workflowToWorkflowTag,
  socialMediaAgencyNiche,
  kvStore,
} from "./schema";

export const siteHostRelations = relations(siteHost, ({ one }) => ({
  site: one(site, {
    fields: [siteHost.siteId],
    references: [site.id],
  }),
}));

export const siteRelations = relations(site, ({ one, many }) => ({
  siteHosts: many(siteHost),
  tenant: one(tenant, {
    fields: [site.tenantId],
    references: [tenant.id],
  }),
  posts: many(post),
}));

export const tenantRelations = relations(tenant, ({ one, many }) => ({
  sites: many(site),
  endpoints: many(endpoint),
  posts: many(post),
  controllerPartition: one(controllerPartition, {
    fields: [tenant.controllerPartitionId],
    references: [controllerPartition.id],
  }),
  schedulerPartition: one(schedulerPartition, {
    fields: [tenant.schedulerPartitionId],
    references: [schedulerPartition.id],
  }),
  tenantWorkerPartition: one(tenantWorkerPartition, {
    fields: [tenant.workerPartitionId],
    references: [tenantWorkerPartition.id],
  }),
  apiTokens: many(apiToken),
  actions: many(action),
  agentNodes: many(agentNode),
  agentNodeRuns: many(agentNodeRun),
  chats: many(chat),
  artifacts: many(artifact),
  assisants: many(assisant),
  blogs: many(blog),
  blogPosts: many(blogPost),
  integrations: many(integration),
  media: many(media),
  prompts: many(prompt),
  snsIntegrations: many(snsIntegration),
  services: many(service),
  slackAppWebhooks: many(slackAppWebhook),
  tenantAlertEmailGroups: many(tenantAlertEmailGroup),
  tenantAlertingSettings: many(tenantAlertingSettings),
  tenantInviteLinks: many(tenantInviteLink),
  tenantMembers: many(tenantMember),
  tenantResourceLimits: many(tenantResourceLimit),
  tenantResourceLimitAlerts: many(tenantResourceLimitAlert),
  tenantVcsProviders: many(tenantVcsProvider),
  webhookWorkers: many(webhookWorker),
  workflowTags: many(workflowTag),
  workflowTriggers: many(workflowTriggers),
  kvStores: many(kvStore),
}));

export const eventRelations = relations(event, ({ one, many }) => ({
  event: one(event, {
    fields: [event.replayedFromId],
    references: [event.id],
    relationName: "event_replayedFromId_event_id",
  }),
  events: many(event, {
    relationName: "event_replayedFromId_event_id",
  }),
}));

export const endpointRelations = relations(endpoint, ({ one }) => ({
  tenant: one(tenant, {
    fields: [endpoint.tenantId],
    references: [tenant.id],
  }),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
  message: one(messages, {
    fields: [post.lastMessageId],
    references: [messages.id],
  }),
  post: one(post, {
    fields: [post.parentPostId],
    references: [post.id],
    relationName: "post_parentPostId_post_id",
  }),
  posts: many(post, {
    relationName: "post_parentPostId_post_id",
  }),
  site: one(site, {
    fields: [post.siteId],
    references: [site.id],
  }),
  tenant: one(tenant, {
    fields: [post.tenantId],
    references: [tenant.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  workflowRuns: many(workflowRun),
  chats: many(chat),
  blogPosts: many(blogPost),
  comments: many(comment),
  replies: many(reply),
  socialMediaAgencies: many(socialMediaAgency),
  tenantMembers: many(tenantMember),
  userOauths: many(userOauth),
  userPasswords: many(userPassword),
  userSessions: many(userSession),
  mediaToUsers: many(mediaToUser),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  posts: many(post),
  messagesGroup: one(messagesGroup, {
    fields: [messages.groupId],
    references: [messagesGroup.id],
  }),
}));

export const workflowRunRelations = relations(workflowRun, ({ one, many }) => ({
  user: one(user, {
    fields: [workflowRun.byUserId],
    references: [user.id],
  }),
  workflowRun: one(workflowRun, {
    fields: [workflowRun.parentId],
    references: [workflowRun.id],
    relationName: "workflowRun_parentId_workflowRun_id",
  }),
  workflowRuns: many(workflowRun, {
    relationName: "workflowRun_parentId_workflowRun_id",
  }),
  stepRun: one(stepRun, {
    fields: [workflowRun.parentStepRunId],
    references: [stepRun.id],
  }),
  getGroupKeyRuns: many(getGroupKeyRun),
  jobRuns: many(jobRun),
  workflowRunStickyStates: many(workflowRunStickyState),
  workflowTriggerScheduledRefs: many(workflowTriggerScheduledRef),
}));

export const stepRunRelations = relations(stepRun, ({ one, many }) => ({
  workflowRuns: many(workflowRun),
  jobRun: one(jobRun, {
    fields: [stepRun.jobRunId],
    references: [jobRun.id],
  }),
  worker: one(worker, {
    fields: [stepRun.workerId],
    references: [worker.id],
  }),
  logLines: many(logLine),
  stepRunResultArchives: many(stepRunResultArchive),
  streamEvents: many(streamEvent),
  workflowTriggerScheduledRefs: many(workflowTriggerScheduledRef),
  stepRunOrders_a: many(stepRunOrder, {
    relationName: "stepRunOrder_a_stepRun_id",
  }),
  stepRunOrders_b: many(stepRunOrder, {
    relationName: "stepRunOrder_b_stepRun_id",
  }),
}));

export const controllerPartitionRelations = relations(controllerPartition, ({ many }) => ({
  tenants: many(tenant),
}));

export const schedulerPartitionRelations = relations(schedulerPartition, ({ many }) => ({
  tenants: many(tenant),
}));

export const tenantWorkerPartitionRelations = relations(tenantWorkerPartition, ({ many }) => ({
  tenants: many(tenant),
}));

export const apiTokenRelations = relations(apiToken, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [apiToken.tenantId],
    references: [tenant.id],
  }),
  webhookWorkers: many(webhookWorker),
}));

export const actionRelations = relations(action, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [action.tenantId],
    references: [tenant.id],
  }),
  steps: many(step),
  workflowConcurrencies: many(workflowConcurrency),
  actionToWorkers: many(actionToWorker),
}));

export const agentNodeRelations = relations(agentNode, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [agentNode.tenantId],
    references: [tenant.id],
  }),
  agentNodeRuns: many(agentNodeRun),
}));

export const agentNodeRunRelations = relations(agentNodeRun, ({ one }) => ({
  agentNode: one(agentNode, {
    fields: [agentNodeRun.nodeId],
    references: [agentNode.id],
  }),
  tenant: one(tenant, {
    fields: [agentNodeRun.tenantId],
    references: [tenant.id],
  }),
}));

export const chatRelations = relations(chat, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [chat.tenantId],
    references: [tenant.id],
  }),
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
  artifacts: many(artifact),
  chatMessages: many(chatMessage),
}));

export const artifactRelations = relations(artifact, ({ one }) => ({
  chat: one(chat, {
    fields: [artifact.chatId],
    references: [chat.id],
  }),
  tenant: one(tenant, {
    fields: [artifact.tenantId],
    references: [tenant.id],
  }),
}));

export const assisantRelations = relations(assisant, ({ one }) => ({
  tenant: one(tenant, {
    fields: [assisant.tenantId],
    references: [tenant.id],
  }),
}));

export const blogRelations = relations(blog, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [blog.tenantId],
    references: [tenant.id],
  }),
  blogConfigs: many(blogConfig),
  blogPosts: many(blogPost),
}));

export const blogConfigRelations = relations(blogConfig, ({ one }) => ({
  blog: one(blog, {
    fields: [blogConfig.blogId],
    references: [blog.id],
  }),
}));

export const blogPostRelations = relations(blogPost, ({ one, many }) => ({
  user: one(user, {
    fields: [blogPost.authorId],
    references: [user.id],
  }),
  blog: one(blog, {
    fields: [blogPost.blogId],
    references: [blog.id],
  }),
  tenant: one(tenant, {
    fields: [blogPost.tenantId],
    references: [tenant.id],
  }),
  comments: many(comment),
  blogPostToTags: many(blogPostToTag),
}));

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
  chat: one(chat, {
    fields: [chatMessage.chatId],
    references: [chat.id],
  }),
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: one(user, {
    fields: [comment.authorId],
    references: [user.id],
  }),
  blogPost: one(blogPost, {
    fields: [comment.blogId],
    references: [blogPost.id],
  }),
  replies: many(reply),
}));

export const getGroupKeyRunRelations = relations(getGroupKeyRun, ({ one }) => ({
  ticker: one(ticker, {
    fields: [getGroupKeyRun.tickerId],
    references: [ticker.id],
  }),
  worker: one(worker, {
    fields: [getGroupKeyRun.workerId],
    references: [worker.id],
  }),
  workflowRun: one(workflowRun, {
    fields: [getGroupKeyRun.workflowRunId],
    references: [workflowRun.id],
  }),
}));

export const tickerRelations = relations(ticker, ({ many }) => ({
  getGroupKeyRuns: many(getGroupKeyRun),
  tenantAlertingSettings: many(tenantAlertingSettings),
  workflowTriggerCronRefs: many(workflowTriggerCronRef),
  workflowTriggerScheduledRefs: many(workflowTriggerScheduledRef),
}));

export const workerRelations = relations(worker, ({ one, many }) => ({
  getGroupKeyRuns: many(getGroupKeyRun),
  dispatcher: one(dispatcher, {
    fields: [worker.dispatcherId],
    references: [dispatcher.id],
  }),
  webhookWorker: one(webhookWorker, {
    fields: [worker.webhookId],
    references: [webhookWorker.id],
  }),
  stepRuns: many(stepRun),
  workerAssignEvents: many(workerAssignEvent),
  workerLabels: many(workerLabel),
  actionToWorkers: many(actionToWorker),
  serviceToWorkers: many(serviceToWorker),
}));

export const dispatcherRelations = relations(dispatcher, ({ many }) => ({
  workers: many(worker),
}));

export const webhookWorkerRelations = relations(webhookWorker, ({ one, many }) => ({
  workers: many(worker),
  tenant: one(tenant, {
    fields: [webhookWorker.tenantId],
    references: [tenant.id],
  }),
  apiToken: one(apiToken, {
    fields: [webhookWorker.tokenId],
    references: [apiToken.id],
  }),
  webhookWorkerRequests: many(webhookWorkerRequest),
  webhookWorkerWorkflows: many(webhookWorkerWorkflow),
}));

export const integrationRelations = relations(integration, ({ one }) => ({
  tenant: one(tenant, {
    fields: [integration.tenantId],
    references: [tenant.id],
  }),
}));

export const workflowVersionRelations = relations(workflowVersion, ({ one, many }) => ({
  job: one(job, {
    fields: [workflowVersion.onFailureJobId],
    references: [job.id],
    relationName: "workflowVersion_onFailureJobId_job_id",
  }),
  workflow: one(workflow, {
    fields: [workflowVersion.workflowId],
    references: [workflow.id],
  }),
  jobs: many(job, {
    relationName: "job_workflowVersionId_workflowVersion_id",
  }),
  workflowConcurrencies: many(workflowConcurrency),
  workflowTriggerScheduledRefs: many(workflowTriggerScheduledRef),
  workflowTriggers: many(workflowTriggers),
}));

export const jobRelations = relations(job, ({ one, many }) => ({
  workflowVersions: many(workflowVersion, {
    relationName: "workflowVersion_onFailureJobId_job_id",
  }),
  workflowVersion: one(workflowVersion, {
    fields: [job.workflowVersionId],
    references: [workflowVersion.id],
    relationName: "job_workflowVersionId_workflowVersion_id",
  }),
  steps: many(step),
}));

export const workflowRelations = relations(workflow, ({ many }) => ({
  workflowVersions: many(workflowVersion),
  webhookWorkerWorkflows: many(webhookWorkerWorkflow),
  workflowToWorkflowTags: many(workflowToWorkflowTag),
}));

export const jobRunRelations = relations(jobRun, ({ one, many }) => ({
  workflowRun: one(workflowRun, {
    fields: [jobRun.workflowRunId],
    references: [workflowRun.id],
  }),
  jobRunLookupData: many(jobRunLookupData),
  stepRuns: many(stepRun),
}));

export const jobRunLookupDataRelations = relations(jobRunLookupData, ({ one }) => ({
  jobRun: one(jobRun, {
    fields: [jobRunLookupData.jobRunId],
    references: [jobRun.id],
  }),
}));

export const logLineRelations = relations(logLine, ({ one }) => ({
  stepRun: one(stepRun, {
    fields: [logLine.stepRunId],
    references: [stepRun.id],
  }),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [media.tenantId],
    references: [tenant.id],
  }),
  socialMediaAgencies: many(socialMediaAgency),
  mediaToUsers: many(mediaToUser),
}));

export const messagesGroupRelations = relations(messagesGroup, ({ many }) => ({
  messages: many(messages),
}));

export const promptRelations = relations(prompt, ({ one }) => ({
  tenant: one(tenant, {
    fields: [prompt.tenantId],
    references: [tenant.id],
  }),
}));

export const replyRelations = relations(reply, ({ one }) => ({
  user: one(user, {
    fields: [reply.authorId],
    references: [user.id],
  }),
  comment: one(comment, {
    fields: [reply.commentId],
    references: [comment.id],
  }),
}));

export const snsIntegrationRelations = relations(snsIntegration, ({ one }) => ({
  tenant: one(tenant, {
    fields: [snsIntegration.tenantId],
    references: [tenant.id],
  }),
}));

export const serviceRelations = relations(service, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [service.tenantId],
    references: [tenant.id],
  }),
  serviceToWorkers: many(serviceToWorker),
}));

export const slackAppWebhookRelations = relations(slackAppWebhook, ({ one }) => ({
  tenant: one(tenant, {
    fields: [slackAppWebhook.tenantId],
    references: [tenant.id],
  }),
}));

export const socialMediaAgencyRelations = relations(socialMediaAgency, ({ one, many }) => ({
  media: one(media, {
    fields: [socialMediaAgency.logoId],
    references: [media.id],
  }),
  user: one(user, {
    fields: [socialMediaAgency.userId],
    references: [user.id],
  }),
  socialMediaAgencyNiches: many(socialMediaAgencyNiche),
}));

export const stepRelations = relations(step, ({ one, many }) => ({
  action: one(action, {
    fields: [step.tenantId],
    references: [action.actionId],
  }),
  job: one(job, {
    fields: [step.jobId],
    references: [job.id],
  }),
  stepDesiredWorkerLabels: many(stepDesiredWorkerLabel),
  stepOrders_a: many(stepOrder, {
    relationName: "stepOrder_a_step_id",
  }),
  stepOrders_b: many(stepOrder, {
    relationName: "stepOrder_b_step_id",
  }),
}));

export const stepDesiredWorkerLabelRelations = relations(stepDesiredWorkerLabel, ({ one }) => ({
  step: one(step, {
    fields: [stepDesiredWorkerLabel.stepId],
    references: [step.id],
  }),
}));

export const stepRateLimitRelations = relations(stepRateLimit, ({ one }) => ({
  rateLimit: one(rateLimit, {
    fields: [stepRateLimit.rateLimitKey],
    references: [rateLimit.tenantId],
  }),
}));

export const rateLimitRelations = relations(rateLimit, ({ many }) => ({
  stepRateLimits: many(stepRateLimit),
}));

export const stepRunResultArchiveRelations = relations(stepRunResultArchive, ({ one }) => ({
  stepRun: one(stepRun, {
    fields: [stepRunResultArchive.stepRunId],
    references: [stepRun.id],
  }),
}));

export const streamEventRelations = relations(streamEvent, ({ one }) => ({
  stepRun: one(stepRun, {
    fields: [streamEvent.stepRunId],
    references: [stepRun.id],
  }),
}));

export const tenantAlertEmailGroupRelations = relations(tenantAlertEmailGroup, ({ one }) => ({
  tenant: one(tenant, {
    fields: [tenantAlertEmailGroup.tenantId],
    references: [tenant.id],
  }),
}));

export const tenantAlertingSettingsRelations = relations(tenantAlertingSettings, ({ one }) => ({
  tenant: one(tenant, {
    fields: [tenantAlertingSettings.tenantId],
    references: [tenant.id],
  }),
  ticker: one(ticker, {
    fields: [tenantAlertingSettings.tickerId],
    references: [ticker.id],
  }),
}));

export const tenantInviteLinkRelations = relations(tenantInviteLink, ({ one }) => ({
  tenant: one(tenant, {
    fields: [tenantInviteLink.tenantId],
    references: [tenant.id],
  }),
}));

export const tenantMemberRelations = relations(tenantMember, ({ one }) => ({
  tenant: one(tenant, {
    fields: [tenantMember.tenantId],
    references: [tenant.id],
  }),
  user: one(user, {
    fields: [tenantMember.userId],
    references: [user.id],
  }),
}));

export const tenantResourceLimitRelations = relations(tenantResourceLimit, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [tenantResourceLimit.tenantId],
    references: [tenant.id],
  }),
  tenantResourceLimitAlerts: many(tenantResourceLimitAlert),
}));

export const tenantResourceLimitAlertRelations = relations(tenantResourceLimitAlert, ({ one }) => ({
  tenantResourceLimit: one(tenantResourceLimit, {
    fields: [tenantResourceLimitAlert.resourceLimitId],
    references: [tenantResourceLimit.id],
  }),
  tenant: one(tenant, {
    fields: [tenantResourceLimitAlert.tenantId],
    references: [tenant.id],
  }),
}));

export const tenantVcsProviderRelations = relations(tenantVcsProvider, ({ one }) => ({
  tenant: one(tenant, {
    fields: [tenantVcsProvider.tenantId],
    references: [tenant.id],
  }),
}));

export const userOauthRelations = relations(userOauth, ({ one }) => ({
  user: one(user, {
    fields: [userOauth.userId],
    references: [user.id],
  }),
}));

export const userPasswordRelations = relations(userPassword, ({ one }) => ({
  user: one(user, {
    fields: [userPassword.userId],
    references: [user.id],
  }),
}));

export const userSessionRelations = relations(userSession, ({ one }) => ({
  user: one(user, {
    fields: [userSession.userId],
    references: [user.id],
  }),
}));

export const webhookWorkerRequestRelations = relations(webhookWorkerRequest, ({ one }) => ({
  webhookWorker: one(webhookWorker, {
    fields: [webhookWorkerRequest.webhookWorkerId],
    references: [webhookWorker.id],
  }),
}));

export const webhookWorkerWorkflowRelations = relations(webhookWorkerWorkflow, ({ one }) => ({
  webhookWorker: one(webhookWorker, {
    fields: [webhookWorkerWorkflow.webhookWorkerId],
    references: [webhookWorker.id],
  }),
  workflow: one(workflow, {
    fields: [webhookWorkerWorkflow.workflowId],
    references: [workflow.id],
  }),
}));

export const workerAssignEventRelations = relations(workerAssignEvent, ({ one }) => ({
  worker: one(worker, {
    fields: [workerAssignEvent.workerId],
    references: [worker.id],
  }),
}));

export const workerLabelRelations = relations(workerLabel, ({ one }) => ({
  worker: one(worker, {
    fields: [workerLabel.workerId],
    references: [worker.id],
  }),
}));

export const workflowConcurrencyRelations = relations(workflowConcurrency, ({ one }) => ({
  action: one(action, {
    fields: [workflowConcurrency.getConcurrencyGroupId],
    references: [action.id],
  }),
  workflowVersion: one(workflowVersion, {
    fields: [workflowConcurrency.workflowVersionId],
    references: [workflowVersion.id],
  }),
}));

export const workflowRunStickyStateRelations = relations(workflowRunStickyState, ({ one }) => ({
  workflowRun: one(workflowRun, {
    fields: [workflowRunStickyState.workflowRunId],
    references: [workflowRun.id],
  }),
}));

export const workflowTriggerCronRefRelations = relations(
  workflowTriggerCronRef,
  ({ one, many }) => ({
    workflowTrigger: one(workflowTriggers, {
      fields: [workflowTriggerCronRef.parentId],
      references: [workflowTriggers.id],
    }),
    ticker: one(ticker, {
      fields: [workflowTriggerCronRef.tickerId],
      references: [ticker.id],
    }),
    workflowRunTriggeredBies: many(workflowRunTriggeredBy),
  }),
);

export const workflowTriggersRelations = relations(workflowTriggers, ({ one, many }) => ({
  workflowTriggerCronRefs: many(workflowTriggerCronRef),
  tenant: one(tenant, {
    fields: [workflowTriggers.tenantId],
    references: [tenant.id],
  }),
  workflowVersion: one(workflowVersion, {
    fields: [workflowTriggers.workflowVersionId],
    references: [workflowVersion.id],
  }),
  workflowTriggerEventRefs: many(workflowTriggerEventRef),
}));

export const workflowRunTriggeredByRelations = relations(workflowRunTriggeredBy, ({ one }) => ({
  workflowTriggerCronRef: one(workflowTriggerCronRef, {
    fields: [workflowRunTriggeredBy.cronParentId],
    references: [workflowTriggerCronRef.parentId],
  }),
  workflowTriggerScheduledRef: one(workflowTriggerScheduledRef, {
    fields: [workflowRunTriggeredBy.scheduledId],
    references: [workflowTriggerScheduledRef.id],
  }),
}));

export const workflowTriggerScheduledRefRelations = relations(
  workflowTriggerScheduledRef,
  ({ one, many }) => ({
    workflowRunTriggeredBies: many(workflowRunTriggeredBy),
    workflowVersion: one(workflowVersion, {
      fields: [workflowTriggerScheduledRef.parentId],
      references: [workflowVersion.id],
    }),
    stepRun: one(stepRun, {
      fields: [workflowTriggerScheduledRef.parentStepRunId],
      references: [stepRun.id],
    }),
    workflowRun: one(workflowRun, {
      fields: [workflowTriggerScheduledRef.parentWorkflowRunId],
      references: [workflowRun.id],
    }),
    ticker: one(ticker, {
      fields: [workflowTriggerScheduledRef.tickerId],
      references: [ticker.id],
    }),
  }),
);

export const workflowTagRelations = relations(workflowTag, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [workflowTag.tenantId],
    references: [tenant.id],
  }),
  workflowToWorkflowTags: many(workflowToWorkflowTag),
}));

export const workflowTriggerEventRefRelations = relations(workflowTriggerEventRef, ({ one }) => ({
  workflowTrigger: one(workflowTriggers, {
    fields: [workflowTriggerEventRef.parentId],
    references: [workflowTriggers.id],
  }),
}));

export const actionToWorkerRelations = relations(actionToWorker, ({ one }) => ({
  action: one(action, {
    fields: [actionToWorker.a],
    references: [action.id],
  }),
  worker: one(worker, {
    fields: [actionToWorker.b],
    references: [worker.id],
  }),
}));

export const blogPostToTagRelations = relations(blogPostToTag, ({ one }) => ({
  blogPost: one(blogPost, {
    fields: [blogPostToTag.a],
    references: [blogPost.id],
  }),
  tag: one(tag, {
    fields: [blogPostToTag.b],
    references: [tag.id],
  }),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  blogPostToTags: many(blogPostToTag),
}));

export const mediaToUserRelations = relations(mediaToUser, ({ one }) => ({
  media: one(media, {
    fields: [mediaToUser.a],
    references: [media.id],
  }),
  user: one(user, {
    fields: [mediaToUser.b],
    references: [user.id],
  }),
}));

export const serviceToWorkerRelations = relations(serviceToWorker, ({ one }) => ({
  service: one(service, {
    fields: [serviceToWorker.a],
    references: [service.id],
  }),
  worker: one(worker, {
    fields: [serviceToWorker.b],
    references: [worker.id],
  }),
}));

export const stepOrderRelations = relations(stepOrder, ({ one }) => ({
  step_a: one(step, {
    fields: [stepOrder.a],
    references: [step.id],
    relationName: "stepOrder_a_step_id",
  }),
  step_b: one(step, {
    fields: [stepOrder.b],
    references: [step.id],
    relationName: "stepOrder_b_step_id",
  }),
}));

export const stepRunOrderRelations = relations(stepRunOrder, ({ one }) => ({
  stepRun_a: one(stepRun, {
    fields: [stepRunOrder.a],
    references: [stepRun.id],
    relationName: "stepRunOrder_a_stepRun_id",
  }),
  stepRun_b: one(stepRun, {
    fields: [stepRunOrder.b],
    references: [stepRun.id],
    relationName: "stepRunOrder_b_stepRun_id",
  }),
}));

export const workflowToWorkflowTagRelations = relations(workflowToWorkflowTag, ({ one }) => ({
  workflow: one(workflow, {
    fields: [workflowToWorkflowTag.a],
    references: [workflow.id],
  }),
  workflowTag: one(workflowTag, {
    fields: [workflowToWorkflowTag.b],
    references: [workflowTag.id],
  }),
}));

export const socialMediaAgencyNicheRelations = relations(socialMediaAgencyNiche, ({ one }) => ({
  socialMediaAgency: one(socialMediaAgency, {
    fields: [socialMediaAgencyNiche.agencyId],
    references: [socialMediaAgency.id],
  }),
}));

export const kvStoreRelations = relations(kvStore, ({ one }) => ({
  tenant: one(tenant, {
    fields: [kvStore.tenantId],
    references: [tenant.id],
  }),
}));
