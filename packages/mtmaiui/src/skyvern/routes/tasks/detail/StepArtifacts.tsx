"use  client";
import { useQuery } from "@tanstack/react-query";
import { basicTimeFormat } from "mtxuilib/lib/utils";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "mtxuilib/ui/tabs";
import { useSearchParams } from "next/navigation";
import {
  type ArtifactApiResponse,
  ArtifactType,
  type StepApiResponse,
} from "../../../api/types";
import { StatusBadge } from "../../../components/StatusBadge";
import { ZoomableImage } from "../../../components/ZoomableImage";
import { Artifact } from "./Artifact";
import { useArtifactImageURL } from "./artifactUtils";

type Props = {
  id: string;
  stepProps: StepApiResponse;
  taskId: string;
};

export function StepArtifacts({ id, stepProps, taskId }: Props) {
  const searchParams = useSearchParams();
  const artifact = searchParams.get("artifact") ?? "info";
  const {
    data: artifacts,
    isFetching,
    isError,
    error,
  } = useQuery({
    // queryKey: ["task", taskId, "steps", id, "artifacts"],
    // queryFn: async () => {
    //   const client = await getClient(credentialGetter);
    //   return client
    //     .get(`/tasks/${taskId}/steps/${id}/artifacts`)
    //     .then((response) => response.data);
    // },
    // ...agentGetAgentTaskStepArtifactsOptions({
    //   path: {
    //     task_id: taskId,
    //     step_id: id,
    //   },
    // }),
  });

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  const llmScreenshots = artifacts?.filter(
    (artifact) => artifact.artifact_type === ArtifactType.LLMScreenshot,
  );

  const actionScreenshots = artifacts?.filter(
    (artifact) => artifact.artifact_type === ArtifactType.ActionScreenshot,
  );

  const visibleElementsTree = artifacts?.filter(
    (artifact) => artifact.artifact_type === ArtifactType.VisibleElementsTree,
  );

  const llmRequest = artifacts?.filter(
    (artifact) => artifact.artifact_type === ArtifactType.LLMRequest,
  );

  const visibleElementsTreeInPrompt = artifacts?.filter(
    (artifact) =>
      artifact.artifact_type === ArtifactType.VisibleElementsTreeInPrompt,
  );

  const llmPrompt = artifacts?.filter(
    (artifact) => artifact.artifact_type === ArtifactType.LLMPrompt,
  );

  const llmResponseParsed = artifacts?.filter(
    (artifact) => artifact.artifact_type === ArtifactType.LLMResponseParsed,
  );

  const htmlRaw = artifacts?.filter(
    (artifact) => artifact.artifact_type === ArtifactType.HTMLScrape,
  );

  return (
    <Tabs
      value={artifact}
      onValueChange={(value) => {
        setSearchParams(
          (params) => {
            const newParams = new URLSearchParams(params);
            newParams.set("artifact", value);
            return newParams;
          },
          {
            replace: true,
          },
        );
      }}
      className="w-full"
    >
      <TabsList className="grid h-16 w-full grid-cols-5">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="screenshot_llm">Annotated Screenshots</TabsTrigger>
        <TabsTrigger value="screenshot_action">Action Screenshots</TabsTrigger>
        <TabsTrigger value="element_tree_trimmed">
          HTML Element Tree
        </TabsTrigger>
        <TabsTrigger value="element_tree">Element Tree</TabsTrigger>
        <TabsTrigger value="llm_prompt">Prompt</TabsTrigger>
        <TabsTrigger value="llm_response_parsed">Action List</TabsTrigger>
        <TabsTrigger value="html_raw">HTML (Raw)</TabsTrigger>
        <TabsTrigger value="llm_request">LLM Request (Raw)</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <div className="flex flex-col gap-6 p-4">
          <div className="flex items-center">
            <Label className="w-32 shrink-0">Step ID</Label>
            {isFetching ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <Input value={stepProps?.step_id} readOnly />
            )}
          </div>
          <div className="flex items-center">
            <Label className="w-32 shrink-0">Status</Label>
            {isFetching ? (
              <Skeleton className="h-4 w-40" />
            ) : stepProps ? (
              <StatusBadge status={stepProps.status} />
            ) : null}
          </div>
          <div className="flex items-center">
            <Label className="w-32 shrink-0">Created At</Label>
            {isFetching ? (
              <Skeleton className="h-4 w-40" />
            ) : stepProps ? (
              <Input value={basicTimeFormat(stepProps.created_at)} readOnly />
            ) : null}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="screenshot_llm">
        {llmScreenshots && llmScreenshots.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 p-4">
            {llmScreenshots.map((artifact, index) => (
              <ZoomableImage
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                src={imgUrl}
                className="h-full w-full object-cover"
                alt="action-screenshot"
              />
            ))}
          </div>
        ) : isFetching ? (
          <div className="grid grid-cols-2 gap-4 p-4">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div>No screenshots found</div>
        )}
      </TabsContent>
      <TabsContent value="screenshot_action">
        {actionScreenshots && actionScreenshots?.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 p-4">
            {actionScreenshots.map((artifact, index) => (
              <ArtifaceImage
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                // src={getImageURL(artifact)}
                artifact={artifact}
              />
            ))}
          </div>
        ) : isFetching ? (
          <div className="grid grid-cols-3 gap-4 p-4">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div>No screenshots found</div>
        )}
      </TabsContent>
      <TabsContent value="element_tree_trimmed">
        {visibleElementsTreeInPrompt ? (
          <Artifact type="html" artifacts={visibleElementsTreeInPrompt} />
        ) : null}
      </TabsContent>
      <TabsContent value="element_tree">
        {visibleElementsTree ? (
          <Artifact type="json" artifacts={visibleElementsTree} />
        ) : null}
      </TabsContent>
      <TabsContent value="llm_prompt">
        {llmPrompt ? <Artifact type="text" artifacts={llmPrompt} /> : null}
      </TabsContent>
      <TabsContent value="llm_response_parsed">
        {llmResponseParsed ? (
          <Artifact type="json" artifacts={llmResponseParsed} />
        ) : null}
      </TabsContent>
      <TabsContent value="html_raw">
        {htmlRaw ? <Artifact type="html" artifacts={htmlRaw} /> : null}
      </TabsContent>
      <TabsContent value="llm_request">
        {llmRequest ? <Artifact type="json" artifacts={llmRequest} /> : null}
      </TabsContent>
    </Tabs>
  );
}

interface ArtifaceImageProps {
  artiface: ArtifactApiResponse;
}
const ArtifaceImage = (props: ArtifaceImageProps) => {
  const artifact = props.artiface;
  const imgUrl = useArtifactImageURL(artifact);

  return (
    <>
      <ZoomableImage
        src={imgUrl}
        className="h-full w-full object-cover"
        alt="action-screenshot"
      />
    </>
  );
};