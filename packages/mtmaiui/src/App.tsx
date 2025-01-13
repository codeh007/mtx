"use client";
import { RouterProvider } from "@tanstack/react-router";
import { createRouter } from "./router";
import { useMemo } from "react";
import { useTenant } from "./hooks/useAuth";
import { createRoot } from "react-dom/client";

export function App() {
  const mainRouter = useMemo(()=>{
    return createRouter();
  },[])

  const tenant = useTenant();
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
