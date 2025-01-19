"use client";

import { SessionProvider } from "next-auth/react";

export const MtSessionProvider = ({
  children,
}: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
