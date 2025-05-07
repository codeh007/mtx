import { createLazyFileRoute } from "@tanstack/react-router";
import { ExampleCode } from "./ExampleCode";

export const Route = createLazyFileRoute("/bundler/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ExampleCode />
    </div>
  );
}
