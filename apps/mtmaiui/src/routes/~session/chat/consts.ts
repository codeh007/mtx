export const TIMEOUT_CONFIG = {
  DURATION_MS: 3 * 60 * 1000, // 3 minutes in milliseconds
  DURATION_SEC: 3 * 60, // 3 minutes in seconds
  WEBSOCKET_CODE: 4000, // WebSocket close code for timeout
  DEFAULT_MESSAGE: "Input timeout after 3 minutes",
  WARNING_THRESHOLD_SEC: 30, // Show warning when 30 seconds remaining
} as const;
