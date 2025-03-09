"use client";
import { RouterProvider } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { getQueryClient } from "./lib/get-query-client";
import { createRouter } from "./router";

export function App() {
  const mainRouter = useMemo(() => {
    return createRouter();
  }, []);

  const ctx = {
    tid: "",
    queryClient: getQueryClient(),
  };

  return (
    <MtSuspenseBoundary>
      <RouterProvider router={mainRouter} context={ctx} />
    </MtSuspenseBoundary>
  );
}

if (typeof window !== "undefined") {
  const rootElement = document.getElementById("gomtm-runtime-container");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
}
