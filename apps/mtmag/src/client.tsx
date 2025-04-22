"use client";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";

import { RouterProvider } from "@tanstack/react-router";
import { useMemo } from "react";
import { getQueryClient } from "./lib/get-query-client";
import { createRouter } from "./router";

export function MtmRootApp() {
  const mainRouter = useMemo(() => {
    return createRouter();
  }, []);

  const ctx = {
    tid: "",
    queryClient: getQueryClient(),
  };
  return (
    <>
      <RouterProvider router={mainRouter} context={ctx} />
    </>
  );
}

const root = createRoot(document.getElementById("app")!);
if (document.getElementById("app") !== null) {
  root.render(<MtmRootApp />);
}
