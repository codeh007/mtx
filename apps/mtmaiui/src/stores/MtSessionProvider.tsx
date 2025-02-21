"use client";

import { useSessionLoader } from "../hooks/useAuth";

export const MtSessionProvider = ({
  children,
}: { children: React.ReactNode }) => {
  useSessionLoader();
  return <>{children}</>;
};
