import { AndroidWebviewPanel } from "@mtmaiui/components/webview/AndroidWebviewPanel";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const pathName = window.location.pathname;
  if (!pathName?.startsWith("/dash")) {
    return null;
  }
  return (
    <>
      <AndroidWebviewPanel />
    </>
  );
}
