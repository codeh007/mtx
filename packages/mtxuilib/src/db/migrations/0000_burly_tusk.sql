-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."ConcurrencyLimitStrategy" AS ENUM('CANCEL_IN_PROGRESS', 'DROP_NEWEST', 'QUEUE_NEWEST', 'GROUP_ROUND_ROBIN');--> statement-breakpoint
CREATE TYPE "public"."From" AS ENUM('BUYER', 'SELLER');--> statement-breakpoint
CREATE TYPE "public"."InternalQueue" AS ENUM('WORKER_SEMAPHORE_COUNT', 'STEP_RUN_UPDATE', 'STEP_RUN_UPDATE_V2', 'WORKFLOW_RUN_UPDATE', 'WORKFLOW_RUN_PAUSED');--> statement-breakpoint
CREATE TYPE "public"."InviteLinkStatus" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."JobKind" AS ENUM('DEFAULT', 'ON_FAILURE');--> statement-breakpoint
CREATE TYPE "public"."JobRunStatus" AS ENUM('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."LeaseKind" AS ENUM('WORKER', 'QUEUE');--> statement-breakpoint
CREATE TYPE "public"."LimitResource" AS ENUM('WORKFLOW_RUN', 'EVENT', 'WORKER', 'CRON', 'SCHEDULE');--> statement-breakpoint
CREATE TYPE "public"."LogLineLevel" AS ENUM('DEBUG', 'INFO', 'WARN', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."State" AS ENUM('QUEUE', 'PUBLISHED', 'ERROR', 'DRAFT');--> statement-breakpoint
CREATE TYPE "public"."StepExpressionKind" AS ENUM('DYNAMIC_RATE_LIMIT_KEY', 'DYNAMIC_RATE_LIMIT_VALUE', 'DYNAMIC_RATE_LIMIT_UNITS', 'DYNAMIC_RATE_LIMIT_WINDOW');--> statement-breakpoint
CREATE TYPE "public"."StepRateLimitKind" AS ENUM('STATIC', 'DYNAMIC');--> statement-breakpoint
CREATE TYPE "public"."StepRunEventReason" AS ENUM('REQUEUED_NO_WORKER', 'REQUEUED_RATE_LIMIT', 'RATE_LIMIT_ERROR', 'SCHEDULING_TIMED_OUT', 'TIMED_OUT', 'REASSIGNED', 'ASSIGNED', 'SENT_TO_WORKER', 'STARTED', 'ACKNOWLEDGED', 'FINISHED', 'FAILED', 'RETRYING', 'RETRIED_BY_USER', 'CANCELLED', 'TIMEOUT_REFRESHED', 'SLOT_RELEASED', 'WORKFLOW_RUN_GROUP_KEY_SUCCEEDED', 'WORKFLOW_RUN_GROUP_KEY_FAILED');--> statement-breakpoint
CREATE TYPE "public"."StepRunEventSeverity" AS ENUM('INFO', 'WARNING', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."StepRunStatus" AS ENUM('PENDING', 'PENDING_ASSIGNMENT', 'ASSIGNED', 'RUNNING', 'CANCELLING', 'SUCCEEDED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."StickyStrategy" AS ENUM('SOFT', 'HARD');--> statement-breakpoint
CREATE TYPE "public"."TenantMemberRole" AS ENUM('OWNER', 'ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."TenantResourceLimitAlertType" AS ENUM('Alarm', 'Exhausted');--> statement-breakpoint
CREATE TYPE "public"."VcsProvider" AS ENUM('GITHUB');--> statement-breakpoint
CREATE TYPE "public"."WebhookWorkerRequestMethod" AS ENUM('GET', 'POST', 'PUT');--> statement-breakpoint
CREATE TYPE "public"."WorkerLabelComparator" AS ENUM('EQUAL', 'NOT_EQUAL', 'GREATER_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN', 'LESS_THAN_OR_EQUAL');--> statement-breakpoint
CREATE TYPE "public"."WorkerSDKS" AS ENUM('UNKNOWN', 'GO', 'PYTHON', 'TYPESCRIPT');--> statement-breakpoint
CREATE TYPE "public"."WorkerType" AS ENUM('WEBHOOK', 'MANAGED', 'SELFHOSTED');--> statement-breakpoint
CREATE TYPE "public"."WorkflowKind" AS ENUM('FUNCTION', 'DURABLE', 'DAG');--> statement-breakpoint
CREATE TYPE "public"."WorkflowRunStatus" AS ENUM('PENDING', 'QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');--> statement-breakpoint
CREATE TABLE "PopularPosts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"topic" text NOT NULL,
	"content" text NOT NULL,
	"hook" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "InternalQueueItem" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"queue" "InternalQueue" NOT NULL,
	"isQueued" boolean NOT NULL,
	"data" jsonb,
	"tenantId" uuid NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"uniqueKey" text,
	CONSTRAINT "InternalQueueItem_priority_check" CHECK ((priority >= 1) AND (priority <= 4))
);
--> statement-breakpoint
CREATE TABLE "SiteHost" (
	"id" uuid PRIMARY KEY NOT NULL,
	"siteId" uuid NOT NULL,
	"host" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Site" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"description" text,
	"tenantId" uuid NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Env" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"appName" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ChatSuggestion" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"documentId" uuid NOT NULL,
	"documentCreatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"originalText" text NOT NULL,
	"suggestedText" text NOT NULL,
	"description" text,
	"isResolved" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Event" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"key" text NOT NULL,
	"tenantId" uuid NOT NULL,
	"replayedFromId" uuid,
	"data" jsonb,
	"additionalMetadata" jsonb,
	"insertOrder" integer
);
--> statement-breakpoint
CREATE TABLE "EventKey" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"tenantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Lease" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"expiresAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"resourceId" text NOT NULL,
	"kind" "LeaseKind" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Endpoint" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"name" text NOT NULL,
	"description" text,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"token" text,
	"tenantId" uuid NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Post" (
	"id" uuid PRIMARY KEY NOT NULL,
	"state" "State" DEFAULT 'QUEUE' NOT NULL,
	"publishDate" timestamp(3),
	"content" text NOT NULL,
	"tenantId" uuid NOT NULL,
	"title" text,
	"description" text,
	"parentPostId" uuid,
	"releaseId" uuid,
	"releaseURL" text,
	"settings" text,
	"image" text,
	"submittedForOrganizationId" uuid,
	"lastMessageId" uuid,
	"error" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"siteId" uuid NOT NULL,
	"authorId" uuid NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Queue" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tenantId" uuid NOT NULL,
	"name" text NOT NULL,
	"lastActive" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlatformAccount" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"type" text,
	"platform" text NOT NULL,
	"username" text,
	"password" text,
	"email" text,
	"token" text,
	"lastUsedAt" timestamp(3),
	"tags" text[],
	"enabled" boolean DEFAULT true NOT NULL,
	"properties" jsonb DEFAULT '{}'::jsonb,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "QueueItem" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"stepRunId" uuid,
	"stepId" uuid,
	"actionId" text,
	"scheduleTimeoutAt" timestamp(3),
	"stepTimeout" text,
	"priority" integer DEFAULT 1 NOT NULL,
	"isQueued" boolean NOT NULL,
	"tenantId" uuid NOT NULL,
	"queue" text NOT NULL,
	"sticky" "StickyStrategy",
	"desiredWorkerId" uuid,
	CONSTRAINT "QueueItem_priority_check" CHECK ((priority >= 1) AND (priority <= 4))
);
--> statement-breakpoint
CREATE TABLE "SecurityCheckIdent" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SemaphoreQueueItem" (
	"stepRunId" uuid PRIMARY KEY NOT NULL,
	"workerId" uuid NOT NULL,
	"tenantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SystemConfig" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" jsonb NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "SystemConfig_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "StepRunEvent" (
	"id" bigserial NOT NULL,
	"timeFirstSeen" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"timeLastSeen" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"stepRunId" uuid,
	"workflowRunId" uuid,
	"reason" "StepRunEventReason" NOT NULL,
	"severity" "StepRunEventSeverity" NOT NULL,
	"message" text NOT NULL,
	"count" integer NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "TimeoutQueueItem" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"stepRunId" uuid NOT NULL,
	"retryCount" integer NOT NULL,
	"timeoutAt" timestamp(3) NOT NULL,
	"tenantId" uuid NOT NULL,
	"isQueued" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Vote" (
	"chatId" uuid NOT NULL,
	"messageId" uuid NOT NULL,
	"isUpvoted" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorkflowRun" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"displayName" text,
	"tenantId" uuid NOT NULL,
	"workflowVersionId" uuid NOT NULL,
	"concurrencyGroupId" text,
	"status" "WorkflowRunStatus" DEFAULT 'PENDING' NOT NULL,
	"error" text,
	"startedAt" timestamp(3),
	"finishedAt" timestamp(3),
	"duration" bigint,
	"priority" integer,
	"parentId" uuid,
	"parentStepRunId" uuid,
	"childIndex" integer,
	"childKey" text,
	"additionalMetadata" jsonb,
	"insertOrder" integer,
	"byUserId" uuid
);
--> statement-breakpoint
CREATE TABLE "WorkflowRunDedupe" (
	"id" bigserial NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"workflowId" uuid NOT NULL,
	"workflowRunId" uuid NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Tenant" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"analyticsOptOut" boolean DEFAULT false NOT NULL,
	"controllerPartitionId" text,
	"schedulerPartitionId" text,
	"workerPartitionId" text,
	"dataRetentionPeriod" text DEFAULT '720h' NOT NULL,
	"alertMemberEmails" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "APIToken" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expiresAt" timestamp(3),
	"revoked" boolean DEFAULT false NOT NULL,
	"nextAlertAt" timestamp(3),
	"internal" boolean DEFAULT false NOT NULL,
	"name" text,
	"tenantId" uuid
);
--> statement-breakpoint
CREATE TABLE "Action" (
	"id" uuid PRIMARY KEY NOT NULL,
	"actionId" text NOT NULL,
	"description" text,
	"tenantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "AgentNode" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"parentId" uuid,
	"childrenId" uuid,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"state" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"inputs" text,
	"outputs" text,
	"IsFinal" boolean DEFAULT false NOT NULL,
	"IsStart" boolean DEFAULT false NOT NULL,
	"tools" text,
	"tenantId" uuid NOT NULL,
	"lastRunId" uuid,
	"resourceId" uuid,
	"resourceType" text
);
--> statement-breakpoint
CREATE TABLE "AgentNodeRun" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"nodeId" uuid NOT NULL,
	"tenantId" uuid NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"status" text DEFAULT 'start' NOT NULL,
	"workflowRunId" uuid
);
--> statement-breakpoint
CREATE TABLE "Chat" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"title" text NOT NULL,
	"userId" uuid NOT NULL,
	"tenantId" uuid NOT NULL,
	"activateArtId" uuid
);
--> statement-breakpoint
CREATE TABLE "Artifact" (
	"id" uuid PRIMARY KEY NOT NULL,
	"artId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"title" text NOT NULL,
	"state" jsonb,
	"icon" text,
	"type" text,
	"version" integer DEFAULT 1 NOT NULL,
	"prevId" uuid,
	"nextId" uuid,
	"chatId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Assisant" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"tenantId" uuid NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Blog" (
	"id" uuid PRIMARY KEY NOT NULL,
	"tenantId" uuid NOT NULL,
	"configId" uuid,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"slug" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "BlogConfig" (
	"id" uuid PRIMARY KEY NOT NULL,
	"blogId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "BlogPost" (
	"id" uuid PRIMARY KEY NOT NULL,
	"blogId" uuid NOT NULL,
	"tenantId" uuid NOT NULL,
	"authorId" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"commentCount" integer DEFAULT 0 NOT NULL,
	"likeCount" integer DEFAULT 0 NOT NULL,
	"status" text NOT NULL,
	"slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ChatMessage" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"chatId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Comment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"blogId" uuid NOT NULL,
	"authorId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Ticker" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"lastHeartbeatAt" timestamp(3),
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "GetGroupKeyRun" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"workflowRunId" uuid NOT NULL,
	"workerId" uuid,
	"tickerId" uuid,
	"status" "StepRunStatus" DEFAULT 'PENDING' NOT NULL,
	"input" jsonb,
	"output" text,
	"requeueAfter" timestamp(3),
	"scheduleTimeoutAt" timestamp(3),
	"error" text,
	"startedAt" timestamp(3),
	"finishedAt" timestamp(3),
	"timeoutAt" timestamp(3),
	"cancelledAt" timestamp(3),
	"cancelledReason" text,
	"cancelledError" text
);
--> statement-breakpoint
CREATE TABLE "Worker" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"type" "WorkerType" DEFAULT 'SELFHOSTED' NOT NULL,
	"tenantId" uuid NOT NULL,
	"lastHeartbeatAt" timestamp(3),
	"isPaused" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT false NOT NULL,
	"lastListenerEstablished" timestamp(3),
	"name" text NOT NULL,
	"dispatcherId" uuid,
	"maxRuns" integer DEFAULT 100 NOT NULL,
	"webhookId" uuid,
	"sdkVersion" text,
	"language" "WorkerSDKS",
	"languageVersion" text,
	"os" text,
	"runtimeExtra" text
);
--> statement-breakpoint
CREATE TABLE "Integration" (
	"id" uuid PRIMARY KEY NOT NULL,
	"internalId" uuid NOT NULL,
	"name" text NOT NULL,
	"organizationId" uuid NOT NULL,
	"tenantId" uuid NOT NULL,
	"picture" text,
	"providerIdentifier" text NOT NULL,
	"type" text NOT NULL,
	"token" text NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL,
	"tokenExpiration" timestamp(3),
	"refreshToken" text,
	"profile" text,
	"deletedAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3),
	"inBetweenSteps" boolean DEFAULT false NOT NULL,
	"refreshNeeded" boolean DEFAULT false NOT NULL,
	"postingTimes" text DEFAULT '[{"time":120}, {"time":400}, {"time":700}]' NOT NULL,
	"customInstanceDetails" text,
	"customerId" text
);
--> statement-breakpoint
CREATE TABLE "WorkflowVersion" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"checksum" text NOT NULL,
	"version" text,
	"order" bigserial NOT NULL,
	"workflowId" uuid NOT NULL,
	"sticky" "StickyStrategy",
	"onFailureJobId" uuid,
	"kind" "WorkflowKind" DEFAULT 'DAG' NOT NULL,
	"scheduleTimeout" text DEFAULT '5m' NOT NULL,
	"defaultPriority" integer
);
--> statement-breakpoint
CREATE TABLE "Job" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"workflowVersionId" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"timeout" text,
	"kind" "JobKind" DEFAULT 'DEFAULT' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "JobRun" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"workflowRunId" uuid NOT NULL,
	"jobId" uuid NOT NULL,
	"tickerId" uuid,
	"status" "JobRunStatus" DEFAULT 'PENDING' NOT NULL,
	"result" jsonb,
	"startedAt" timestamp(3),
	"finishedAt" timestamp(3),
	"timeoutAt" timestamp(3),
	"cancelledAt" timestamp(3),
	"cancelledReason" text,
	"cancelledError" text
);
--> statement-breakpoint
CREATE TABLE "JobRunLookupData" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"jobRunId" uuid NOT NULL,
	"tenantId" uuid NOT NULL,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "StepRun" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"jobRunId" uuid NOT NULL,
	"stepId" uuid NOT NULL,
	"order" bigserial NOT NULL,
	"queue" text DEFAULT 'default' NOT NULL,
	"priority" integer,
	"workerId" uuid,
	"tickerId" uuid,
	"status" "StepRunStatus" DEFAULT 'PENDING' NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"inputSchema" jsonb,
	"requeueAfter" timestamp(3),
	"scheduleTimeoutAt" timestamp(3),
	"retryCount" integer DEFAULT 0 NOT NULL,
	"internalRetryCount" integer DEFAULT 0 NOT NULL,
	"error" text,
	"startedAt" timestamp(3),
	"finishedAt" timestamp(3),
	"timeoutAt" timestamp(3),
	"cancelledAt" timestamp(3),
	"cancelledReason" text,
	"cancelledError" text,
	"callerFiles" jsonb,
	"gitRepoBranch" text,
	"semaphoreReleased" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "LogLine" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"stepRunId" uuid,
	"message" text NOT NULL,
	"level" "LogLineLevel" DEFAULT 'INFO' NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "Media" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"tenantId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "MessagesGroup" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"from" "From" NOT NULL,
	"content" text,
	"groupId" uuid NOT NULL,
	"special" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Prompt" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"tenantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Reply" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"commentId" uuid NOT NULL,
	"authorId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SNSIntegration" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"topicArn" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Service" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"name" text NOT NULL,
	"description" text,
	"tenantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SlackAppWebhook" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"teamId" text NOT NULL,
	"teamName" text NOT NULL,
	"channelId" text NOT NULL,
	"channelName" text NOT NULL,
	"webhookURL" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SocialMediaAgency" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"name" text NOT NULL,
	"logoId" uuid,
	"website" text,
	"slug" text,
	"facebook" text,
	"instagram" text,
	"twitter" text,
	"linkedIn" text,
	"youtube" text,
	"tiktok" text,
	"otherSocialMedia" text,
	"shortDescription" text NOT NULL,
	"description" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Step" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"readableId" text,
	"tenantId" uuid NOT NULL,
	"jobId" uuid NOT NULL,
	"actionId" text NOT NULL,
	"timeout" text,
	"retries" integer DEFAULT 0 NOT NULL,
	"customUserData" jsonb,
	"scheduleTimeout" text DEFAULT '5m' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "StepDesiredWorkerLabel" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"stepId" uuid NOT NULL,
	"key" text NOT NULL,
	"strValue" text,
	"intValue" integer,
	"required" boolean NOT NULL,
	"comparator" "WorkerLabelComparator" NOT NULL,
	"weight" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "RateLimit" (
	"tenantId" uuid NOT NULL,
	"key" text NOT NULL,
	"limitValue" integer NOT NULL,
	"value" integer NOT NULL,
	"window" text NOT NULL,
	"lastRefill" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "StepRateLimit" (
	"units" integer NOT NULL,
	"stepId" uuid NOT NULL,
	"rateLimitKey" text NOT NULL,
	"kind" "StepRateLimitKind" DEFAULT 'STATIC' NOT NULL,
	"tenantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "StepRunResultArchive" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"stepRunId" uuid NOT NULL,
	"retryCount" integer DEFAULT 0 NOT NULL,
	"order" bigserial NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"error" text,
	"startedAt" timestamp(3),
	"finishedAt" timestamp(3),
	"timeoutAt" timestamp(3),
	"cancelledAt" timestamp(3),
	"cancelledReason" text,
	"cancelledError" text
);
--> statement-breakpoint
CREATE TABLE "StreamEvent" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"stepRunId" uuid,
	"message" "bytea" NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "ControllerPartition" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"lastHeartbeat" timestamp(3),
	"name" text
);
--> statement-breakpoint
CREATE TABLE "SchedulerPartition" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"lastHeartbeat" timestamp(3),
	"name" text
);
--> statement-breakpoint
CREATE TABLE "TenantWorkerPartition" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"lastHeartbeat" timestamp(3),
	"name" text
);
--> statement-breakpoint
CREATE TABLE "TenantAlertEmailGroup" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"emails" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TenantAlertingSettings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"enableWorkflowRunFailureAlerts" boolean DEFAULT false NOT NULL,
	"enableExpiringTokenAlerts" boolean DEFAULT true NOT NULL,
	"enableTenantResourceLimitAlerts" boolean DEFAULT true NOT NULL,
	"maxFrequency" text DEFAULT '1h' NOT NULL,
	"lastAlertedAt" timestamp(3),
	"tickerId" uuid
);
--> statement-breakpoint
CREATE TABLE "TenantInviteLink" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"inviterEmail" text NOT NULL,
	"inviteeEmail" text NOT NULL,
	"expires" timestamp(3) NOT NULL,
	"status" "InviteLinkStatus" DEFAULT 'PENDING' NOT NULL,
	"role" "TenantMemberRole" DEFAULT 'OWNER' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TenantMember" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"role" "TenantMemberRole" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TenantResourceLimit" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"resource" "LimitResource" NOT NULL,
	"tenantId" uuid NOT NULL,
	"limitValue" integer NOT NULL,
	"alarmValue" integer,
	"value" integer DEFAULT 0 NOT NULL,
	"window" text,
	"lastRefill" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"customValueMeter" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TenantResourceLimitAlert" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"resourceLimitId" uuid NOT NULL,
	"tenantId" uuid NOT NULL,
	"resource" "LimitResource" NOT NULL,
	"alertType" "TenantResourceLimitAlertType" NOT NULL,
	"value" integer NOT NULL,
	"limit" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TenantVcsProvider" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"vcsProvider" "VcsProvider" NOT NULL,
	"config" jsonb
);
--> statement-breakpoint
CREATE TABLE "UserOAuth" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userId" uuid NOT NULL,
	"provider" text NOT NULL,
	"providerUserId" text NOT NULL,
	"accessToken" "bytea" NOT NULL,
	"refreshToken" "bytea",
	"expiresAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "UserPassword" (
	"hash" text NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserSession" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userId" uuid,
	"data" jsonb,
	"expiresAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WebhookWorker" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"name" text NOT NULL,
	"secret" text NOT NULL,
	"url" text NOT NULL,
	"tokenValue" text,
	"deleted" boolean DEFAULT false NOT NULL,
	"tokenId" uuid,
	"tenantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WebhookWorkerRequest" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"webhookWorkerId" uuid NOT NULL,
	"method" "WebhookWorkerRequestMethod" NOT NULL,
	"statusCode" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WebhookWorkerWorkflow" (
	"id" uuid PRIMARY KEY NOT NULL,
	"webhookWorkerId" uuid NOT NULL,
	"workflowId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Workflow" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"isPaused" boolean DEFAULT false,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "Dispatcher" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"lastHeartbeatAt" timestamp(3),
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorkerAssignEvent" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"workerId" uuid NOT NULL,
	"assignedStepRuns" jsonb
);
--> statement-breakpoint
CREATE TABLE "WorkerLabel" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"workerId" uuid NOT NULL,
	"key" text NOT NULL,
	"strValue" text,
	"intValue" integer
);
--> statement-breakpoint
CREATE TABLE "WorkflowConcurrency" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"workflowVersionId" uuid NOT NULL,
	"getConcurrencyGroupId" uuid,
	"concurrencyGroupExpression" text,
	"maxRuns" integer DEFAULT 1 NOT NULL,
	"limitStrategy" "ConcurrencyLimitStrategy" DEFAULT 'CANCEL_IN_PROGRESS' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorkflowRunStickyState" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"workflowRunId" uuid NOT NULL,
	"desiredWorkerId" uuid,
	"strategy" "StickyStrategy" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorkflowTriggerCronRef" (
	"parentId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"cron" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"tickerId" uuid,
	"input" jsonb,
	"additionalMetadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "WorkflowRunTriggeredBy" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"tenantId" uuid NOT NULL,
	"parentId" uuid NOT NULL,
	"input" jsonb,
	"eventId" uuid,
	"cronParentId" uuid,
	"cronSchedule" text,
	"scheduledId" uuid
);
--> statement-breakpoint
CREATE TABLE "WorkflowTriggerScheduledRef" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"parentId" uuid NOT NULL,
	"triggerAt" timestamp(3) NOT NULL,
	"tickerId" uuid,
	"input" jsonb,
	"parentWorkflowRunId" uuid,
	"parentStepRunId" uuid,
	"childIndex" integer,
	"childKey" text,
	"additionalMetadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "WorkflowTag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"tenantId" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#93C5FD' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorkflowTriggers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deletedAt" timestamp(3),
	"workflowVersionId" uuid NOT NULL,
	"tenantId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorkflowTriggerEventRef" (
	"parentId" uuid NOT NULL,
	"eventKey" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_ActionToWorker" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_BlogPostToTag" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_MediaToUser" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_ServiceToWorker" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_StepOrder" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_StepRunOrder" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_WorkflowToWorkflowTag" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SocialMediaAgencyNiche" (
	"agencyId" uuid NOT NULL,
	"niche" text NOT NULL,
	CONSTRAINT "SocialMediaAgencyNiche_pkey" PRIMARY KEY("agencyId","niche")
);
--> statement-breakpoint
CREATE TABLE "StepExpression" (
	"key" text NOT NULL,
	"stepId" uuid NOT NULL,
	"expression" text NOT NULL,
	"kind" "StepExpressionKind" NOT NULL,
	CONSTRAINT "StepExpression_pkey" PRIMARY KEY("key","stepId","kind")
);
--> statement-breakpoint
CREATE TABLE "StepRunExpressionEval" (
	"key" text NOT NULL,
	"stepRunId" uuid NOT NULL,
	"valueStr" text,
	"valueInt" integer,
	"kind" "StepExpressionKind" NOT NULL,
	CONSTRAINT "StepRunExpressionEval_pkey" PRIMARY KEY("key","stepRunId","kind")
);
--> statement-breakpoint
CREATE TABLE "KVStore" (
	"ns" text DEFAULT 'default' NOT NULL,
	"isSystem" boolean DEFAULT false NOT NULL,
	"tenantId" uuid,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expiresAt" timestamp(3),
	CONSTRAINT "KVStore_pkey" PRIMARY KEY("ns","key")
);
--> statement-breakpoint
ALTER TABLE "SiteHost" ADD CONSTRAINT "SiteHost_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Site" ADD CONSTRAINT "Site_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_replayedFromId_fkey" FOREIGN KEY ("replayedFromId") REFERENCES "public"."Event"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Endpoint" ADD CONSTRAINT "Endpoint_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "public"."Messages"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "public"."Post"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowRun" ADD CONSTRAINT "WorkflowRun_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowRun" ADD CONSTRAINT "WorkflowRun_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."WorkflowRun"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowRun" ADD CONSTRAINT "WorkflowRun_parentStepRunId_fkey" FOREIGN KEY ("parentStepRunId") REFERENCES "public"."StepRun"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_controllerPartitionId_fkey" FOREIGN KEY ("controllerPartitionId") REFERENCES "public"."ControllerPartition"("id") ON DELETE set null ON UPDATE set null;--> statement-breakpoint
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_schedulerPartitionId_fkey" FOREIGN KEY ("schedulerPartitionId") REFERENCES "public"."SchedulerPartition"("id") ON DELETE set null ON UPDATE set null;--> statement-breakpoint
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_workerPartitionId_fkey" FOREIGN KEY ("workerPartitionId") REFERENCES "public"."TenantWorkerPartition"("id") ON DELETE set null ON UPDATE set null;--> statement-breakpoint
ALTER TABLE "APIToken" ADD CONSTRAINT "APIToken_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Action" ADD CONSTRAINT "Action_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "AgentNode" ADD CONSTRAINT "AgentNode_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "AgentNodeRun" ADD CONSTRAINT "AgentNodeRun_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "public"."AgentNode"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "AgentNodeRun" ADD CONSTRAINT "AgentNodeRun_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Assisant" ADD CONSTRAINT "Assisant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "BlogConfig" ADD CONSTRAINT "BlogConfig_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."BlogPost"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GetGroupKeyRun" ADD CONSTRAINT "GetGroupKeyRun_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "public"."Ticker"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GetGroupKeyRun" ADD CONSTRAINT "GetGroupKeyRun_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GetGroupKeyRun" ADD CONSTRAINT "GetGroupKeyRun_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "public"."WorkflowRun"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_dispatcherId_fkey" FOREIGN KEY ("dispatcherId") REFERENCES "public"."Dispatcher"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "public"."WebhookWorker"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_onFailureJobId_fkey" FOREIGN KEY ("onFailureJobId") REFERENCES "public"."Job"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowVersion" ADD CONSTRAINT "WorkflowVersion_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Job" ADD CONSTRAINT "Job_workflowVersionId_fkey" FOREIGN KEY ("workflowVersionId") REFERENCES "public"."WorkflowVersion"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "JobRun" ADD CONSTRAINT "JobRun_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "public"."WorkflowRun"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "JobRunLookupData" ADD CONSTRAINT "JobRunLookupData_jobRunId_fkey" FOREIGN KEY ("jobRunId") REFERENCES "public"."JobRun"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "StepRun" ADD CONSTRAINT "StepRun_jobRunId_fkey" FOREIGN KEY ("jobRunId") REFERENCES "public"."JobRun"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "StepRun" ADD CONSTRAINT "StepRun_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "LogLine" ADD CONSTRAINT "LogLine_stepRunId_fkey" FOREIGN KEY ("stepRunId") REFERENCES "public"."StepRun"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Media" ADD CONSTRAINT "Media_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."MessagesGroup"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SNSIntegration" ADD CONSTRAINT "SNSIntegration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Service" ADD CONSTRAINT "Service_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SlackAppWebhook" ADD CONSTRAINT "SlackAppWebhook_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SocialMediaAgency" ADD CONSTRAINT "SocialMediaAgency_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "public"."Media"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SocialMediaAgency" ADD CONSTRAINT "SocialMediaAgency_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Step" ADD CONSTRAINT "Step_actionId_tenantId_fkey" FOREIGN KEY ("tenantId","actionId") REFERENCES "public"."Action"("actionId","tenantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Step" ADD CONSTRAINT "Step_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "StepDesiredWorkerLabel" ADD CONSTRAINT "StepDesiredWorkerLabel_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "public"."Step"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "StepRateLimit" ADD CONSTRAINT "StepRateLimit_tenantId_rateLimitKey_fkey" FOREIGN KEY ("rateLimitKey","tenantId") REFERENCES "public"."RateLimit"("tenantId","key") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "StepRunResultArchive" ADD CONSTRAINT "StepRunResultArchive_stepRunId_fkey" FOREIGN KEY ("stepRunId") REFERENCES "public"."StepRun"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "StreamEvent" ADD CONSTRAINT "StreamEvent_stepRunId_fkey" FOREIGN KEY ("stepRunId") REFERENCES "public"."StepRun"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantAlertEmailGroup" ADD CONSTRAINT "TenantAlertEmailGroup_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantAlertingSettings" ADD CONSTRAINT "TenantAlertingSettings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantAlertingSettings" ADD CONSTRAINT "TenantAlertingSettings_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "public"."Ticker"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantInviteLink" ADD CONSTRAINT "TenantInviteLink_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantMember" ADD CONSTRAINT "TenantMember_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantMember" ADD CONSTRAINT "TenantMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantResourceLimit" ADD CONSTRAINT "TenantResourceLimit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantResourceLimitAlert" ADD CONSTRAINT "TenantResourceLimitAlert_resourceLimitId_fkey" FOREIGN KEY ("resourceLimitId") REFERENCES "public"."TenantResourceLimit"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantResourceLimitAlert" ADD CONSTRAINT "TenantResourceLimitAlert_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TenantVcsProvider" ADD CONSTRAINT "TenantVcsProvider_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserOAuth" ADD CONSTRAINT "UserOAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserPassword" ADD CONSTRAINT "UserPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WebhookWorker" ADD CONSTRAINT "WebhookWorker_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WebhookWorker" ADD CONSTRAINT "WebhookWorker_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."APIToken"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WebhookWorkerRequest" ADD CONSTRAINT "WebhookWorkerRequest_webhookWorkerId_fkey" FOREIGN KEY ("webhookWorkerId") REFERENCES "public"."WebhookWorker"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WebhookWorkerWorkflow" ADD CONSTRAINT "WebhookWorkerWorkflow_webhookWorkerId_fkey" FOREIGN KEY ("webhookWorkerId") REFERENCES "public"."WebhookWorker"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WebhookWorkerWorkflow" ADD CONSTRAINT "WebhookWorkerWorkflow_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkerAssignEvent" ADD CONSTRAINT "WorkerAssignEvent_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkerLabel" ADD CONSTRAINT "WorkerLabel_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."Worker"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowConcurrency" ADD CONSTRAINT "WorkflowConcurrency_getConcurrencyGroupId_fkey" FOREIGN KEY ("getConcurrencyGroupId") REFERENCES "public"."Action"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowConcurrency" ADD CONSTRAINT "WorkflowConcurrency_workflowVersionId_fkey" FOREIGN KEY ("workflowVersionId") REFERENCES "public"."WorkflowVersion"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowRunStickyState" ADD CONSTRAINT "WorkflowRunStickyState_workflowRunId_fkey" FOREIGN KEY ("workflowRunId") REFERENCES "public"."WorkflowRun"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggerCronRef" ADD CONSTRAINT "WorkflowTriggerCronRef_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."WorkflowTriggers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggerCronRef" ADD CONSTRAINT "WorkflowTriggerCronRef_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "public"."Ticker"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowRunTriggeredBy" ADD CONSTRAINT "WorkflowRunTriggeredBy_cronParentId_cronSchedule_fkey" FOREIGN KEY ("cronParentId","cronSchedule") REFERENCES "public"."WorkflowTriggerCronRef"("parentId","cron") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowRunTriggeredBy" ADD CONSTRAINT "WorkflowRunTriggeredBy_scheduledId_fkey" FOREIGN KEY ("scheduledId") REFERENCES "public"."WorkflowTriggerScheduledRef"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggerScheduledRef" ADD CONSTRAINT "WorkflowTriggerScheduledRef_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."WorkflowVersion"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggerScheduledRef" ADD CONSTRAINT "WorkflowTriggerScheduledRef_parentStepRunId_fkey" FOREIGN KEY ("parentStepRunId") REFERENCES "public"."StepRun"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggerScheduledRef" ADD CONSTRAINT "WorkflowTriggerScheduledRef_parentWorkflowRunId_fkey" FOREIGN KEY ("parentWorkflowRunId") REFERENCES "public"."WorkflowRun"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggerScheduledRef" ADD CONSTRAINT "WorkflowTriggerScheduledRef_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "public"."Ticker"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTag" ADD CONSTRAINT "WorkflowTag_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggers" ADD CONSTRAINT "WorkflowTriggers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggers" ADD CONSTRAINT "WorkflowTriggers_workflowVersionId_fkey" FOREIGN KEY ("workflowVersionId") REFERENCES "public"."WorkflowVersion"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkflowTriggerEventRef" ADD CONSTRAINT "WorkflowTriggerEventRef_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."WorkflowTriggers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ActionToWorker" ADD CONSTRAINT "_ActionToWorker_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Action"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ActionToWorker" ADD CONSTRAINT "_ActionToWorker_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Worker"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_BlogPostToTag" ADD CONSTRAINT "_BlogPostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BlogPost"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_BlogPostToTag" ADD CONSTRAINT "_BlogPostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_MediaToUser" ADD CONSTRAINT "_MediaToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Media"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_MediaToUser" ADD CONSTRAINT "_MediaToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ServiceToWorker" ADD CONSTRAINT "_ServiceToWorker_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Service"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ServiceToWorker" ADD CONSTRAINT "_ServiceToWorker_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Worker"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_StepOrder" ADD CONSTRAINT "_StepOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Step"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_StepOrder" ADD CONSTRAINT "_StepOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Step"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_StepRunOrder" ADD CONSTRAINT "_StepRunOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."StepRun"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_StepRunOrder" ADD CONSTRAINT "_StepRunOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."StepRun"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_WorkflowToWorkflowTag" ADD CONSTRAINT "_WorkflowToWorkflowTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Workflow"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_WorkflowToWorkflowTag" ADD CONSTRAINT "_WorkflowToWorkflowTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."WorkflowTag"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SocialMediaAgencyNiche" ADD CONSTRAINT "SocialMediaAgencyNiche_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."SocialMediaAgency"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "KVStore" ADD CONSTRAINT "KVStore_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "PopularPosts_id_key" ON "PopularPosts" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "InternalQueueItem_isQueued_tenantId_queue_priority_id_idx" ON "InternalQueueItem" USING btree ("isQueued" enum_ops,"tenantId" uuid_ops,"queue" uuid_ops,"priority" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "InternalQueueItem_tenantId_queue_uniqueKey_key" ON "InternalQueueItem" USING btree ("tenantId" text_ops,"queue" text_ops,"uniqueKey" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SiteHost_id_key" ON "SiteHost" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Site_id_key" ON "Site" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "Env_appName_idx" ON "Env" USING btree ("appName" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ChatSuggestion_id_key" ON "ChatSuggestion" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "Event_createdAt_idx" ON "Event" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Event_id_key" ON "Event" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "Event_tenantId_createdAt_idx" ON "Event" USING btree ("tenantId" uuid_ops,"createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "Event_tenantId_idx" ON "Event" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "EventKey_key_tenantId_key" ON "EventKey" USING btree ("key" text_ops,"tenantId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Lease_tenantId_kind_resourceId_key" ON "Lease" USING btree ("tenantId" text_ops,"kind" text_ops,"resourceId" text_ops);--> statement-breakpoint
CREATE INDEX "Post_createdAt_idx" ON "Post" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "Post_deletedAt_idx" ON "Post" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Post_id_key" ON "Post" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "Post_lastMessageId_idx" ON "Post" USING btree ("lastMessageId" uuid_ops);--> statement-breakpoint
CREATE INDEX "Post_parentPostId_idx" ON "Post" USING btree ("parentPostId" uuid_ops);--> statement-breakpoint
CREATE INDEX "Post_publishDate_idx" ON "Post" USING btree ("publishDate" timestamp_ops);--> statement-breakpoint
CREATE INDEX "Post_releaseURL_idx" ON "Post" USING btree ("releaseURL" text_ops);--> statement-breakpoint
CREATE INDEX "Post_state_idx" ON "Post" USING btree ("state" enum_ops);--> statement-breakpoint
CREATE INDEX "Post_tenantId_idx" ON "Post" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE INDEX "Post_updatedAt_idx" ON "Post" USING btree ("updatedAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "Queue_tenantId_lastActive_idx" ON "Queue" USING btree ("tenantId" timestamp_ops,"lastActive" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Queue_tenantId_name_key" ON "Queue" USING btree ("tenantId" text_ops,"name" text_ops);--> statement-breakpoint
CREATE INDEX "PlatformAccount_properties_gin_idx" ON "PlatformAccount" USING gin ("properties" jsonb_ops);--> statement-breakpoint
CREATE INDEX "PlatformAccount_tags_idx" ON "PlatformAccount" USING gin ("tags" array_ops);--> statement-breakpoint
CREATE INDEX "QueueItem_isQueued_priority_tenantId_queue_id_idx_2" ON "QueueItem" USING btree ("isQueued" uuid_ops,"tenantId" bool_ops,"queue" bool_ops,"priority" bool_ops,"id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SecurityCheckIdent_id_key" ON "SecurityCheckIdent" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SemaphoreQueueItem_stepRunId_key" ON "SemaphoreQueueItem" USING btree ("stepRunId" uuid_ops);--> statement-breakpoint
CREATE INDEX "SemaphoreQueueItem_tenantId_workerId_idx" ON "SemaphoreQueueItem" USING btree ("tenantId" uuid_ops,"workerId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "StepRunEvent_id_key" ON "StepRunEvent" USING btree ("id" int8_ops);--> statement-breakpoint
CREATE INDEX "StepRunEvent_stepRunId_idx" ON "StepRunEvent" USING btree ("stepRunId" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRunEvent_workflowRunId_idx" ON "StepRunEvent" USING btree ("workflowRunId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TimeoutQueueItem_stepRunId_retryCount_key" ON "TimeoutQueueItem" USING btree ("stepRunId" int4_ops,"retryCount" int4_ops);--> statement-breakpoint
CREATE INDEX "TimeoutQueueItem_tenantId_isQueued_timeoutAt_idx" ON "TimeoutQueueItem" USING btree ("tenantId" timestamp_ops,"isQueued" timestamp_ops,"timeoutAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Vote_chatId_messageId_key" ON "Vote" USING btree ("chatId" uuid_ops,"messageId" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_byUserId_idx" ON "WorkflowRun" USING btree ("byUserId" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_createdAt_idx" ON "WorkflowRun" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_deletedAt_idx" ON "WorkflowRun" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_finishedAt_idx" ON "WorkflowRun" USING btree ("finishedAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowRun_id_key" ON "WorkflowRun" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_parentId_parentStepRunId_childIndex_key" ON "WorkflowRun" USING btree ("parentId" uuid_ops,"parentStepRunId" int4_ops,"childIndex" uuid_ops) WHERE ("deletedAt" IS NULL);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowRun_parentId_parentStepRunId_childKey_key" ON "WorkflowRun" USING btree ("parentId" text_ops,"parentStepRunId" uuid_ops,"childKey" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_parentStepRunId" ON "WorkflowRun" USING btree ("parentStepRunId" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_status_idx" ON "WorkflowRun" USING btree ("status" enum_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_tenantId_createdAt_idx" ON "WorkflowRun" USING btree ("tenantId" uuid_ops,"createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_tenantId_idx" ON "WorkflowRun" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRun_workflowVersionId_idx" ON "WorkflowRun" USING btree ("workflowVersionId" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_workflowrun_concurrency" ON "WorkflowRun" USING btree ("concurrencyGroupId" text_ops,"createdAt" text_ops);--> statement-breakpoint
CREATE INDEX "idx_workflowrun_main" ON "WorkflowRun" USING btree ("tenantId" timestamp_ops,"deletedAt" timestamp_ops,"status" timestamp_ops,"workflowVersionId" timestamp_ops,"createdAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowRunDedupe_id_key" ON "WorkflowRunDedupe" USING btree ("id" int8_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRunDedupe_tenantId_value_idx" ON "WorkflowRunDedupe" USING btree ("tenantId" text_ops,"value" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowRunDedupe_tenantId_workflowId_value_key" ON "WorkflowRunDedupe" USING btree ("tenantId" text_ops,"workflowId" text_ops,"value" text_ops);--> statement-breakpoint
CREATE INDEX "Tenant_controllerPartitionId_idx" ON "Tenant" USING btree ("controllerPartitionId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Tenant_id_key" ON "Tenant" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "Tenant_workerPartitionId_idx" ON "Tenant" USING btree ("workerPartitionId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Action_id_key" ON "Action" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "AgentNode_id_key" ON "AgentNode" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "AgentNode_tenantId_id_idx" ON "AgentNode" USING btree ("tenantId" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "AgentNodeRun_id_key" ON "AgentNodeRun" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "AgentNodeRun_tenantId_id_idx" ON "AgentNodeRun" USING btree ("tenantId" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Artifact_id_key" ON "Artifact" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Assisant_id_key" ON "Assisant" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Blog_id_key" ON "Blog" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "BlogConfig_blogId_key" ON "BlogConfig" USING btree ("blogId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "BlogConfig_id_key" ON "BlogConfig" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_id_key" ON "User" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "BlogPost_id_key" ON "BlogPost" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ChatMessage_id_key" ON "ChatMessage" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Ticker_id_key" ON "Ticker" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "GetGroupKeyRun_createdAt_idx" ON "GetGroupKeyRun" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "GetGroupKeyRun_deletedAt_idx" ON "GetGroupKeyRun" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "GetGroupKeyRun_id_key" ON "GetGroupKeyRun" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "GetGroupKeyRun_status_deletedAt_timeoutAt_idx" ON "GetGroupKeyRun" USING btree ("status" enum_ops,"deletedAt" timestamp_ops,"timeoutAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "GetGroupKeyRun_tenantId_deletedAt_status_idx" ON "GetGroupKeyRun" USING btree ("tenantId" uuid_ops,"deletedAt" timestamp_ops,"status" timestamp_ops);--> statement-breakpoint
CREATE INDEX "GetGroupKeyRun_tenantId_idx" ON "GetGroupKeyRun" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE INDEX "GetGroupKeyRun_workerId_idx" ON "GetGroupKeyRun" USING btree ("workerId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "GetGroupKeyRun_workflowRunId_key" ON "GetGroupKeyRun" USING btree ("workflowRunId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Worker_id_key" ON "Worker" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Worker_webhookId_key" ON "Worker" USING btree ("webhookId" uuid_ops);--> statement-breakpoint
CREATE INDEX "Integration_deletedAt_idx" ON "Integration" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Integration_id_key" ON "Integration" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Integration_organizationId_internalId_key" ON "Integration" USING btree ("organizationId" uuid_ops,"internalId" uuid_ops);--> statement-breakpoint
CREATE INDEX "Integration_updatedAt_idx" ON "Integration" USING btree ("updatedAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "WorkflowVersion_deletedAt_idx" ON "WorkflowVersion" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowVersion_id_key" ON "WorkflowVersion" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowVersion_onFailureJobId_key" ON "WorkflowVersion" USING btree ("onFailureJobId" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_workflow_version_workflow_id_order" ON "WorkflowVersion" USING btree ("workflowId" int8_ops,"order" int8_ops) WHERE ("deletedAt" IS NULL);--> statement-breakpoint
CREATE UNIQUE INDEX "Job_id_key" ON "Job" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Job_workflowVersionId_name_key" ON "Job" USING btree ("workflowVersionId" text_ops,"name" text_ops);--> statement-breakpoint
CREATE INDEX "JobRun_deletedAt_idx" ON "JobRun" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "JobRun_id_key" ON "JobRun" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "JobRun_workflowRunId_tenantId_idx" ON "JobRun" USING btree ("workflowRunId" uuid_ops,"tenantId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "JobRunLookupData_id_key" ON "JobRunLookupData" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "JobRunLookupData_jobRunId_key" ON "JobRunLookupData" USING btree ("jobRunId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "JobRunLookupData_jobRunId_tenantId_key" ON "JobRunLookupData" USING btree ("jobRunId" uuid_ops,"tenantId" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRun_createdAt_idx" ON "StepRun" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "StepRun_deletedAt_idx" ON "StepRun" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "StepRun_id_key" ON "StepRun" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRun_id_tenantId_idx" ON "StepRun" USING btree ("id" uuid_ops,"tenantId" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRun_jobRunId_status_idx" ON "StepRun" USING btree ("jobRunId" enum_ops,"status" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRun_jobRunId_status_tenantId_idx" ON "StepRun" USING btree ("jobRunId" enum_ops,"status" enum_ops,"tenantId" enum_ops) WHERE (status = 'PENDING'::"StepRunStatus");--> statement-breakpoint
CREATE INDEX "StepRun_jobRunId_tenantId_order_idx" ON "StepRun" USING btree ("jobRunId" uuid_ops,"tenantId" int8_ops,"order" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRun_stepId_idx" ON "StepRun" USING btree ("stepId" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRun_tenantId_idx" ON "StepRun" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRun_workerId_idx" ON "StepRun" USING btree ("workerId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Media_id_key" ON "Media" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "Media_tenantId_idx" ON "Media" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE INDEX "MessagesGroup_createdAt_idx" ON "MessagesGroup" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "MessagesGroup_id_key" ON "MessagesGroup" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "MessagesGroup_updatedAt_idx" ON "MessagesGroup" USING btree ("updatedAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "Messages_createdAt_idx" ON "Messages" USING btree ("createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "Messages_deletedAt_idx" ON "Messages" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "Messages_groupId_idx" ON "Messages" USING btree ("groupId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Messages_id_key" ON "Messages" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Prompt_id_key" ON "Prompt" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Reply_id_key" ON "Reply" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SNSIntegration_id_key" ON "SNSIntegration" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SNSIntegration_tenantId_topicArn_key" ON "SNSIntegration" USING btree ("tenantId" text_ops,"topicArn" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Service_id_key" ON "Service" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Service_tenantId_name_key" ON "Service" USING btree ("tenantId" text_ops,"name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SlackAppWebhook_id_key" ON "SlackAppWebhook" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SlackAppWebhook_tenantId_teamId_channelId_key" ON "SlackAppWebhook" USING btree ("tenantId" text_ops,"teamId" text_ops,"channelId" text_ops);--> statement-breakpoint
CREATE INDEX "SocialMediaAgency_deletedAt_idx" ON "SocialMediaAgency" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "SocialMediaAgency_id_idx" ON "SocialMediaAgency" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SocialMediaAgency_id_key" ON "SocialMediaAgency" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "SocialMediaAgency_userId_idx" ON "SocialMediaAgency" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Step_id_key" ON "Step" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Step_jobId_readableId_key" ON "Step" USING btree ("jobId" text_ops,"readableId" text_ops);--> statement-breakpoint
CREATE INDEX "StepDesiredWorkerLabel_stepId_idx" ON "StepDesiredWorkerLabel" USING btree ("stepId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "StepDesiredWorkerLabel_stepId_key_key" ON "StepDesiredWorkerLabel" USING btree ("stepId" text_ops,"key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "StepRateLimit_stepId_rateLimitKey_key" ON "StepRateLimit" USING btree ("stepId" text_ops,"rateLimitKey" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "StepRunResultArchive_id_key" ON "StepRunResultArchive" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ControllerPartition_id_key" ON "ControllerPartition" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SchedulerPartition_id_key" ON "SchedulerPartition" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantWorkerPartition_id_key" ON "TenantWorkerPartition" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantAlertEmailGroup_id_key" ON "TenantAlertEmailGroup" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantAlertingSettings_id_key" ON "TenantAlertingSettings" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantAlertingSettings_tenantId_key" ON "TenantAlertingSettings" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantInviteLink_id_key" ON "TenantInviteLink" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantMember_id_key" ON "TenantMember" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantMember_tenantId_userId_key" ON "TenantMember" USING btree ("tenantId" uuid_ops,"userId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantResourceLimit_id_key" ON "TenantResourceLimit" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantResourceLimit_tenantId_resource_key" ON "TenantResourceLimit" USING btree ("tenantId" uuid_ops,"resource" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantResourceLimitAlert_id_key" ON "TenantResourceLimitAlert" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantVcsProvider_id_key" ON "TenantVcsProvider" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "TenantVcsProvider_tenantId_vcsProvider_key" ON "TenantVcsProvider" USING btree ("tenantId" uuid_ops,"vcsProvider" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UserOAuth_id_key" ON "UserOAuth" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UserOAuth_userId_key" ON "UserOAuth" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UserOAuth_userId_provider_key" ON "UserOAuth" USING btree ("userId" text_ops,"provider" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UserPassword_userId_key" ON "UserPassword" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "UserSession_id_key" ON "UserSession" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WebhookWorker_id_key" ON "WebhookWorker" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WebhookWorker_url_key" ON "WebhookWorker" USING btree ("url" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WebhookWorkerRequest_id_key" ON "WebhookWorkerRequest" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WebhookWorkerWorkflow_id_key" ON "WebhookWorkerWorkflow" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WebhookWorkerWorkflow_webhookWorkerId_workflowId_key" ON "WebhookWorkerWorkflow" USING btree ("webhookWorkerId" uuid_ops,"workflowId" uuid_ops);--> statement-breakpoint
CREATE INDEX "Workflow_deletedAt_idx" ON "Workflow" USING btree ("deletedAt" timestamp_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Workflow_id_key" ON "Workflow" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Workflow_tenantId_name_key" ON "Workflow" USING btree ("tenantId" uuid_ops,"name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_workflow_tenant_id" ON "Workflow" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Dispatcher_id_key" ON "Dispatcher" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkerAssignEvent_workerId_id_idx" ON "WorkerAssignEvent" USING btree ("workerId" int8_ops,"id" int8_ops);--> statement-breakpoint
CREATE INDEX "WorkerLabel_workerId_idx" ON "WorkerLabel" USING btree ("workerId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkerLabel_workerId_key_key" ON "WorkerLabel" USING btree ("workerId" text_ops,"key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowConcurrency_id_key" ON "WorkflowConcurrency" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowConcurrency_workflowVersionId_key" ON "WorkflowConcurrency" USING btree ("workflowVersionId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowRunStickyState_workflowRunId_key" ON "WorkflowRunStickyState" USING btree ("workflowRunId" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRunTriggeredBy_eventId_idx" ON "WorkflowRunTriggeredBy" USING btree ("eventId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowRunTriggeredBy_id_key" ON "WorkflowRunTriggeredBy" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRunTriggeredBy_parentId_idx" ON "WorkflowRunTriggeredBy" USING btree ("parentId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowRunTriggeredBy_parentId_key" ON "WorkflowRunTriggeredBy" USING btree ("parentId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowRunTriggeredBy_scheduledId_key" ON "WorkflowRunTriggeredBy" USING btree ("scheduledId" uuid_ops);--> statement-breakpoint
CREATE INDEX "WorkflowRunTriggeredBy_tenantId_idx" ON "WorkflowRunTriggeredBy" USING btree ("tenantId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowTriggerScheduledRef_id_key" ON "WorkflowTriggerScheduledRef" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowTriggerScheduledRef_parentId_parentStepRunId_childK_key" ON "WorkflowTriggerScheduledRef" USING btree ("parentId" text_ops,"parentStepRunId" uuid_ops,"childKey" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowTag_id_key" ON "WorkflowTag" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowTag_tenantId_name_key" ON "WorkflowTag" USING btree ("tenantId" text_ops,"name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowTriggers_id_key" ON "WorkflowTriggers" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowTriggers_workflowVersionId_key" ON "WorkflowTriggers" USING btree ("workflowVersionId" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_workflow_triggers_workflow_version_id" ON "WorkflowTriggers" USING btree ("workflowVersionId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WorkflowTriggerEventRef_parentId_eventKey_key" ON "WorkflowTriggerEventRef" USING btree ("parentId" text_ops,"eventKey" text_ops);--> statement-breakpoint
CREATE INDEX "idx_workflow_trigger_event_ref_event_key_parent_id" ON "WorkflowTriggerEventRef" USING btree ("eventKey" text_ops,"parentId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "_ActionToWorker_AB_unique" ON "_ActionToWorker" USING btree ("A" uuid_ops,"B" uuid_ops);--> statement-breakpoint
CREATE INDEX "_ActionToWorker_B_index" ON "_ActionToWorker" USING btree ("B" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "_BlogPostToTag_AB_unique" ON "_BlogPostToTag" USING btree ("A" uuid_ops,"B" uuid_ops);--> statement-breakpoint
CREATE INDEX "_BlogPostToTag_B_index" ON "_BlogPostToTag" USING btree ("B" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Tag_id_key" ON "Tag" USING btree ("id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "_MediaToUser_AB_unique" ON "_MediaToUser" USING btree ("A" uuid_ops,"B" uuid_ops);--> statement-breakpoint
CREATE INDEX "_MediaToUser_B_index" ON "_MediaToUser" USING btree ("B" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "_ServiceToWorker_AB_unique" ON "_ServiceToWorker" USING btree ("A" uuid_ops,"B" uuid_ops);--> statement-breakpoint
CREATE INDEX "_ServiceToWorker_B_index" ON "_ServiceToWorker" USING btree ("B" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "_StepOrder_AB_unique" ON "_StepOrder" USING btree ("A" uuid_ops,"B" uuid_ops);--> statement-breakpoint
CREATE INDEX "_StepOrder_B_index" ON "_StepOrder" USING btree ("B" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "_StepRunOrder_AB_unique" ON "_StepRunOrder" USING btree ("A" uuid_ops,"B" uuid_ops);--> statement-breakpoint
CREATE INDEX "_StepRunOrder_B_index" ON "_StepRunOrder" USING btree ("B" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "_WorkflowToWorkflowTag_AB_unique" ON "_WorkflowToWorkflowTag" USING btree ("A" uuid_ops,"B" uuid_ops);--> statement-breakpoint
CREATE INDEX "_WorkflowToWorkflowTag_B_index" ON "_WorkflowToWorkflowTag" USING btree ("B" uuid_ops);--> statement-breakpoint
CREATE INDEX "StepRunExpressionEval_stepRunId_idx" ON "StepRunExpressionEval" USING btree ("stepRunId" uuid_ops);--> statement-breakpoint
CREATE INDEX "KVStore_ns_key_idx" ON "KVStore" USING btree ("ns" text_ops,"key" text_ops);--> statement-breakpoint
CREATE VIEW "public"."pg_stat_statements_info" AS (SELECT dealloc, stats_reset FROM pg_stat_statements_info() pg_stat_statements_info(dealloc, stats_reset));--> statement-breakpoint
CREATE VIEW "public"."pg_stat_statements" AS (SELECT userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, blk_read_time, blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time FROM pg_stat_statements(true) pg_stat_statements(userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, blk_read_time, blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time));
*/