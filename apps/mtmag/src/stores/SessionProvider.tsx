"use client";

import { SessionProvider as AuthJsSessionProvider, useSession } from "@hono/auth-js/react";

export const MtSessionProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthJsSessionProvider>{children}</AuthJsSessionProvider>;
};

export const useMtSession = () => {
  const session = useSession();
  return session;
};
