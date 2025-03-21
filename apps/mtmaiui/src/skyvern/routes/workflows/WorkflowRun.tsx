"use client";
import {
  CopyIcon,
  Pencil2Icon,
  PlayIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import fetchToCurl from "fetch-to-curl";
import {
  basicTimeFormat,
  cn,
  copyText,
  timeFormatWithShortDate,
} from "mtxuilib/lib/utils";

import { useMtRouter } from "mtxuilib/hooks/use-router";
import { Button } from "mtxuilib/ui/button";
import { Input } from "mtxuilib/ui/input";
import { Label } from "mtxuilib/ui/label";
import { Skeleton } from "mtxuilib/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "mtxuilib/ui/table";
import { toast } from "mtxuilib/ui/use-toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBasePath } from "../../../hooks/useBasePath";
import { Status } from "../../api/types";
import { StatusBadge } from "../../components/StatusBadge";
import { ZoomableImage } from "../../components/ZoomableImage";
import { TaskActions } from "../tasks/list/TaskActions";
import { TaskListSkeletonRows } from "../tasks/list/TaskListSkeletonRows";
import { statusIsNotFinalized, statusIsRunningOrQueued } from "../tasks/types";
import { CodeEditor } from "./components/CodeEditor";
import { useWorkflowQuery } from "./hooks/useWorkflowQuery";

type StreamMessage = {
  task_id: string;
  status: string;
  screenshot?: string;
};

let socket: WebSocket | null = null;

interface WorkflowRunProps {
  workflowPermanentId: string;
  workflowRunId: string;
}
export function WorkflowRun(props: WorkflowRunProps) {
  const { workflowPermanentId, workflowRunId } = props;
  const searchParams = useSearchParams();
  const search = useSearchParams();
  const searchParamsObject = Object.fromEntries(searchParams.entries());
  const page = search.get("page") ? Number(search.get("page")) : 1;

  const [streamImgSrc, setStreamImgSrc] = useState<string>("");
  const router = useMtRouter();
  const basePath = useBasePath();
  // const apiCredential = useApiCredential();
  //
  const { data: workflow, isLoading: workflowIsLoading } = useWorkflowQuery({
    workflowPermanentId,
  });

  const { data: workflowRun, isLoading: workflowRunIsLoading } = useQuery({
    // queryKey: ["workflowRun", workflowPermanentId, workflowRunId],
    // queryFn: async () => {
    //   // const client = await getClient(credentialGetter);
    //   return client
    //     .get(`/workflows/${workflowPermanentId}/runs/${workflowRunId}`)
    //     .then((response) => response.data);
    // },
    ...getWorkflowRunsOptions({
      path: {
        workflow_id: workflowPermanentId,
        workflow_run_id: workflowRunId,
      },
    }),
    refetchInterval: (query) => {
      if (!query.state.data) {
        return false;
      }
      if (statusIsNotFinalized(query.state.data)) {
        return 5000;
      }
      return false;
    },
    placeholderData: keepPreviousData,
    refetchOnMount: (query) => {
      if (!query.state.data) {
        return false;
      }
      return statusIsRunningOrQueued(query.state.data);
    },
    refetchOnWindowFocus: (query) => {
      if (!query.state.data) {
        return false;
      }
      return statusIsRunningOrQueued(query.state.data);
    },
  });

  const searchp = useSearchParams();
  const { data: workflowTasks, isLoading: workflowTasksIsLoading } = useQuery({
    // queryKey: ["workflowTasks", workflowRunId, page],
    // queryFn: async () => {
    //   const client = await getClient(credentialGetter);
    //   const params = new URLSearchParams();
    //   params.append("page", String(page));
    //   return client
    //     .get(`/tasks?workflow_run_id=${workflowRunId}`, { params })
    //     .then((response) => response.data);
    // },
    ...agentGetAgentTasksOptions({
      query: {
        workflow_run_id: workflowRunId,
        page: page,
        ...Object.fromEntries(searchp.entries()),
      },
    }),
    refetchInterval: () => {
      if (workflowRun?.status === Status.Running) {
        return 5000;
      }
      return false;
    },
    placeholderData: keepPreviousData,
    refetchOnMount: workflowRun?.status === Status.Running,
    refetchOnWindowFocus: workflowRun?.status === Status.Running,
  });

  const currentRunningTask = workflowTasks?.find(
    (task) => task.status === Status.Running,
  );

  const workflowRunIsRunningOrQueued =
    workflowRun && statusIsRunningOrQueued(workflowRun);

  useEffect(() => {
    if (!workflowRunIsRunningOrQueued) {
      return;
    }

    async function run() {
      // Create WebSocket connection.
      let credential = null;
      if (credentialGetter) {
        const token = await credentialGetter();
        credential = `?token=Bearer ${token}`;
      } else {
        credential = `?apikey=${envCredential}`;
      }
      if (socket) {
        socket.close();
      }
      socket = new WebSocket(
        `${wssBaseUrl}/stream/workflow_runs/${workflowRunId}${credential}`,
      );
      // Listen for messages
      socket.addEventListener("message", (event) => {
        try {
          const message: StreamMessage = JSON.parse(event.data);
          if (message.screenshot) {
            setStreamImgSrc(message.screenshot);
          }
          if (
            message.status === "completed" ||
            message.status === "failed" ||
            message.status === "terminated"
          ) {
            socket?.close();
            if (
              message.status === "failed" ||
              message.status === "terminated"
            ) {
              toast({
                title: "Run Failed",
                description: "The workflow run has failed.",
                variant: "destructive",
              });
            } else if (message.status === "completed") {
              toast({
                title: "Run Completed",
                description: "The workflow run has been completed.",
                variant: "success",
              });
            }
          }
        } catch (e) {
          console.error("Failed to parse message", e);
        }
      });

      socket.addEventListener("close", () => {
        socket = null;
      });
    }
    run();

    return () => {
      if (socket) {
        socket.close();
        socket = null;
      }
    };
  }, [workflowRunId, workflowRunIsRunningOrQueued]);

  function getStream() {
    if (workflowRun?.status === Status.Created) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 rounded-md bg-slate-900 py-8 text-lg">
          <span>Workflow has been created.</span>
          <span>Stream will start when the workflow is running.</span>
        </div>
      );
    }
    if (workflowRun?.status === Status.Queued) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 rounded-md bg-slate-900 py-8 text-lg">
          <span>Your workflow run is queued.</span>
          <span>Stream will start when the workflow is running.</span>
        </div>
      );
    }

    if (workflowRun?.status === Status.Running && streamImgSrc.length === 0) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-900 py-8 text-lg">
          Starting the stream...
        </div>
      );
    }

    if (workflowRun?.status === Status.Running && streamImgSrc.length > 0) {
      return (
        <div className="h-full w-full">
          <ZoomableImage
            src={`data:image/png;base64,${streamImgSrc}`}
            className="rounded-md"
          />
        </div>
      );
    }
    return null;
  }

  function handleNavigate(event: React.MouseEvent, id: string) {
    if (event.ctrlKey || event.metaKey) {
      window.open(
        `${window.location.origin}/tasks/${id}/actions`,
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      router.push(`${basePath}/tasks/${id}/actions`);
    }
  }

  const parameters = workflowRun?.parameters ?? {};

  return (
    <div className="space-y-8">
      <header className="flex justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-5">
            <h1 className="text-3xl">{workflowRunId}</h1>
            {workflowRunIsLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : workflowRun ? (
              <StatusBadge status={workflowRun?.status} />
            ) : null}
          </div>
          <h2 className="text-2xl text-slate-400">
            {workflowIsLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              workflow?.title
            )}
          </h2>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              if (!workflowRun) {
                return;
              }
              const curl = fetchToCurl({
                method: "POST",
                url: `${apiBaseUrl}/workflows/${workflowPermanentId}/run`,
                body: {
                  data: workflowRun?.parameters,
                  proxy_location: "RESIDENTIAL",
                },
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": apiCredential ?? "<your-api-key>",
                },
              });
              copyText(curl).then(() => {
                toast({
                  variant: "success",
                  title: "Copied to Clipboard",
                  description:
                    "The cURL command has been copied to your clipboard.",
                });
              });
            }}
          >
            <CopyIcon className="mr-2 h-4 w-4" />
            cURL
          </Button>
          <Button asChild variant="secondary">
            <Link href={`${basePath}/workflows/${workflowPermanentId}/edit`}>
              <Pencil2Icon className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={`${basePath}/workflows/${workflowPermanentId}/run`}
              state={{
                data: parameters,
              }}
            >
              <PlayIcon className="mr-2 h-4 w-4" />
              Rerun
            </Link>
          </Button>
        </div>
      </header>
      {workflowRun && statusIsNotFinalized(workflowRun) && (
        <div className="flex gap-5">
          <div className="w-3/4 shrink-0">
            <AspectRatio ratio={16 / 9}>{getStream()}</AspectRatio>
          </div>
          <div className="flex w-full flex-col gap-4 rounded-md bg-slate-elevation1 p-4">
            <header className="text-lg">Current Task</header>
            {workflowRunIsLoading || !currentRunningTask ? (
              <div>Waiting for a task to start...</div>
            ) : (
              <div className="flex h-full flex-col gap-2">
                <div className="flex gap-2 bg-slate-elevation2 p-2">
                  <Label className="text-sm text-slate-400">ID</Label>
                  <span className="text-sm">{currentRunningTask.task_id}</span>
                </div>
                <div className="flex gap-2 bg-slate-elevation2 p-2">
                  <Label className="text-sm text-slate-400">URL</Label>
                  <span className="text-sm">
                    {currentRunningTask.request.url}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-elevation2 p-2">
                  <Label className="text-sm text-slate-400">Status</Label>
                  <span className="text-sm">
                    <StatusBadge status={currentRunningTask.status} />
                  </span>
                </div>
                <div className="flex gap-2 bg-slate-elevation2 p-2">
                  <Label className="text-sm text-slate-400">Created</Label>
                  <span className="text-sm">
                    {currentRunningTask &&
                      timeFormatWithShortDate(currentRunningTask.created_at)}
                  </span>
                </div>
                <div className="mt-auto flex justify-end">
                  <Button asChild>
                    <Link href={`/tasks/${currentRunningTask.task_id}/actions`}>
                      <ReaderIcon className="mr-2 h-4 w-4" />
                      View Actions
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="space-y-5">
        <header>
          <h2 className="text-2xl">
            {workflowRunIsRunningOrQueued ? "Previous Blocks" : "Blocks"}
          </h2>
        </header>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="rounded-t-md bg-slate-elevation1">
              <TableRow>
                <TableHead className="w-1/4 rounded-tl-md text-slate-400">
                  ID
                </TableHead>
                <TableHead className="w-1/4 text-slate-400">URL</TableHead>
                <TableHead className="w-1/6 text-slate-400">Status</TableHead>
                <TableHead className="w-1/4 text-slate-400">
                  Created At
                </TableHead>
                <TableHead className="w-1/12 rounded-tr-md" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflowTasksIsLoading ? (
                <TaskListSkeletonRows />
              ) : workflowTasks?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No tasks</TableCell>
                </TableRow>
              ) : (
                workflowTasks
                  ?.filter(
                    (task) => task.task_id !== currentRunningTask?.task_id,
                  )
                  .map((task) => {
                    return (
                      <TableRow key={task.task_id}>
                        <TableCell
                          className="w-1/4 cursor-pointer"
                          onClick={(event) =>
                            handleNavigate(event, task.task_id)
                          }
                        >
                          {task.task_id}
                        </TableCell>
                        <TableCell
                          className="w-1/4 max-w-64 cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap"
                          onClick={(event) =>
                            handleNavigate(event, task.task_id)
                          }
                        >
                          {task.request.url}
                        </TableCell>
                        <TableCell
                          className="w-1/6 cursor-pointer"
                          onClick={(event) =>
                            handleNavigate(event, task.task_id)
                          }
                        >
                          <StatusBadge status={task.status} />
                        </TableCell>
                        <TableCell
                          className="w-1/4 cursor-pointer"
                          onClick={(event) =>
                            handleNavigate(event, task.task_id)
                          }
                        >
                          {basicTimeFormat(task.created_at)}
                        </TableCell>
                        <TableCell className="w-1/12">
                          <TaskActions task={task} />
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
          <Pagination className="pt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={cn({ "cursor-not-allowed": page === 1 })}
                  onClick={() => {
                    if (page === 1) {
                      return;
                    }
                    const params = new URLSearchParams();
                    params.set("page", String(Math.max(1, page - 1)));
                    setSearchParams(params, { replace: true });
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("page", String(page + 1));
                    setSearchParams(params, { replace: true });
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      {Object.entries(parameters).length > 0 && (
        <div className="space-y-4">
          <header>
            <h2 className="text-lg font-semibold">Parameters</h2>
          </header>
          {Object.entries(parameters).map(([key, value]) => {
            return (
              <div key={key} className="flex flex-col gap-2">
                <Label>{key}</Label>
                {typeof value === "string" ? (
                  <Input value={value} readOnly />
                ) : (
                  <CodeEditor
                    value={JSON.stringify(value, null, 2)}
                    readOnly
                    language="json"
                    minHeight="96px"
                    maxHeight="500px"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
