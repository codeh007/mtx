import type { CoreMessage } from "ai";

export type Message = CoreMessage & {
  id: string;
};

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export interface Session {
  user: {
    id: string;
    email: string;
  };
}

export interface AuthResult {
  type: string;
  message: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface User extends Record<string, any> {
  id: string;
  email: string;
  password: string;
  salt: string;
}
