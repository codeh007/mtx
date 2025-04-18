// Approval string to be shared across frontend and backend
export const APPROVAL = {
  YES: "Yes, confirmed.",
  NO: "No, denied.",
} as const;

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

export type ScheduledItem = {
  id: string;
  type: "cron" | "scheduled" | "delayed";
  trigger: string;
  nextTrigger: string;
  description: string;
};
