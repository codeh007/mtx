"use client";

import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/workflows/$workflowId")({
  component: ExpandedWorkflow,
});

export default function ExpandedWorkflow() {
  return (
    <>
      <Outlet />
    </>
  );
}
