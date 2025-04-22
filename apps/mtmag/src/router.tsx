"use client";
import {
  // createBrowserHistory,
  // createMemoryHistory,
  createHashHistory,
  createRouter as createTanstackRouter,
} from "@tanstack/react-router";
// import SuperJSON from "superjson";

import { getQueryClient } from "./lib/get-query-client";
import { routeTree } from "./routeTree.gen";

export type RouterMode = "memory" | "browser" | "hash";
export function createAppRouter(mode: RouterMode = "memory") {
  switch (mode) {
    // case "memory":
    //   return createMemoryHistory();
    // case "browser":
    //   return createBrowserHistory();
    default:
      // return createMemoryHistory();
      // return createBrowserHistory();
      return createHashHistory();
  }
}
const queryClient = getQueryClient();
export function createRouter() {
  const router = createTanstackRouter({
    routeTree,
    defaultPreload: "intent",
    defaultStaleTime: 5000,
    context: {
      tid: "",
      queryClient: queryClient,
    },
    // transformer: SuperJSON,
    history: createAppRouter("memory"),
  });
  return router;
}
