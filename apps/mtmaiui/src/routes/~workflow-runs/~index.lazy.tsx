"use client";
import {
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { XCircleIcon } from "lucide-react";
import {
  type ReplayWorkflowRunsRequest,
  WorkflowRunOrderByDirection,
  WorkflowRunOrderByField,
  WorkflowRunStatus,
  tenantGetStepRunQueueMetricsOptions,
  workflowListOptions,
  workflowRunCancelMutation,
  workflowRunGetMetricsOptions,
  workflowRunListOptions,
} from "mtmaiapi";
import { MtSuspenseBoundary } from "mtxuilib/components/MtSuspenseBoundary";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { DateTimePicker } from "mtxuilib/components/time-picker/date-time-picker";
import { DataTable } from "mtxuilib/data-table/data-table";
import {
  type FilterOption,
  type ToolbarFilters,
  ToolbarType,
} from "mtxuilib/data-table/data-table-toolbar";
import { cn, getCreatedAfterFromTimeRange } from "mtxuilib/lib/utils";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { CodeHighlighter } from "mtxuilib/mt/code-highlighter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "mtxuilib/ui/breadcrumb";
import { Button, buttonVariants } from "mtxuilib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "mtxuilib/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "mtxuilib/ui/select";
import { Separator } from "mtxuilib/ui/separator";
import { Skeleton } from "mtxuilib/ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import { DashHeaders } from "../../components/DashHeaders";
import { useTenant, useTenantId } from "../../hooks/useAuth";
import { useNav } from "../../hooks/useNav";
import { useMtmaiV2 } from "../../stores/StoreProvider";
import type { AdditionalMetadataClick } from "../~events/additional-metadata";
import { WorkflowRunsSideBarItem } from "./components/WorkflowRunsSideBarItem";
import { workflowRunsColumns } from "./components/workflow-runs-columns";
import { WorkflowRunsMetricsView } from "./components/workflow-runs-metrics";

export const Route = createLazyFileRoute("/workflow-runs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const tenant = useTenant();

  const tid = useTenantId();
  const {
    createdAfter,
    initColumnVisibility,
    showMetrics = true,
    viewType = "table",
    workflowId,
    parentWorkflowRunId,
    parentStepRunId,
    refetchInterval = 5000,
    filterVisibility = {},
    timeRangeParam,
    sort = "",
    filters = "[]",
    metadataFilter = ["hello123:345"],
    some1 = "some1",
    pageIndex = 0,
    pageSize = 50,
    backTo = "/workflow-runs",
  } = Route.useSearch();

  const nav = useNav();
  const search = Route.useSearch();

  // const createdAfterProp = search.get("createdAfter");
  // const initColumnVisibility = search.get("initColumnVisibility");
  // const showMetrics = search.get("showMetrics") || true;
  // const viewType = search.get("viewType") || "table";
  // const workflowId = search.get("workflowId");
  // const parentWorkflowRunId = search.get("parentWorkflowRunId");
  // const parentStepRunId = search.get("parentStepRunId");
  // const refetchInterval = search.get("refetchInterval") || 5000;
  // const filterVisibility = search.get("filterVisibility") || {};
  const [viewQueueMetrics, setViewQueueMetrics] = useState(false);
  const defaultTimeRange = useMtmaiV2((x) => x.lastTimeRange);
  const setDefaultTimeRange = useMtmaiV2((x) => x.setLastTimeRange);

  const [customTimeRange, setCustomTimeRange] = useState<string[] | undefined>(
    () => {
      // const timeRangeParam = search.get("customTimeRange");
      if (timeRangeParam) {
        return timeRangeParam?.split(",").map((param) => {
          return new Date(param).toISOString();
        });
      }
      return undefined;
    },
  );

  // const [createdAfter, setCreatedAfter] = useState<string | undefined>(
  //   createdAfterProp ||
  //     getCreatedAfterFromTimeRange(defaultTimeRange) ||
  //     new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  // );

  const [finishedBefore, setFinishedBefore] = useState<string | undefined>();

  // create a timer which updates the createdAfter date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (customTimeRange) {
        return;
      }

      // setCreatedAfter(
      //   getCreatedAfterFromTimeRange(defaultTimeRange) ||
      //     new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      // );
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [defaultTimeRange, customTimeRange]);

  // whenever the time range changes, update the createdAfter date
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (customTimeRange && customTimeRange.length === 2) {
      // setCreatedAfter(customTimeRange[0]);
      // setFinishedBefore(customTimeRange[1]);
    } else if (defaultTimeRange) {
      // setCreatedAfter(getCreatedAfterFromTimeRange(defaultTimeRange));
      setFinishedBefore(undefined);
    }
  }, [defaultTimeRange, customTimeRange]);

  const [sorting, setSorting] = useState<SortingState>(() => {
    if (sort) {
      return sort.split(",").map((param) => {
        const [id, desc] = param.split(":");
        return { id, desc: desc === "desc" };
      });
    }
    return [];
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    // const filtersParam = search.get("filters");
    if (filters) {
      return JSON.parse(filters);
    }
    return [];
  });

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initColumnVisibility);

  const [pagination, setPagination] = useState<PaginationState>(() => {
    // const pageIndex = Number(search.get("pageIndex")) || 0;
    // const pageSize = Number(search.get("pageSize")) || 50;
    return { pageIndex, pageSize };
  });

  // useEffect(() => {
  //   // const newSearchParams = new URLSearchParams(searchParams);
  //   if (sorting.length) {
  //     search.set(
  //       "orderDirection",
  //       sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
  //     );
  //   } else {
  //     search.delete("orderDirection");
  //   }
  //   if (columnFilters.length) {
  //     search.set("filters", JSON.stringify(columnFilters));
  //   } else {
  //     search.delete("filters");
  //   }
  //   search.set("pageIndex", pagination.pageIndex.toString());
  //   search.set("pageSize", pagination.pageSize.toString());

  //   if (customTimeRange && customTimeRange.length === 2) {
  //     search.set("customTimeRange", customTimeRange?.join(","));
  //   } else {
  //     search.delete("customTimeRange");
  //   }

  //   // if (search.toString() !== searchParams.toString()) {
  //   //   router.setSearchParams(newSearchParams);
  //   // }
  // }, [
  //   sorting,
  //   columnFilters,
  //   pagination,
  //   customTimeRange,
  //   // router.setSearchParams,
  //   // searchParams,
  // ]);

  // const [pageSize, setPageSize] = useState<number>(50);

  const offset = useMemo(() => {
    if (!pagination) {
      return;
    }

    return pagination.pageIndex * pagination.pageSize;
  }, [pagination]);

  const workflow = useMemo<string | undefined>(() => {
    if (workflowId) {
      return workflowId;
    }

    const filter = columnFilters.find((filter) => filter.id === "Workflow");

    if (!filter) {
      return;
    }

    const vals = filter?.value as Array<string>;
    return vals[0];
  }, [columnFilters, workflowId]);

  const statuses = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "status");

    if (!filter) {
      return;
    }

    return filter?.value as Array<WorkflowRunStatus>;
  }, [columnFilters]);

  const AdditionalMetadataFilter = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === "Metadata");

    if (!filter) {
      return;
    }

    return filter?.value as Array<string>;
  }, [columnFilters]);

  const orderByDirection = useMemo(():
    | WorkflowRunOrderByDirection
    | undefined => {
    if (!sorting.length) {
      return;
    }

    return sorting[0]?.desc
      ? WorkflowRunOrderByDirection.DESC
      : WorkflowRunOrderByDirection.ASC;
  }, [sorting]);

  const orderByField = useMemo((): WorkflowRunOrderByField | undefined => {
    if (!sorting.length) {
      return;
    }

    switch (sorting[0]?.id) {
      case "Duration":
        return WorkflowRunOrderByField.DURATION;
      case "Finished at":
        return WorkflowRunOrderByField.FINISHED_AT;
      case "Started at":
        return WorkflowRunOrderByField.STARTED_AT;
      case "Seen at":
        return WorkflowRunOrderByField.CREATED_AT;
      default:
        return WorkflowRunOrderByField.CREATED_AT;
    }
  }, [sorting]);

  const listWorkflowRunsQuery = useQuery({
    ...workflowRunListOptions({
      path: {
        tenant: tid,
      },
      query: {
        offset,
        limit: pageSize,
        statuses,
        workflowId: workflow,
        parentWorkflowRunId,
        parentStepRunId,
        orderByDirection,
        orderByField,
        additionalMetadata: AdditionalMetadataFilter,
        createdAfter,
        finishedBefore,
      },
    }),
    placeholderData: (prev) => prev,
    refetchInterval,
  });

  const metricsQuery = useQuery({
    ...workflowRunGetMetricsOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
      query: {
        workflowId: workflow,
        parentWorkflowRunId,
        parentStepRunId,
        additionalMetadata: AdditionalMetadataFilter,
        createdAfter,
      },
    }),
    refetchInterval,
    placeholderData: (prev) => prev,
  });

  const tenantMetricsQuery = useQuery({
    ...tenantGetStepRunQueueMetricsOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
    refetchInterval,
    placeholderData: (prev) => prev,
  });
  const {
    data: workflowKeys,
    isLoading: workflowKeysIsLoading,
    error: workflowKeysError,
  } = useQuery({
    ...workflowListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedRuns = useMemo(() => {
    return Object.entries(rowSelection)
      .filter(([, selected]) => !!selected)
      ?.map(([id]) => (listWorkflowRunsQuery.data?.rows || [])[Number(id)]);
  }, [listWorkflowRunsQuery.data?.rows, rowSelection]);

  // const tid = useTenantId();
  const cancelWorkflowRunMutation = useMutation({
    ...workflowRunCancelMutation(),
  });

  const replayWorkflowRunsMutation = useMutation({
    mutationKey: ["workflow-run:update:replay", tid],
    mutationFn: async (data: ReplayWorkflowRunsRequest) => {
      // await api.workflowRunUpdateReplay(tenant.metadata.id, data);
    },
    onSuccess: () => {
      setRowSelection({});

      // bit hacky, but workflow run statuses aren't updated immediately after replay
      setTimeout(() => {
        listWorkflowRunsQuery.refetch();
      }, 1000);
    },
    // onError: handleApiError,
  });

  const workflowKeyFilters = useMemo((): FilterOption[] => {
    return (
      workflowKeys?.rows?.map((key) => ({
        value: key.metadata.id,
        label: key.name,
      })) || []
    );
  }, [workflowKeys]);

  const workflowRunStatusFilters = useMemo((): FilterOption[] => {
    return [
      {
        value: WorkflowRunStatus.SUCCEEDED,
        label: "Succeeded",
      },
      {
        value: WorkflowRunStatus.FAILED,
        label: "Failed",
      },
      {
        value: WorkflowRunStatus.RUNNING,
        label: "Running",
      },
      {
        value: WorkflowRunStatus.QUEUED,
        label: "Queued",
      },
      {
        value: WorkflowRunStatus.PENDING,
        label: "Pending",
      },
    ];
  }, []);

  const toolbarFilters: ToolbarFilters = [
    // {
    //   columnId: "Workflow",
    //   title: "Workflow",
    //   options: workflowKeyFilters,
    //   type: ToolbarType.Radio,
    // },
    // {
    //   columnId: "status",
    //   title: "Status",
    //   options: workflowRunStatusFilters,
    // },
    {
      columnId: "Metadata",
      title: "Metadata",
      type: ToolbarType.KeyValue,
    },
  ].filter((filter) => filterVisibility[filter.columnId] !== false);

  const [rotate, setRotate] = useState(false);

  const refetch = () => {
    listWorkflowRunsQuery.refetch();
    tenantMetricsQuery.refetch();
    metricsQuery.refetch();
  };

  const actions = [
    <Button
      disabled={!Object.values(rowSelection).some((selected) => !!selected)}
      key="cancel"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        cancelWorkflowRunMutation.mutate({
          path: {
            tenant: tid,
          },
          body: {
            workflowRunIds: selectedRuns?.map((run) => run.metadata.id),
          },
        });
      }}
      variant={"outline"}
      aria-label="Cancel Selected Runs"
    >
      <XMarkIcon className={"mr-2 h-4 w-4 transition-transform"} />
      取消
    </Button>,
    <Button
      disabled={!Object.values(rowSelection).some((selected) => !!selected)}
      key="replay"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        replayWorkflowRunsMutation.mutate({
          workflowRunIds: selectedRuns?.map((run) => run.metadata.id),
        });
      }}
      variant={"outline"}
      aria-label="Replay Selected Runs"
    >
      <ArrowPathRoundedSquareIcon className="mr-2 h-4 w-4 transition-transform" />
      重试
    </Button>,
    <Button
      key="refresh"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        refetch();
        setRotate(!rotate);
      }}
      variant={"outline"}
      aria-label="Refresh events list"
    >
      <ArrowPathIcon
        className={`h-4 w-4 transition-transform ${rotate ? "rotate-180" : ""}`}
      />
    </Button>,
  ];

  const isLoading =
    listWorkflowRunsQuery.isFetching ||
    workflowKeysIsLoading ||
    metricsQuery.isLoading;

  const onAdditionalMetadataClick = ({
    key,
    value,
  }: AdditionalMetadataClick) => {
    setColumnFilters((prev) => {
      let newFilters = prev;
      const metadataFilter = prev.find((filter) => filter.id === "Metadata");
      if (metadataFilter) {
        newFilters = prev.filter((filter) => filter.id !== "Metadata");
      }
      return [
        ...newFilters,
        {
          id: "Metadata",
          value: [`${key}:${value}`],
        },
      ];
    });
  };

  return (
    <MtSuspenseBoundary>
      <DashHeaders>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <CustomLink
                to={backTo}
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                返回
              </CustomLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>运行记录</BreadcrumbPage>
            </BreadcrumbItem>
            <DebugValue data={{ search }} />
          </BreadcrumbList>
        </Breadcrumb>
      </DashHeaders>

      {/* <Button
        onClick={() => {
          nav({
            to: ".",
            search: {
              ...search,
              some1: "set2",
            },
          });
        }}
      >
        set1
      </Button> */}
      {/* <WorkflowRunsTable tenant={tenant!} showMetrics={true} /> */}
      {viewType === "table" && (
        <>
          {showMetrics && (
            <Dialog
              open={viewQueueMetrics}
              onOpenChange={(open) => {
                if (!open) {
                  setViewQueueMetrics(false);
                }
              }}
            >
              <DialogContent className="w-fit max-w-[80%] min-w-[500px]">
                <DialogTitle>队列指标</DialogTitle>
                <DialogHeader>
                  <DialogTitle>Queue Metrics</DialogTitle>
                </DialogHeader>
                <Separator />
                {tenantMetricsQuery.data?.queues && (
                  <CodeHighlighter
                    language="json"
                    code={JSON.stringify(
                      tenantMetricsQuery.data?.queues || "{}",
                      null,
                      2,
                    )}
                  />
                )}
                {tenantMetricsQuery.isLoading && (
                  <Skeleton className="w-full h-36" />
                )}
              </DialogContent>
            </Dialog>
          )}
          {!createdAfter && (
            <div className="flex flex-row justify-end items-center gap-2">
              {customTimeRange && [
                <Button
                  key="clear"
                  onClick={() => {
                    setCustomTimeRange(undefined);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs h-9 py-2"
                >
                  <XCircleIcon className="h-[18px] w-[18px] mr-2" />
                  清除
                </Button>,
                <DateTimePicker
                  key="after"
                  label="After"
                  date={createdAfter ? new Date(createdAfter) : undefined}
                  setDate={(date) => {
                    // setCreatedAfter(date?.toISOString());
                  }}
                />,
                <DateTimePicker
                  key="before"
                  label="Before"
                  date={finishedBefore ? new Date(finishedBefore) : undefined}
                  setDate={(date) => {
                    setFinishedBefore(date?.toISOString());
                  }}
                />,
              ]}
              <Select
                value={customTimeRange ? "custom" : defaultTimeRange}
                onValueChange={(value) => {
                  if (value !== "custom") {
                    setDefaultTimeRange(value);
                    setCustomTimeRange(undefined);
                  } else {
                    setCustomTimeRange([
                      getCreatedAfterFromTimeRange(value) ||
                        new Date(
                          Date.now() - 24 * 60 * 60 * 1000,
                        ).toISOString(),
                      new Date().toISOString(),
                    ]);
                  }
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue id="timerange" placeholder="Choose time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="6h">6 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-row justify-between items-center my-4">
            {metricsQuery.data ? (
              <WorkflowRunsMetricsView
                metrics={metricsQuery.data}
                onViewQueueMetricsClick={() => {
                  setViewQueueMetrics(true);
                }}
                showQueueMetrics={showMetrics}
                onClick={(status) => {
                  setColumnFilters((prev) => {
                    let newFilters = prev;
                    const statusFilter = prev.find(
                      (filter) => filter.id === "status",
                    );
                    if (statusFilter) {
                      newFilters = prev.filter(
                        (filter) => filter.id !== "status",
                      );
                    }

                    if (
                      JSON.stringify(statusFilter?.value) ===
                      JSON.stringify([status])
                    ) {
                      return newFilters;
                    }

                    return [
                      ...newFilters,
                      {
                        id: "status",
                        value: [status],
                      },
                    ];
                  });
                }}
              />
            ) : (
              <Skeleton className="max-w-[800px] w-[40vw] h-8" />
            )}
          </div>
          <DataTable
            emptyState={<>No workflow runs found with the given filters.</>}
            error={workflowKeysError}
            isLoading={isLoading}
            columns={workflowRunsColumns(onAdditionalMetadataClick)}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            data={listWorkflowRunsQuery.data?.rows || []}
            filters={toolbarFilters}
            actions={actions}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            pagination={pagination}
            setPagination={setPagination}
            // onSetPageSize={setPageSize}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            pageCount={listWorkflowRunsQuery.data?.pagination?.num_pages || 0}
            showColumnToggle={true}
          />
        </>
      )}

      {viewType === "sidebar" && (
        <div className="flex flex-col gap-2">
          {listWorkflowRunsQuery.data?.rows?.map((workflowRun) => (
            <WorkflowRunsSideBarItem
              key={workflowRun.metadata.id}
              workflowRun={workflowRun}
            />
          ))}
        </div>
      )}
    </MtSuspenseBoundary>
  );
}
