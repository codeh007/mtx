import { pgTable, uniqueIndex, uuid, text, timestamp, index, check, bigserial, boolean, jsonb, integer, foreignKey, unique, bigint, type AnyPgColumn, primaryKey, pgView, doublePrecision, numeric, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const concurrencyLimitStrategy = pgEnum("ConcurrencyLimitStrategy", ['CANCEL_IN_PROGRESS', 'DROP_NEWEST', 'QUEUE_NEWEST', 'GROUP_ROUND_ROBIN'])
export const from = pgEnum("From", ['BUYER', 'SELLER'])
export const internalQueue = pgEnum("InternalQueue", ['WORKER_SEMAPHORE_COUNT', 'STEP_RUN_UPDATE', 'STEP_RUN_UPDATE_V2', 'WORKFLOW_RUN_UPDATE', 'WORKFLOW_RUN_PAUSED'])
export const inviteLinkStatus = pgEnum("InviteLinkStatus", ['PENDING', 'ACCEPTED', 'REJECTED'])
export const jobKind = pgEnum("JobKind", ['DEFAULT', 'ON_FAILURE'])
export const jobRunStatus = pgEnum("JobRunStatus", ['PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED'])
export const leaseKind = pgEnum("LeaseKind", ['WORKER', 'QUEUE'])
export const limitResource = pgEnum("LimitResource", ['WORKFLOW_RUN', 'EVENT', 'WORKER', 'CRON', 'SCHEDULE'])
export const logLineLevel = pgEnum("LogLineLevel", ['DEBUG', 'INFO', 'WARN', 'ERROR'])
export const state = pgEnum("State", ['QUEUE', 'PUBLISHED', 'ERROR', 'DRAFT'])
export const stepExpressionKind = pgEnum("StepExpressionKind", ['DYNAMIC_RATE_LIMIT_KEY', 'DYNAMIC_RATE_LIMIT_VALUE', 'DYNAMIC_RATE_LIMIT_UNITS', 'DYNAMIC_RATE_LIMIT_WINDOW'])
export const stepRateLimitKind = pgEnum("StepRateLimitKind", ['STATIC', 'DYNAMIC'])
export const stepRunEventReason = pgEnum("StepRunEventReason", ['REQUEUED_NO_WORKER', 'REQUEUED_RATE_LIMIT', 'RATE_LIMIT_ERROR', 'SCHEDULING_TIMED_OUT', 'TIMED_OUT', 'REASSIGNED', 'ASSIGNED', 'SENT_TO_WORKER', 'STARTED', 'ACKNOWLEDGED', 'FINISHED', 'FAILED', 'RETRYING', 'RETRIED_BY_USER', 'CANCELLED', 'TIMEOUT_REFRESHED', 'SLOT_RELEASED', 'WORKFLOW_RUN_GROUP_KEY_SUCCEEDED', 'WORKFLOW_RUN_GROUP_KEY_FAILED'])
export const stepRunEventSeverity = pgEnum("StepRunEventSeverity", ['INFO', 'WARNING', 'CRITICAL'])
export const stepRunStatus = pgEnum("StepRunStatus", ['PENDING', 'PENDING_ASSIGNMENT', 'ASSIGNED', 'RUNNING', 'CANCELLING', 'SUCCEEDED', 'FAILED', 'CANCELLED'])
export const stickyStrategy = pgEnum("StickyStrategy", ['SOFT', 'HARD'])
export const tenantMemberRole = pgEnum("TenantMemberRole", ['OWNER', 'ADMIN', 'MEMBER'])
export const tenantResourceLimitAlertType = pgEnum("TenantResourceLimitAlertType", ['Alarm', 'Exhausted'])
export const vcsProvider = pgEnum("VcsProvider", ['GITHUB'])
export const webhookWorkerRequestMethod = pgEnum("WebhookWorkerRequestMethod", ['GET', 'POST', 'PUT'])
export const workerLabelComparator = pgEnum("WorkerLabelComparator", ['EQUAL', 'NOT_EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL'])
export const workerSdks = pgEnum("WorkerSDKS", ['UNKNOWN', 'GO', 'PYTHON', 'TYPESCRIPT'])
export const workerType = pgEnum("WorkerType", ['WEBHOOK', 'MANAGED', 'SELFHOSTED'])
export const workflowKind = pgEnum("WorkflowKind", ['FUNCTION', 'DURABLE', 'DAG'])
export const workflowRunStatus = pgEnum("WorkflowRunStatus", ['PENDING', 'QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED'])


export const popularPosts = pgTable("PopularPosts", {
	id: uuid().primaryKey().notNull(),
	category: text().notNull(),
	topic: text().notNull(),
	content: text().notNull(),
	hook: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("PopularPosts_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const internalQueueItem = pgTable("InternalQueueItem", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	queue: internalQueue().notNull(),
	isQueued: boolean().notNull(),
	data: jsonb(),
	tenantId: uuid().notNull(),
	priority: integer().default(1).notNull(),
	uniqueKey: text(),
}, (table) => [
	index("InternalQueueItem_isQueued_tenantId_queue_priority_id_idx").using("btree", table.isQueued.asc().nullsLast().op("enum_ops"), table.tenantId.asc().nullsLast().op("uuid_ops"), table.queue.asc().nullsLast().op("uuid_ops"), table.priority.desc().nullsFirst().op("uuid_ops"), table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("InternalQueueItem_tenantId_queue_uniqueKey_key").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.queue.asc().nullsLast().op("text_ops"), table.uniqueKey.asc().nullsLast().op("text_ops")),
	check("InternalQueueItem_priority_check", sql`(priority >= 1) AND (priority <= 4)`),
]);

export const siteHost = pgTable("SiteHost", {
	id: uuid().primaryKey().notNull(),
	siteId: uuid().notNull(),
	host: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("SiteHost_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [site.id],
			name: "SiteHost_siteId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const site = pgTable("Site", {
	id: uuid().primaryKey().notNull(),
	title: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	description: text(),
	tenantId: uuid().notNull(),
	enabled: boolean().default(true).notNull(),
}, (table) => [
	uniqueIndex("Site_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Site_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const env = pgTable("Env", {
	id: uuid().primaryKey().notNull(),
	name: text().notNull(),
	value: text().notNull(),
	appName: text().notNull(),
}, (table) => [
	index("Env_appName_idx").using("btree", table.appName.asc().nullsLast().op("text_ops")),
]);

export const chatSuggestion = pgTable("ChatSuggestion", {
	id: uuid().primaryKey().notNull(),
	userId: uuid().notNull(),
	documentId: uuid().notNull(),
	documentCreatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	originalText: text().notNull(),
	suggestedText: text().notNull(),
	description: text(),
	isResolved: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("ChatSuggestion_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const event = pgTable("Event", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	key: text().notNull(),
	tenantId: uuid().notNull(),
	replayedFromId: uuid(),
	data: jsonb(),
	additionalMetadata: jsonb(),
	insertOrder: integer(),
}, (table) => [
	index("Event_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("Event_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("Event_tenantId_createdAt_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("Event_tenantId_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.replayedFromId],
			foreignColumns: [table.id],
			name: "Event_replayedFromId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const eventKey = pgTable("EventKey", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	key: text().notNull(),
	tenantId: uuid().notNull(),
}, (table) => [
	uniqueIndex("EventKey_key_tenantId_key").using("btree", table.key.asc().nullsLast().op("text_ops"), table.tenantId.asc().nullsLast().op("text_ops")),
]);

export const lease = pgTable("Lease", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	resourceId: text().notNull(),
	kind: leaseKind().notNull(),
}, (table) => [
	uniqueIndex("Lease_tenantId_kind_resourceId_key").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.kind.asc().nullsLast().op("text_ops"), table.resourceId.asc().nullsLast().op("text_ops")),
]);

export const endpoint = pgTable("Endpoint", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	name: text().notNull(),
	description: text(),
	url: text().notNull(),
	type: text().notNull(),
	token: text(),
	tenantId: uuid().notNull(),
	enabled: boolean().default(true).notNull(),
	priority: integer().default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Endpoint_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const post = pgTable("Post", {
	id: uuid().primaryKey().notNull(),
	state: state().default('QUEUE').notNull(),
	publishDate: timestamp({ precision: 3, mode: 'string' }),
	content: text().notNull(),
	tenantId: uuid().notNull(),
	title: text(),
	description: text(),
	parentPostId: uuid(),
	releaseId: uuid(),
	releaseUrl: text(),
	settings: text(),
	image: text(),
	submittedForOrganizationId: uuid(),
	lastMessageId: uuid(),
	error: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	siteId: uuid().notNull(),
	authorId: uuid().notNull(),
	status: text().default('DRAFT').notNull(),
	slug: text().notNull(),
}, (table) => [
	index("Post_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("Post_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("Post_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("Post_lastMessageId_idx").using("btree", table.lastMessageId.asc().nullsLast().op("uuid_ops")),
	index("Post_parentPostId_idx").using("btree", table.parentPostId.asc().nullsLast().op("uuid_ops")),
	index("Post_publishDate_idx").using("btree", table.publishDate.asc().nullsLast().op("timestamp_ops")),
	index("Post_releaseURL_idx").using("btree", table.releaseUrl.asc().nullsLast().op("text_ops")),
	index("Post_state_idx").using("btree", table.state.asc().nullsLast().op("enum_ops")),
	index("Post_tenantId_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
	index("Post_updatedAt_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "Post_authorId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.lastMessageId],
			foreignColumns: [messages.id],
			name: "Post_lastMessageId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.parentPostId],
			foreignColumns: [table.id],
			name: "Post_parentPostId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.siteId],
			foreignColumns: [site.id],
			name: "Post_siteId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Post_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const queue = pgTable("Queue", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	tenantId: uuid().notNull(),
	name: text().notNull(),
	lastActive: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	index("Queue_tenantId_lastActive_idx").using("btree", table.tenantId.asc().nullsLast().op("timestamp_ops"), table.lastActive.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("Queue_tenantId_name_key").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops")),
]);

export const platformAccount = pgTable("PlatformAccount", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	type: text(),
	platform: text().notNull(),
	username: text(),
	password: text(),
	email: text(),
	token: text(),
	lastUsedAt: timestamp({ precision: 3, mode: 'string' }),
	tags: text().array(),
	enabled: boolean().default(true).notNull(),
	properties: jsonb().default({}),
	comment: text(),
}, (table) => [
	index("PlatformAccount_properties_gin_idx").using("gin", table.properties.asc().nullsLast().op("jsonb_ops")),
	index("PlatformAccount_tags_idx").using("gin", table.tags.asc().nullsLast().op("array_ops")),
]);

export const queueItem = pgTable("QueueItem", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	stepRunId: uuid(),
	stepId: uuid(),
	actionId: text(),
	scheduleTimeoutAt: timestamp({ precision: 3, mode: 'string' }),
	stepTimeout: text(),
	priority: integer().default(1).notNull(),
	isQueued: boolean().notNull(),
	tenantId: uuid().notNull(),
	queue: text().notNull(),
	sticky: stickyStrategy(),
	desiredWorkerId: uuid(),
}, (table) => [
	index("QueueItem_isQueued_priority_tenantId_queue_id_idx_2").using("btree", table.isQueued.asc().nullsLast().op("uuid_ops"), table.tenantId.asc().nullsLast().op("bool_ops"), table.queue.asc().nullsLast().op("bool_ops"), table.priority.desc().nullsFirst().op("bool_ops"), table.id.asc().nullsLast().op("uuid_ops")),
	check("QueueItem_priority_check", sql`(priority >= 1) AND (priority <= 4)`),
]);

export const securityCheckIdent = pgTable("SecurityCheckIdent", {
	id: uuid().primaryKey().notNull(),
}, (table) => [
	uniqueIndex("SecurityCheckIdent_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const semaphoreQueueItem = pgTable("SemaphoreQueueItem", {
	stepRunId: uuid().primaryKey().notNull(),
	workerId: uuid().notNull(),
	tenantId: uuid().notNull(),
}, (table) => [
	uniqueIndex("SemaphoreQueueItem_stepRunId_key").using("btree", table.stepRunId.asc().nullsLast().op("uuid_ops")),
	index("SemaphoreQueueItem_tenantId_workerId_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.workerId.asc().nullsLast().op("uuid_ops")),
]);

export const systemConfig = pgTable("SystemConfig", {
	id: uuid().primaryKey().notNull(),
	name: text().notNull(),
	value: jsonb().notNull(),
	isDefault: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("SystemConfig_name_unique").on(table.name),
]);

export const stepRunEvent = pgTable("StepRunEvent", {
	id: bigserial({ mode: "bigint" }).notNull(),
	timeFirstSeen: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	timeLastSeen: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	stepRunId: uuid(),
	workflowRunId: uuid(),
	reason: stepRunEventReason().notNull(),
	severity: stepRunEventSeverity().notNull(),
	message: text().notNull(),
	count: integer().notNull(),
	data: jsonb(),
}, (table) => [
	uniqueIndex("StepRunEvent_id_key").using("btree", table.id.asc().nullsLast().op("int8_ops")),
	index("StepRunEvent_stepRunId_idx").using("btree", table.stepRunId.asc().nullsLast().op("uuid_ops")),
	index("StepRunEvent_workflowRunId_idx").using("btree", table.workflowRunId.asc().nullsLast().op("uuid_ops")),
]);

export const timeoutQueueItem = pgTable("TimeoutQueueItem", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	stepRunId: uuid().notNull(),
	retryCount: integer().notNull(),
	timeoutAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	tenantId: uuid().notNull(),
	isQueued: boolean().notNull(),
}, (table) => [
	uniqueIndex("TimeoutQueueItem_stepRunId_retryCount_key").using("btree", table.stepRunId.asc().nullsLast().op("int4_ops"), table.retryCount.asc().nullsLast().op("int4_ops")),
	index("TimeoutQueueItem_tenantId_isQueued_timeoutAt_idx").using("btree", table.tenantId.asc().nullsLast().op("timestamp_ops"), table.isQueued.asc().nullsLast().op("timestamp_ops"), table.timeoutAt.asc().nullsLast().op("timestamp_ops")),
]);

export const vote = pgTable("Vote", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
}, (table) => [
	uniqueIndex("Vote_chatId_messageId_key").using("btree", table.chatId.asc().nullsLast().op("uuid_ops"), table.messageId.asc().nullsLast().op("uuid_ops")),
]);

export const workflowRun = pgTable("WorkflowRun", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	displayName: text(),
	tenantId: uuid().notNull(),
	workflowVersionId: uuid().notNull(),
	concurrencyGroupId: text(),
	status: workflowRunStatus().default('PENDING').notNull(),
	error: text(),
	startedAt: timestamp({ precision: 3, mode: 'string' }),
	finishedAt: timestamp({ precision: 3, mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	duration: bigint({ mode: "number" }),
	priority: integer(),
	parentId: uuid(),
	parentStepRunId: uuid(),
	childIndex: integer(),
	childKey: text(),
	additionalMetadata: jsonb(),
	insertOrder: integer(),
	byUserId: uuid(),
}, (table) => [
	index("WorkflowRun_byUserId_idx").using("btree", table.byUserId.asc().nullsLast().op("uuid_ops")),
	index("WorkflowRun_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("WorkflowRun_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	index("WorkflowRun_finishedAt_idx").using("btree", table.finishedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("WorkflowRun_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("WorkflowRun_parentId_parentStepRunId_childIndex_key").using("btree", table.parentId.asc().nullsLast().op("uuid_ops"), table.parentStepRunId.asc().nullsLast().op("int4_ops"), table.childIndex.asc().nullsLast().op("uuid_ops")).where(sql`("deletedAt" IS NULL)`),
	uniqueIndex("WorkflowRun_parentId_parentStepRunId_childKey_key").using("btree", table.parentId.asc().nullsLast().op("text_ops"), table.parentStepRunId.asc().nullsLast().op("uuid_ops"), table.childKey.asc().nullsLast().op("uuid_ops")),
	index("WorkflowRun_parentStepRunId").using("btree", table.parentStepRunId.asc().nullsLast().op("uuid_ops")),
	index("WorkflowRun_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("WorkflowRun_tenantId_createdAt_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("WorkflowRun_tenantId_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
	index("WorkflowRun_workflowVersionId_idx").using("btree", table.workflowVersionId.asc().nullsLast().op("uuid_ops")),
	index("idx_workflowrun_concurrency").using("btree", table.concurrencyGroupId.asc().nullsLast().op("text_ops"), table.createdAt.asc().nullsLast().op("text_ops")),
	index("idx_workflowrun_main").using("btree", table.tenantId.asc().nullsLast().op("timestamp_ops"), table.deletedAt.asc().nullsLast().op("timestamp_ops"), table.status.asc().nullsLast().op("timestamp_ops"), table.workflowVersionId.asc().nullsLast().op("timestamp_ops"), table.createdAt.asc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.byUserId],
			foreignColumns: [user.id],
			name: "WorkflowRun_byUserId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "WorkflowRun_parentId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.parentStepRunId],
			foreignColumns: [stepRun.id],
			name: "WorkflowRun_parentStepRunId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const workflowRunDedupe = pgTable("WorkflowRunDedupe", {
	id: bigserial({ mode: "bigint" }).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	workflowId: uuid().notNull(),
	workflowRunId: uuid().notNull(),
	value: text().notNull(),
}, (table) => [
	uniqueIndex("WorkflowRunDedupe_id_key").using("btree", table.id.asc().nullsLast().op("int8_ops")),
	index("WorkflowRunDedupe_tenantId_value_idx").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.value.asc().nullsLast().op("text_ops")),
	uniqueIndex("WorkflowRunDedupe_tenantId_workflowId_value_key").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.workflowId.asc().nullsLast().op("text_ops"), table.value.asc().nullsLast().op("text_ops")),
]);

export const tenant = pgTable("Tenant", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	name: text().notNull(),
	slug: text().notNull(),
	analyticsOptOut: boolean().default(false).notNull(),
	controllerPartitionId: text(),
	schedulerPartitionId: text(),
	workerPartitionId: text(),
	dataRetentionPeriod: text().default('720h').notNull(),
	alertMemberEmails: boolean().default(true).notNull(),
}, (table) => [
	index("Tenant_controllerPartitionId_idx").using("btree", table.controllerPartitionId.asc().nullsLast().op("text_ops")),
	uniqueIndex("Tenant_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Tenant_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("Tenant_workerPartitionId_idx").using("btree", table.workerPartitionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.controllerPartitionId],
			foreignColumns: [controllerPartition.id],
			name: "Tenant_controllerPartitionId_fkey"
		}).onUpdate("set null").onDelete("set null"),
	foreignKey({
			columns: [table.schedulerPartitionId],
			foreignColumns: [schedulerPartition.id],
			name: "Tenant_schedulerPartitionId_fkey"
		}).onUpdate("set null").onDelete("set null"),
	foreignKey({
			columns: [table.workerPartitionId],
			foreignColumns: [tenantWorkerPartition.id],
			name: "Tenant_workerPartitionId_fkey"
		}).onUpdate("set null").onDelete("set null"),
]);

export const apiToken = pgTable("APIToken", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }),
	revoked: boolean().default(false).notNull(),
	nextAlertAt: timestamp({ precision: 3, mode: 'string' }),
	internal: boolean().default(false).notNull(),
	name: text(),
	tenantId: uuid(),
}, (table) => [
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "APIToken_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const action = pgTable("Action", {
	id: uuid().primaryKey().notNull(),
	actionId: text().notNull(),
	description: text(),
	tenantId: uuid().notNull(),
}, (table) => [
	uniqueIndex("Action_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Action_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const agentNode = pgTable("AgentNode", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	type: text().notNull(),
	title: text().notNull(),
	description: text(),
	parentId: uuid(),
	childrenId: uuid(),
	config: jsonb().default({}).notNull(),
	state: jsonb().default({}).notNull(),
	inputs: text(),
	outputs: text(),
	isFinal: boolean("IsFinal").default(false).notNull(),
	isStart: boolean("IsStart").default(false).notNull(),
	tools: text(),
	tenantId: uuid().notNull(),
	lastRunId: uuid(),
	resourceId: uuid(),
	resourceType: text(),
}, (table) => [
	uniqueIndex("AgentNode_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("AgentNode_tenantId_id_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "AgentNode_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const agentNodeRun = pgTable("AgentNodeRun", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	nodeId: uuid().notNull(),
	tenantId: uuid().notNull(),
	input: jsonb(),
	output: jsonb(),
	status: text().default('start').notNull(),
	workflowRunId: uuid(),
}, (table) => [
	uniqueIndex("AgentNodeRun_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("AgentNodeRun_tenantId_id_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.nodeId],
			foreignColumns: [agentNode.id],
			name: "AgentNodeRun_nodeId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "AgentNodeRun_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const chat = pgTable("Chat", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	title: text().notNull(),
	userId: uuid().notNull(),
	tenantId: uuid().notNull(),
	activateArtId: uuid(),
}, (table) => [
	uniqueIndex("Chat_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Chat_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const artifact = pgTable("Artifact", {
	id: uuid().primaryKey().notNull(),
	artId: uuid().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	title: text().notNull(),
	state: jsonb(),
	icon: text(),
	type: text(),
	version: integer().default(1).notNull(),
	prevId: uuid(),
	nextId: uuid(),
	chatId: uuid().notNull(),
}, (table) => [
	uniqueIndex("Artifact_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Artifact_chatId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Artifact_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const assisant = pgTable("Assisant", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	type: text().notNull(),
	title: text().notNull(),
	description: text(),
	content: text().notNull(),
	tenantId: uuid().notNull(),
	config: jsonb().default({}).notNull(),
}, (table) => [
	uniqueIndex("Assisant_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Assisant_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const blog = pgTable("Blog", {
	id: uuid().primaryKey().notNull(),
	tenantId: uuid().notNull(),
	configId: uuid(),
	title: text().default(').notNull(),
	description: text().default(').notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	enabled: boolean().default(true).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	slug: text().notNull(),
	status: text().notNull(),
}, (table) => [
	uniqueIndex("Blog_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Blog_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Blog_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const blogConfig = pgTable("BlogConfig", {
	id: uuid().primaryKey().notNull(),
	blogId: uuid().notNull(),
}, (table) => [
	uniqueIndex("BlogConfig_blogId_key").using("btree", table.blogId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("BlogConfig_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "BlogConfig_blogId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const user = pgTable("User", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	email: text().notNull(),
	emailVerified: boolean().default(false).notNull(),
	name: text(),
}, (table) => [
	uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("User_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const blogPost = pgTable("BlogPost", {
	id: uuid().primaryKey().notNull(),
	blogId: uuid().notNull(),
	tenantId: uuid().notNull(),
	authorId: uuid().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	commentCount: integer().default(0).notNull(),
	likeCount: integer().default(0).notNull(),
	status: text().notNull(),
	slug: text().notNull(),
}, (table) => [
	uniqueIndex("BlogPost_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("BlogPost_slug_key").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "BlogPost_authorId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blog.id],
			name: "BlogPost_blogId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "BlogPost_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const chatMessage = pgTable("ChatMessage", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	role: text().notNull(),
	content: text().notNull(),
	chatId: uuid().notNull(),
}, (table) => [
	uniqueIndex("ChatMessage_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "ChatMessage_chatId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const comment = pgTable("Comment", {
	id: uuid().primaryKey().notNull(),
	content: text().notNull(),
	blogId: uuid().notNull(),
	authorId: uuid().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	status: text().notNull(),
}, (table) => [
	uniqueIndex("Comment_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "Comment_authorId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.blogId],
			foreignColumns: [blogPost.id],
			name: "Comment_blogId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const ticker = pgTable("Ticker", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	lastHeartbeatAt: timestamp({ precision: 3, mode: 'string' }),
	isActive: boolean().default(true).notNull(),
}, (table) => [
	uniqueIndex("Ticker_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const getGroupKeyRun = pgTable("GetGroupKeyRun", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	workflowRunId: uuid().notNull(),
	workerId: uuid(),
	tickerId: uuid(),
	status: stepRunStatus().default('PENDING').notNull(),
	input: jsonb(),
	output: text(),
	requeueAfter: timestamp({ precision: 3, mode: 'string' }),
	scheduleTimeoutAt: timestamp({ precision: 3, mode: 'string' }),
	error: text(),
	startedAt: timestamp({ precision: 3, mode: 'string' }),
	finishedAt: timestamp({ precision: 3, mode: 'string' }),
	timeoutAt: timestamp({ precision: 3, mode: 'string' }),
	cancelledAt: timestamp({ precision: 3, mode: 'string' }),
	cancelledReason: text(),
	cancelledError: text(),
}, (table) => [
	index("GetGroupKeyRun_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("GetGroupKeyRun_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("GetGroupKeyRun_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("GetGroupKeyRun_status_deletedAt_timeoutAt_idx").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.deletedAt.asc().nullsLast().op("timestamp_ops"), table.timeoutAt.asc().nullsLast().op("timestamp_ops")),
	index("GetGroupKeyRun_tenantId_deletedAt_status_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.deletedAt.asc().nullsLast().op("timestamp_ops"), table.status.asc().nullsLast().op("timestamp_ops")),
	index("GetGroupKeyRun_tenantId_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
	index("GetGroupKeyRun_workerId_idx").using("btree", table.workerId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("GetGroupKeyRun_workflowRunId_key").using("btree", table.workflowRunId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tickerId],
			foreignColumns: [ticker.id],
			name: "GetGroupKeyRun_tickerId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.workerId],
			foreignColumns: [worker.id],
			name: "GetGroupKeyRun_workerId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.workflowRunId],
			foreignColumns: [workflowRun.id],
			name: "GetGroupKeyRun_workflowRunId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const worker = pgTable("Worker", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	type: workerType().default('SELFHOSTED').notNull(),
	tenantId: uuid().notNull(),
	lastHeartbeatAt: timestamp({ precision: 3, mode: 'string' }),
	isPaused: boolean().default(false).notNull(),
	isActive: boolean().default(false).notNull(),
	lastListenerEstablished: timestamp({ precision: 3, mode: 'string' }),
	name: text().notNull(),
	dispatcherId: uuid(),
	maxRuns: integer().default(100).notNull(),
	webhookId: uuid(),
	sdkVersion: text(),
	language: workerSdks(),
	languageVersion: text(),
	os: text(),
	runtimeExtra: text(),
}, (table) => [
	uniqueIndex("Worker_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Worker_webhookId_key").using("btree", table.webhookId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.dispatcherId],
			foreignColumns: [dispatcher.id],
			name: "Worker_dispatcherId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.webhookId],
			foreignColumns: [webhookWorker.id],
			name: "Worker_webhookId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const integration = pgTable("Integration", {
	id: uuid().primaryKey().notNull(),
	internalId: uuid().notNull(),
	name: text().notNull(),
	organizationId: uuid().notNull(),
	tenantId: uuid().notNull(),
	picture: text(),
	providerIdentifier: text().notNull(),
	type: text().notNull(),
	token: text().notNull(),
	disabled: boolean().default(false).notNull(),
	tokenExpiration: timestamp({ precision: 3, mode: 'string' }),
	refreshToken: text(),
	profile: text(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }),
	inBetweenSteps: boolean().default(false).notNull(),
	refreshNeeded: boolean().default(false).notNull(),
	postingTimes: text().default('[{"time":120}, {"time":400}, {"time":700}]').notNull(),
	customInstanceDetails: text(),
	customerId: text(),
}, (table) => [
	index("Integration_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("Integration_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Integration_organizationId_internalId_key").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.internalId.asc().nullsLast().op("uuid_ops")),
	index("Integration_updatedAt_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamp_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Integration_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowVersion = pgTable("WorkflowVersion", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	checksum: text().notNull(),
	version: text(),
	order: bigserial({ mode: "bigint" }).notNull(),
	workflowId: uuid().notNull(),
	sticky: stickyStrategy(),
	onFailureJobId: uuid(),
	kind: workflowKind().default('DAG').notNull(),
	scheduleTimeout: text().default('5m').notNull(),
	defaultPriority: integer(),
}, (table) => [
	index("WorkflowVersion_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("WorkflowVersion_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkflowVersion_onFailureJobId_key").using("btree", table.onFailureJobId.asc().nullsLast().op("uuid_ops")),
	index("idx_workflow_version_workflow_id_order").using("btree", table.workflowId.asc().nullsLast().op("int8_ops"), table.order.desc().nullsFirst().op("int8_ops")).where(sql`("deletedAt" IS NULL)`),
	foreignKey({
			columns: [table.onFailureJobId],
			foreignColumns: [job.id],
			name: "WorkflowVersion_onFailureJobId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.workflowId],
			foreignColumns: [workflow.id],
			name: "WorkflowVersion_workflowId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const job = pgTable("Job", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	workflowVersionId: uuid().notNull(),
	name: text().notNull(),
	description: text(),
	timeout: text(),
	kind: jobKind().default('DEFAULT').notNull(),
}, (table) => [
	uniqueIndex("Job_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Job_workflowVersionId_name_key").using("btree", table.workflowVersionId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.workflowVersionId],
			foreignColumns: [workflowVersion.id],
			name: "Job_workflowVersionId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const jobRun = pgTable("JobRun", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	workflowRunId: uuid().notNull(),
	jobId: uuid().notNull(),
	tickerId: uuid(),
	status: jobRunStatus().default('PENDING').notNull(),
	result: jsonb(),
	startedAt: timestamp({ precision: 3, mode: 'string' }),
	finishedAt: timestamp({ precision: 3, mode: 'string' }),
	timeoutAt: timestamp({ precision: 3, mode: 'string' }),
	cancelledAt: timestamp({ precision: 3, mode: 'string' }),
	cancelledReason: text(),
	cancelledError: text(),
}, (table) => [
	index("JobRun_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("JobRun_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("JobRun_workflowRunId_tenantId_idx").using("btree", table.workflowRunId.asc().nullsLast().op("uuid_ops"), table.tenantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.workflowRunId],
			foreignColumns: [workflowRun.id],
			name: "JobRun_workflowRunId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const jobRunLookupData = pgTable("JobRunLookupData", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	jobRunId: uuid().notNull(),
	tenantId: uuid().notNull(),
	data: jsonb(),
}, (table) => [
	uniqueIndex("JobRunLookupData_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("JobRunLookupData_jobRunId_key").using("btree", table.jobRunId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("JobRunLookupData_jobRunId_tenantId_key").using("btree", table.jobRunId.asc().nullsLast().op("uuid_ops"), table.tenantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.jobRunId],
			foreignColumns: [jobRun.id],
			name: "JobRunLookupData_jobRunId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const stepRun = pgTable("StepRun", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	jobRunId: uuid().notNull(),
	stepId: uuid().notNull(),
	order: bigserial({ mode: "bigint" }).notNull(),
	queue: text().default('default').notNull(),
	priority: integer(),
	workerId: uuid(),
	tickerId: uuid(),
	status: stepRunStatus().default('PENDING').notNull(),
	input: jsonb(),
	output: jsonb(),
	inputSchema: jsonb(),
	requeueAfter: timestamp({ precision: 3, mode: 'string' }),
	scheduleTimeoutAt: timestamp({ precision: 3, mode: 'string' }),
	retryCount: integer().default(0).notNull(),
	internalRetryCount: integer().default(0).notNull(),
	error: text(),
	startedAt: timestamp({ precision: 3, mode: 'string' }),
	finishedAt: timestamp({ precision: 3, mode: 'string' }),
	timeoutAt: timestamp({ precision: 3, mode: 'string' }),
	cancelledAt: timestamp({ precision: 3, mode: 'string' }),
	cancelledReason: text(),
	cancelledError: text(),
	callerFiles: jsonb(),
	gitRepoBranch: text(),
	semaphoreReleased: boolean().default(false).notNull(),
}, (table) => [
	index("StepRun_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("StepRun_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("StepRun_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("StepRun_id_tenantId_idx").using("btree", table.id.asc().nullsLast().op("uuid_ops"), table.tenantId.asc().nullsLast().op("uuid_ops")),
	index("StepRun_jobRunId_status_idx").using("btree", table.jobRunId.asc().nullsLast().op("enum_ops"), table.status.asc().nullsLast().op("uuid_ops")),
	index("StepRun_jobRunId_status_tenantId_idx").using("btree", table.jobRunId.asc().nullsLast().op("enum_ops"), table.status.asc().nullsLast().op("enum_ops"), table.tenantId.asc().nullsLast().op("enum_ops")).where(sql`(status = 'PENDING'::"StepRunStatus")`),
	index("StepRun_jobRunId_tenantId_order_idx").using("btree", table.jobRunId.asc().nullsLast().op("uuid_ops"), table.tenantId.asc().nullsLast().op("int8_ops"), table.order.asc().nullsLast().op("uuid_ops")),
	index("StepRun_stepId_idx").using("btree", table.stepId.asc().nullsLast().op("uuid_ops")),
	index("StepRun_tenantId_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
	index("StepRun_workerId_idx").using("btree", table.workerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.jobRunId],
			foreignColumns: [jobRun.id],
			name: "StepRun_jobRunId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.workerId],
			foreignColumns: [worker.id],
			name: "StepRun_workerId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const logLine = pgTable("LogLine", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	stepRunId: uuid(),
	message: text().notNull(),
	level: logLineLevel().default('INFO').notNull(),
	metadata: jsonb(),
}, (table) => [
	foreignKey({
			columns: [table.stepRunId],
			foreignColumns: [stepRun.id],
			name: "LogLine_stepRunId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const media = pgTable("Media", {
	id: uuid().primaryKey().notNull(),
	name: text().notNull(),
	path: text().notNull(),
	tenantId: uuid().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("Media_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("Media_tenantId_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Media_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const messagesGroup = pgTable("MessagesGroup", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	index("MessagesGroup_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("MessagesGroup_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("MessagesGroup_updatedAt_idx").using("btree", table.updatedAt.asc().nullsLast().op("timestamp_ops")),
]);

export const messages = pgTable("Messages", {
	id: uuid().primaryKey().notNull(),
	from: from().notNull(),
	content: text(),
	groupId: uuid().notNull(),
	special: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	index("Messages_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("Messages_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	index("Messages_groupId_idx").using("btree", table.groupId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Messages_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [messagesGroup.id],
			name: "Messages_groupId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const prompt = pgTable("Prompt", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	type: text().notNull(),
	title: text().notNull(),
	description: text(),
	content: text().notNull(),
	tenantId: uuid().notNull(),
}, (table) => [
	uniqueIndex("Prompt_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Prompt_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const reply = pgTable("Reply", {
	id: uuid().primaryKey().notNull(),
	content: text().notNull(),
	commentId: uuid().notNull(),
	authorId: uuid().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("Reply_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "Reply_authorId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.commentId],
			foreignColumns: [comment.id],
			name: "Reply_commentId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const snsIntegration = pgTable("SNSIntegration", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	topicArn: text().notNull(),
}, (table) => [
	uniqueIndex("SNSIntegration_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("SNSIntegration_tenantId_topicArn_key").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.topicArn.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "SNSIntegration_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const service = pgTable("Service", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	name: text().notNull(),
	description: text(),
	tenantId: uuid().notNull(),
}, (table) => [
	uniqueIndex("Service_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Service_tenantId_name_key").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "Service_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const slackAppWebhook = pgTable("SlackAppWebhook", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	teamId: text().notNull(),
	teamName: text().notNull(),
	channelId: text().notNull(),
	channelName: text().notNull(),
	// TODO: failed to parse database type 'bytea'
	webhookUrl: unknown("webhookURL").notNull(),
}, (table) => [
	uniqueIndex("SlackAppWebhook_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("SlackAppWebhook_tenantId_teamId_channelId_key").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.teamId.asc().nullsLast().op("text_ops"), table.channelId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "SlackAppWebhook_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const socialMediaAgency = pgTable("SocialMediaAgency", {
	id: uuid().primaryKey().notNull(),
	userId: uuid().notNull(),
	name: text().notNull(),
	logoId: uuid(),
	website: text(),
	slug: text(),
	facebook: text(),
	instagram: text(),
	twitter: text(),
	linkedIn: text(),
	youtube: text(),
	tiktok: text(),
	otherSocialMedia: text(),
	shortDescription: text().notNull(),
	description: text().notNull(),
	approved: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	index("SocialMediaAgency_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	index("SocialMediaAgency_id_idx").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("SocialMediaAgency_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("SocialMediaAgency_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.logoId],
			foreignColumns: [media.id],
			name: "SocialMediaAgency_logoId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "SocialMediaAgency_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const step = pgTable("Step", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	readableId: text(),
	tenantId: uuid().notNull(),
	jobId: uuid().notNull(),
	actionId: text().notNull(),
	timeout: text(),
	retries: integer().default(0).notNull(),
	customUserData: jsonb(),
	scheduleTimeout: text().default('5m').notNull(),
}, (table) => [
	uniqueIndex("Step_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Step_jobId_readableId_key").using("btree", table.jobId.asc().nullsLast().op("text_ops"), table.readableId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tenantId, table.actionId],
			foreignColumns: [action.actionId, action.tenantId],
			name: "Step_actionId_tenantId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.jobId],
			foreignColumns: [job.id],
			name: "Step_jobId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const stepDesiredWorkerLabel = pgTable("StepDesiredWorkerLabel", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	stepId: uuid().notNull(),
	key: text().notNull(),
	strValue: text(),
	intValue: integer(),
	required: boolean().notNull(),
	comparator: workerLabelComparator().notNull(),
	weight: integer().notNull(),
}, (table) => [
	index("StepDesiredWorkerLabel_stepId_idx").using("btree", table.stepId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("StepDesiredWorkerLabel_stepId_key_key").using("btree", table.stepId.asc().nullsLast().op("text_ops"), table.key.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.stepId],
			foreignColumns: [step.id],
			name: "StepDesiredWorkerLabel_stepId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const rateLimit = pgTable("RateLimit", {
	tenantId: uuid().notNull(),
	key: text().notNull(),
	limitValue: integer().notNull(),
	value: integer().notNull(),
	window: text().notNull(),
	lastRefill: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const stepRateLimit = pgTable("StepRateLimit", {
	units: integer().notNull(),
	stepId: uuid().notNull(),
	rateLimitKey: text().notNull(),
	kind: stepRateLimitKind().default('STATIC').notNull(),
	tenantId: uuid().notNull(),
}, (table) => [
	uniqueIndex("StepRateLimit_stepId_rateLimitKey_key").using("btree", table.stepId.asc().nullsLast().op("text_ops"), table.rateLimitKey.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.rateLimitKey, table.tenantId],
			foreignColumns: [rateLimit.tenantId, rateLimit.key],
			name: "StepRateLimit_tenantId_rateLimitKey_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const stepRunResultArchive = pgTable("StepRunResultArchive", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	stepRunId: uuid().notNull(),
	retryCount: integer().default(0).notNull(),
	order: bigserial({ mode: "bigint" }).notNull(),
	input: jsonb(),
	output: jsonb(),
	error: text(),
	startedAt: timestamp({ precision: 3, mode: 'string' }),
	finishedAt: timestamp({ precision: 3, mode: 'string' }),
	timeoutAt: timestamp({ precision: 3, mode: 'string' }),
	cancelledAt: timestamp({ precision: 3, mode: 'string' }),
	cancelledReason: text(),
	cancelledError: text(),
}, (table) => [
	uniqueIndex("StepRunResultArchive_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.stepRunId],
			foreignColumns: [stepRun.id],
			name: "StepRunResultArchive_stepRunId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const streamEvent = pgTable("StreamEvent", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	stepRunId: uuid(),
	// TODO: failed to parse database type 'bytea'
	message: unknown("message").notNull(),
	metadata: jsonb(),
}, (table) => [
	foreignKey({
			columns: [table.stepRunId],
			foreignColumns: [stepRun.id],
			name: "StreamEvent_stepRunId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const controllerPartition = pgTable("ControllerPartition", {
	id: text().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	lastHeartbeat: timestamp({ precision: 3, mode: 'string' }),
	name: text(),
}, (table) => [
	uniqueIndex("ControllerPartition_id_key").using("btree", table.id.asc().nullsLast().op("text_ops")),
]);

export const schedulerPartition = pgTable("SchedulerPartition", {
	id: text().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	lastHeartbeat: timestamp({ precision: 3, mode: 'string' }),
	name: text(),
}, (table) => [
	uniqueIndex("SchedulerPartition_id_key").using("btree", table.id.asc().nullsLast().op("text_ops")),
]);

export const tenantWorkerPartition = pgTable("TenantWorkerPartition", {
	id: text().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	lastHeartbeat: timestamp({ precision: 3, mode: 'string' }),
	name: text(),
}, (table) => [
	uniqueIndex("TenantWorkerPartition_id_key").using("btree", table.id.asc().nullsLast().op("text_ops")),
]);

export const tenantAlertEmailGroup = pgTable("TenantAlertEmailGroup", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	emails: text().notNull(),
}, (table) => [
	uniqueIndex("TenantAlertEmailGroup_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "TenantAlertEmailGroup_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const tenantAlertingSettings = pgTable("TenantAlertingSettings", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	enableWorkflowRunFailureAlerts: boolean().default(false).notNull(),
	enableExpiringTokenAlerts: boolean().default(true).notNull(),
	enableTenantResourceLimitAlerts: boolean().default(true).notNull(),
	maxFrequency: text().default('1h').notNull(),
	lastAlertedAt: timestamp({ precision: 3, mode: 'string' }),
	tickerId: uuid(),
}, (table) => [
	uniqueIndex("TenantAlertingSettings_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("TenantAlertingSettings_tenantId_key").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "TenantAlertingSettings_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tickerId],
			foreignColumns: [ticker.id],
			name: "TenantAlertingSettings_tickerId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const tenantInviteLink = pgTable("TenantInviteLink", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	inviterEmail: text().notNull(),
	inviteeEmail: text().notNull(),
	expires: timestamp({ precision: 3, mode: 'string' }).notNull(),
	status: inviteLinkStatus().default('PENDING').notNull(),
	role: tenantMemberRole().default('OWNER').notNull(),
}, (table) => [
	uniqueIndex("TenantInviteLink_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "TenantInviteLink_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const tenantMember = pgTable("TenantMember", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	userId: uuid().notNull(),
	role: tenantMemberRole().notNull(),
}, (table) => [
	uniqueIndex("TenantMember_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("TenantMember_tenantId_userId_key").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "TenantMember_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "TenantMember_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const tenantResourceLimit = pgTable("TenantResourceLimit", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	resource: limitResource().notNull(),
	tenantId: uuid().notNull(),
	limitValue: integer().notNull(),
	alarmValue: integer(),
	value: integer().default(0).notNull(),
	window: text(),
	lastRefill: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	customValueMeter: boolean().default(false).notNull(),
}, (table) => [
	uniqueIndex("TenantResourceLimit_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("TenantResourceLimit_tenantId_resource_key").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.resource.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "TenantResourceLimit_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const tenantResourceLimitAlert = pgTable("TenantResourceLimitAlert", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	resourceLimitId: uuid().notNull(),
	tenantId: uuid().notNull(),
	resource: limitResource().notNull(),
	alertType: tenantResourceLimitAlertType().notNull(),
	value: integer().notNull(),
	limit: integer().notNull(),
}, (table) => [
	uniqueIndex("TenantResourceLimitAlert_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.resourceLimitId],
			foreignColumns: [tenantResourceLimit.id],
			name: "TenantResourceLimitAlert_resourceLimitId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "TenantResourceLimitAlert_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const tenantVcsProvider = pgTable("TenantVcsProvider", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	vcsProvider: vcsProvider().notNull(),
	config: jsonb(),
}, (table) => [
	uniqueIndex("TenantVcsProvider_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("TenantVcsProvider_tenantId_vcsProvider_key").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.vcsProvider.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "TenantVcsProvider_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const userOauth = pgTable("UserOAuth", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	userId: uuid().notNull(),
	provider: text().notNull(),
	providerUserId: text().notNull(),
	// TODO: failed to parse database type 'bytea'
	accessToken: unknown("accessToken").notNull(),
	// TODO: failed to parse database type 'bytea'
	refreshToken: unknown("refreshToken"),
	expiresAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	uniqueIndex("UserOAuth_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("UserOAuth_userId_key").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("UserOAuth_userId_provider_key").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.provider.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserOAuth_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const userPassword = pgTable("UserPassword", {
	hash: text().notNull(),
	userId: uuid().notNull(),
}, (table) => [
	uniqueIndex("UserPassword_userId_key").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserPassword_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const userSession = pgTable("UserSession", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	userId: uuid(),
	data: jsonb(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("UserSession_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserSession_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const webhookWorker = pgTable("WebhookWorker", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	name: text().notNull(),
	secret: text().notNull(),
	url: text().notNull(),
	tokenValue: text(),
	deleted: boolean().default(false).notNull(),
	tokenId: uuid(),
	tenantId: uuid().notNull(),
}, (table) => [
	uniqueIndex("WebhookWorker_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WebhookWorker_url_key").using("btree", table.url.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "WebhookWorker_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tokenId],
			foreignColumns: [apiToken.id],
			name: "WebhookWorker_tokenId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const webhookWorkerRequest = pgTable("WebhookWorkerRequest", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	webhookWorkerId: uuid().notNull(),
	method: webhookWorkerRequestMethod().notNull(),
	statusCode: integer().notNull(),
}, (table) => [
	uniqueIndex("WebhookWorkerRequest_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.webhookWorkerId],
			foreignColumns: [webhookWorker.id],
			name: "WebhookWorkerRequest_webhookWorkerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const webhookWorkerWorkflow = pgTable("WebhookWorkerWorkflow", {
	id: uuid().primaryKey().notNull(),
	webhookWorkerId: uuid().notNull(),
	workflowId: uuid().notNull(),
}, (table) => [
	uniqueIndex("WebhookWorkerWorkflow_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WebhookWorkerWorkflow_webhookWorkerId_workflowId_key").using("btree", table.webhookWorkerId.asc().nullsLast().op("uuid_ops"), table.workflowId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.webhookWorkerId],
			foreignColumns: [webhookWorker.id],
			name: "WebhookWorkerWorkflow_webhookWorkerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.workflowId],
			foreignColumns: [workflow.id],
			name: "WebhookWorkerWorkflow_workflowId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflow = pgTable("Workflow", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	isPaused: boolean().default(false),
	name: text().notNull(),
	description: text(),
}, (table) => [
	index("Workflow_deletedAt_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("Workflow_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("Workflow_tenantId_name_key").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops"), table.name.asc().nullsLast().op("text_ops")),
	index("idx_workflow_tenant_id").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
]);

export const dispatcher = pgTable("Dispatcher", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	lastHeartbeatAt: timestamp({ precision: 3, mode: 'string' }),
	isActive: boolean().default(true).notNull(),
}, (table) => [
	uniqueIndex("Dispatcher_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const workerAssignEvent = pgTable("WorkerAssignEvent", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	workerId: uuid().notNull(),
	assignedStepRuns: jsonb(),
}, (table) => [
	index("WorkerAssignEvent_workerId_id_idx").using("btree", table.workerId.asc().nullsLast().op("int8_ops"), table.id.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.workerId],
			foreignColumns: [worker.id],
			name: "WorkerAssignEvent_workerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workerLabel = pgTable("WorkerLabel", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	workerId: uuid().notNull(),
	key: text().notNull(),
	strValue: text(),
	intValue: integer(),
}, (table) => [
	index("WorkerLabel_workerId_idx").using("btree", table.workerId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkerLabel_workerId_key_key").using("btree", table.workerId.asc().nullsLast().op("text_ops"), table.key.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.workerId],
			foreignColumns: [worker.id],
			name: "WorkerLabel_workerId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowConcurrency = pgTable("WorkflowConcurrency", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	workflowVersionId: uuid().notNull(),
	getConcurrencyGroupId: uuid(),
	concurrencyGroupExpression: text(),
	maxRuns: integer().default(1).notNull(),
	limitStrategy: concurrencyLimitStrategy().default('CANCEL_IN_PROGRESS').notNull(),
}, (table) => [
	uniqueIndex("WorkflowConcurrency_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkflowConcurrency_workflowVersionId_key").using("btree", table.workflowVersionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.getConcurrencyGroupId],
			foreignColumns: [action.id],
			name: "WorkflowConcurrency_getConcurrencyGroupId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.workflowVersionId],
			foreignColumns: [workflowVersion.id],
			name: "WorkflowConcurrency_workflowVersionId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowRunStickyState = pgTable("WorkflowRunStickyState", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	workflowRunId: uuid().notNull(),
	desiredWorkerId: uuid(),
	strategy: stickyStrategy().notNull(),
}, (table) => [
	uniqueIndex("WorkflowRunStickyState_workflowRunId_key").using("btree", table.workflowRunId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.workflowRunId],
			foreignColumns: [workflowRun.id],
			name: "WorkflowRunStickyState_workflowRunId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowTriggerCronRef = pgTable("WorkflowTriggerCronRef", {
	parentId: uuid().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	cron: text().notNull(),
	enabled: boolean().default(true).notNull(),
	tickerId: uuid(),
	input: jsonb(),
	additionalMetadata: jsonb(),
}, (table) => [
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [workflowTriggers.id],
			name: "WorkflowTriggerCronRef_parentId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.tickerId],
			foreignColumns: [ticker.id],
			name: "WorkflowTriggerCronRef_tickerId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const workflowRunTriggeredBy = pgTable("WorkflowRunTriggeredBy", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	tenantId: uuid().notNull(),
	parentId: uuid().notNull(),
	input: jsonb(),
	eventId: uuid(),
	cronParentId: uuid(),
	cronSchedule: text(),
	scheduledId: uuid(),
}, (table) => [
	index("WorkflowRunTriggeredBy_eventId_idx").using("btree", table.eventId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkflowRunTriggeredBy_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	index("WorkflowRunTriggeredBy_parentId_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkflowRunTriggeredBy_parentId_key").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkflowRunTriggeredBy_scheduledId_key").using("btree", table.scheduledId.asc().nullsLast().op("uuid_ops")),
	index("WorkflowRunTriggeredBy_tenantId_idx").using("btree", table.tenantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.cronParentId, table.cronSchedule],
			foreignColumns: [workflowTriggerCronRef.parentId, workflowTriggerCronRef.cron],
			name: "WorkflowRunTriggeredBy_cronParentId_cronSchedule_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.scheduledId],
			foreignColumns: [workflowTriggerScheduledRef.id],
			name: "WorkflowRunTriggeredBy_scheduledId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const workflowTriggerScheduledRef = pgTable("WorkflowTriggerScheduledRef", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	parentId: uuid().notNull(),
	triggerAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	tickerId: uuid(),
	input: jsonb(),
	parentWorkflowRunId: uuid(),
	parentStepRunId: uuid(),
	childIndex: integer(),
	childKey: text(),
	additionalMetadata: jsonb(),
}, (table) => [
	uniqueIndex("WorkflowTriggerScheduledRef_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkflowTriggerScheduledRef_parentId_parentStepRunId_childK_key").using("btree", table.parentId.asc().nullsLast().op("text_ops"), table.parentStepRunId.asc().nullsLast().op("uuid_ops"), table.childKey.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [workflowVersion.id],
			name: "WorkflowTriggerScheduledRef_parentId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.parentStepRunId],
			foreignColumns: [stepRun.id],
			name: "WorkflowTriggerScheduledRef_parentStepRunId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.parentWorkflowRunId],
			foreignColumns: [workflowRun.id],
			name: "WorkflowTriggerScheduledRef_parentWorkflowRunId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.tickerId],
			foreignColumns: [ticker.id],
			name: "WorkflowTriggerScheduledRef_tickerId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);

export const workflowTag = pgTable("WorkflowTag", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	tenantId: uuid().notNull(),
	name: text().notNull(),
	color: text().default('#93C5FD').notNull(),
}, (table) => [
	uniqueIndex("WorkflowTag_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkflowTag_tenantId_name_key").using("btree", table.tenantId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "WorkflowTag_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowTriggers = pgTable("WorkflowTriggers", {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	workflowVersionId: uuid().notNull(),
	tenantId: uuid().notNull(),
}, (table) => [
	uniqueIndex("WorkflowTriggers_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("WorkflowTriggers_workflowVersionId_key").using("btree", table.workflowVersionId.asc().nullsLast().op("uuid_ops")),
	index("idx_workflow_triggers_workflow_version_id").using("btree", table.workflowVersionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "WorkflowTriggers_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.workflowVersionId],
			foreignColumns: [workflowVersion.id],
			name: "WorkflowTriggers_workflowVersionId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowTriggerEventRef = pgTable("WorkflowTriggerEventRef", {
	parentId: uuid().notNull(),
	eventKey: text().notNull(),
}, (table) => [
	uniqueIndex("WorkflowTriggerEventRef_parentId_eventKey_key").using("btree", table.parentId.asc().nullsLast().op("text_ops"), table.eventKey.asc().nullsLast().op("text_ops")),
	index("idx_workflow_trigger_event_ref_event_key_parent_id").using("btree", table.eventKey.asc().nullsLast().op("text_ops"), table.parentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [workflowTriggers.id],
			name: "WorkflowTriggerEventRef_parentId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const actionToWorker = pgTable("_ActionToWorker", {
	a: uuid("A").notNull(),
	b: uuid("B").notNull(),
}, (table) => [
	uniqueIndex("_ActionToWorker_AB_unique").using("btree", table.a.asc().nullsLast().op("uuid_ops"), table.b.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.b.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.a],
			foreignColumns: [action.id],
			name: "_ActionToWorker_A_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.b],
			foreignColumns: [worker.id],
			name: "_ActionToWorker_B_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const blogPostToTag = pgTable("_BlogPostToTag", {
	a: uuid("A").notNull(),
	b: uuid("B").notNull(),
}, (table) => [
	uniqueIndex("_BlogPostToTag_AB_unique").using("btree", table.a.asc().nullsLast().op("uuid_ops"), table.b.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.b.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.a],
			foreignColumns: [blogPost.id],
			name: "_BlogPostToTag_A_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.b],
			foreignColumns: [tag.id],
			name: "_BlogPostToTag_B_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const tag = pgTable("Tag", {
	id: uuid().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("Tag_id_key").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);

export const mediaToUser = pgTable("_MediaToUser", {
	a: uuid("A").notNull(),
	b: uuid("B").notNull(),
}, (table) => [
	uniqueIndex("_MediaToUser_AB_unique").using("btree", table.a.asc().nullsLast().op("uuid_ops"), table.b.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.b.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.a],
			foreignColumns: [media.id],
			name: "_MediaToUser_A_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.b],
			foreignColumns: [user.id],
			name: "_MediaToUser_B_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const serviceToWorker = pgTable("_ServiceToWorker", {
	a: uuid("A").notNull(),
	b: uuid("B").notNull(),
}, (table) => [
	uniqueIndex("_ServiceToWorker_AB_unique").using("btree", table.a.asc().nullsLast().op("uuid_ops"), table.b.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.b.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.a],
			foreignColumns: [service.id],
			name: "_ServiceToWorker_A_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.b],
			foreignColumns: [worker.id],
			name: "_ServiceToWorker_B_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const stepOrder = pgTable("_StepOrder", {
	a: uuid("A").notNull(),
	b: uuid("B").notNull(),
}, (table) => [
	uniqueIndex("_StepOrder_AB_unique").using("btree", table.a.asc().nullsLast().op("uuid_ops"), table.b.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.b.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.a],
			foreignColumns: [step.id],
			name: "_StepOrder_A_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.b],
			foreignColumns: [step.id],
			name: "_StepOrder_B_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const stepRunOrder = pgTable("_StepRunOrder", {
	a: uuid("A").notNull(),
	b: uuid("B").notNull(),
}, (table) => [
	uniqueIndex("_StepRunOrder_AB_unique").using("btree", table.a.asc().nullsLast().op("uuid_ops"), table.b.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.b.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.a],
			foreignColumns: [stepRun.id],
			name: "_StepRunOrder_A_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.b],
			foreignColumns: [stepRun.id],
			name: "_StepRunOrder_B_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const workflowToWorkflowTag = pgTable("_WorkflowToWorkflowTag", {
	a: uuid("A").notNull(),
	b: uuid("B").notNull(),
}, (table) => [
	uniqueIndex("_WorkflowToWorkflowTag_AB_unique").using("btree", table.a.asc().nullsLast().op("uuid_ops"), table.b.asc().nullsLast().op("uuid_ops")),
	index().using("btree", table.b.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.a],
			foreignColumns: [workflow.id],
			name: "_WorkflowToWorkflowTag_A_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.b],
			foreignColumns: [workflowTag.id],
			name: "_WorkflowToWorkflowTag_B_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const socialMediaAgencyNiche = pgTable("SocialMediaAgencyNiche", {
	agencyId: uuid().notNull(),
	niche: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.agencyId],
			foreignColumns: [socialMediaAgency.id],
			name: "SocialMediaAgencyNiche_agencyId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.agencyId, table.niche], name: "SocialMediaAgencyNiche_pkey"}),
]);

export const stepExpression = pgTable("StepExpression", {
	key: text().notNull(),
	stepId: uuid().notNull(),
	expression: text().notNull(),
	kind: stepExpressionKind().notNull(),
}, (table) => [
	primaryKey({ columns: [table.key, table.stepId, table.kind], name: "StepExpression_pkey"}),
]);

export const stepRunExpressionEval = pgTable("StepRunExpressionEval", {
	key: text().notNull(),
	stepRunId: uuid().notNull(),
	valueStr: text(),
	valueInt: integer(),
	kind: stepExpressionKind().notNull(),
}, (table) => [
	index("StepRunExpressionEval_stepRunId_idx").using("btree", table.stepRunId.asc().nullsLast().op("uuid_ops")),
	primaryKey({ columns: [table.key, table.stepRunId, table.kind], name: "StepRunExpressionEval_pkey"}),
]);

export const kvStore = pgTable("KVStore", {
	ns: text().default('default').notNull(),
	isSystem: boolean().default(false).notNull(),
	tenantId: uuid(),
	key: text().notNull(),
	value: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	index("KVStore_ns_key_idx").using("btree", table.ns.asc().nullsLast().op("text_ops"), table.key.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tenantId],
			foreignColumns: [tenant.id],
			name: "KVStore_tenantId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.ns, table.key], name: "KVStore_pkey"}),
]);
export const pgStatStatementsInfo = pgView("pg_stat_statements_info", {	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	dealloc: bigint({ mode: "number" }),
	statsReset: timestamp("stats_reset", { withTimezone: true, mode: 'string' }),
}).as(sql`SELECT dealloc, stats_reset FROM pg_stat_statements_info() pg_stat_statements_info(dealloc, stats_reset)`);

export const pgStatStatements = pgView("pg_stat_statements", {	// TODO: failed to parse database type 'oid'
	userid: unknown("userid"),
	// TODO: failed to parse database type 'oid'
	dbid: unknown("dbid"),
	toplevel: boolean(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	queryid: bigint({ mode: "number" }),
	query: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	plans: bigint({ mode: "number" }),
	totalPlanTime: doublePrecision("total_plan_time"),
	minPlanTime: doublePrecision("min_plan_time"),
	maxPlanTime: doublePrecision("max_plan_time"),
	meanPlanTime: doublePrecision("mean_plan_time"),
	stddevPlanTime: doublePrecision("stddev_plan_time"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	calls: bigint({ mode: "number" }),
	totalExecTime: doublePrecision("total_exec_time"),
	minExecTime: doublePrecision("min_exec_time"),
	maxExecTime: doublePrecision("max_exec_time"),
	meanExecTime: doublePrecision("mean_exec_time"),
	stddevExecTime: doublePrecision("stddev_exec_time"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	rows: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sharedBlksHit: bigint("shared_blks_hit", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sharedBlksRead: bigint("shared_blks_read", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sharedBlksDirtied: bigint("shared_blks_dirtied", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sharedBlksWritten: bigint("shared_blks_written", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	localBlksHit: bigint("local_blks_hit", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	localBlksRead: bigint("local_blks_read", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	localBlksDirtied: bigint("local_blks_dirtied", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	localBlksWritten: bigint("local_blks_written", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tempBlksRead: bigint("temp_blks_read", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tempBlksWritten: bigint("temp_blks_written", { mode: "number" }),
	blkReadTime: doublePrecision("blk_read_time"),
	blkWriteTime: doublePrecision("blk_write_time"),
	tempBlkReadTime: doublePrecision("temp_blk_read_time"),
	tempBlkWriteTime: doublePrecision("temp_blk_write_time"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	walRecords: bigint("wal_records", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	walFpi: bigint("wal_fpi", { mode: "number" }),
	walBytes: numeric("wal_bytes"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	jitFunctions: bigint("jit_functions", { mode: "number" }),
	jitGenerationTime: doublePrecision("jit_generation_time"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	jitInliningCount: bigint("jit_inlining_count", { mode: "number" }),
	jitInliningTime: doublePrecision("jit_inlining_time"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	jitOptimizationCount: bigint("jit_optimization_count", { mode: "number" }),
	jitOptimizationTime: doublePrecision("jit_optimization_time"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	jitEmissionCount: bigint("jit_emission_count", { mode: "number" }),
	jitEmissionTime: doublePrecision("jit_emission_time"),
}).as(sql`SELECT userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, blk_read_time, blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time FROM pg_stat_statements(true) pg_stat_statements(userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, blk_read_time, blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time)`);