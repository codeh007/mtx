"use client";

import { SessionProvider } from "next-auth/react";
import { useSessionLoader } from "../hooks/useAuth";

export const MtSessionProvider = ({
  children,
}: { children: React.ReactNode }) => {
  useSessionLoader();
  return <SessionProvider>{children}</SessionProvider>;
};
