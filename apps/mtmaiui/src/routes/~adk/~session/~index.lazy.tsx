import { createLazyFileRoute } from "@tanstack/react-router";
import { generateUUID } from "mtxuilib/lib/utils";
import { useEffect } from "react";
import { useNav } from "../../../hooks/useNav";

export const Route = createLazyFileRoute("/adk/session/")({
  component: RouteComponent,
});

function RouteComponent() {
  const nav = useNav();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    nav({
      to: `/adk/session/${generateUUID()}`,
    });
  }, []);
  return (
    <>
      <div> createting new session...</div>
    </>
  );
}
