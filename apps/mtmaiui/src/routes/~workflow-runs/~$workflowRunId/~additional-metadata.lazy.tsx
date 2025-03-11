import { createLazyFileRoute } from "@tanstack/react-router";
import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";
import { useWorkflowRunShape } from "../../../hooks/useWorkflowRun";

export const Route = createLazyFileRoute(
  "/workflow-runs/$workflowRunId/additional-metadata",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowRunId } = Route.useParams();
  const { shape } = useWorkflowRunShape(workflowRunId);

  return (
    <>
      <CodeHighlighter
        className="my-1"
        language="json"
        code={JSON.stringify(shape.data?.additionalMetadata, null, 2)}
      />
    </>
  );
}
