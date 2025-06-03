import { HelloWebviewContent } from "@mtmaiui/components/webview/HelloWebviewContent";
import { createLazyFileRoute } from "@tanstack/react-router";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";

export const Route = createLazyFileRoute("/webview/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <MtSuspenseBoundary>
        <HelloWebviewContent />
      </MtSuspenseBoundary>
    </>
  );
}
