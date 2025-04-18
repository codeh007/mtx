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
      // id: string;
      data: McpServer;
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
    };
