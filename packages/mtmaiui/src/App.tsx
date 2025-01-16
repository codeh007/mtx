"use client";
import { RouterProvider } from "@tanstack/react-router";
import { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { createRouter } from "./router";

export function App() {
  const mainRouter = useMemo(() => {
    return createRouter();
  }, []);

  return (
    <>
      <RouterProvider router={mainRouter} />
    </>
  );
}

if (typeof window !== "undefined") {
  const rootElement = document.getElementById("gomtm-runtime-container");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
}
