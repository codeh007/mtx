CREATE TABLE "adk_app_states" (
	"app_name" text PRIMARY KEY NOT NULL,
	"state" jsonb DEFAULT '{}' NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adk_events" (
	"id" text NOT NULL,
	"app_name" text NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text NOT NULL,
	"invocation_id" text NOT NULL,
	"author" text NOT NULL,
	"branch" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"content" jsonb DEFAULT '{}' NOT NULL,
	"actions" jsonb DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adk_sessions" (
	"app_name" text NOT NULL,
	"user_id" text NOT NULL,
	"id" text DEFAULT gen_random_uuid() NOT NULL,
	"state" jsonb DEFAULT '{}' NOT NULL,
	"create_time" timestamp DEFAULT now() NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL,
	"title" text DEFAULT 'no title' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adk_user_states" (
	"app_name" text NOT NULL,
	"user_id" text NOT NULL,
	"state" jsonb DEFAULT '{}' NOT NULL,
	"update_time" timestamp DEFAULT now() NOT NULL
);
