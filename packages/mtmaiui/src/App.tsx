"use client";
import { RouterProvider } from "@tanstack/react-router";
import { createRouter } from "./router";
import "./styles/globals.css";
import { useMemo } from "react";

export function App() {
  const mainRouter = useMemo(()=>{
    return createRouter();
  },[])
  return (
    <>
      <RouterProvider router={mainRouter} />
    </>
  );
}
