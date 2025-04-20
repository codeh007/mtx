import type { Session } from "@auth/core/types";

// Approval string to be shared across frontend and backend
export const APPROVAL = {
  YES: "Yes, confirmed.",
  NO: "No, denied.",
} as const;

export type McpServer = {
  url: string;
  state: "authenticating" | "connecting" | "ready" | "discovering" | "failed";
  authUrl?: string;
};
export type ScheduledItem = {
  id: string;
  type: "cron" | "scheduled" | "delayed";
  trigger: string;
  nextTrigger: string;
  description: string;
};

export type IncomingMessage =
  | {
      type: "schedule";
      input: string;
    }
  | {
      type: "delete-schedule";
      id: string;
    }
  | {
      type: "demo-event-1";
      data: unknown;
    }
  | {
      type: "add-mcp-server";
      data: McpServer;
    }
  | {
      type: "remove-mcp-server";
      id: string;
    }
  | {
      type: "set-mcp-server";
      data: McpServer;
    }
  | {
      type: "set-user-session";
      data: Session;
    }
  | {
      // 调用 python 版 adk
      type: "call-adk";
      data: unknown;
    }
  | {
      type: "demo_run_2";
      data: unknown;
    };

export type OutgoingMessage =
  | {
      type: "connected";
      data: unknown;
    }
  | {
      type: "schedules";
      data: ScheduledItem[];
    }
  | {
      type: "run-schedule";
      data: ScheduledItem;
    }
  | {
      type: "error";
      data: string;
    }
  | {
      type: "schedule";
      data: ScheduledItem;
    }
  | {
      type: "demo-event-response";
      data: unknown;
    }
  | {
      type: "require-main-access-token";
      data: unknown;
    }
  | {
      type: "toast";
      data: {
        message: string;
      };
    };
