"use client";
import { RouterProvider } from "@tanstack/react-router";
import { createRouter } from "./router";
import { useMemo } from "react";
import { useTenant } from "./hooks/useAuth";

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
