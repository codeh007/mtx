import { createFileRoute } from "@tanstack/react-router";
export * from "./posts/index.lazy";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return null;
}
