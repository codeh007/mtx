"use client";

import { ArrowPathIcon, ArrowPathRoundedSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { RootRoute } from "@mtmaiui/routes/~__root";
import { type UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  type ReplayWorkflowRunsRequest,
  type WorkflowList,
  type WorkflowRunsMetrics,
  workflowListOptions,
  workflowRunCancelMutation,
} from "mtmaiapi";
import { Button } from "mtxuilib/ui/button";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type StateCreator, createStore, useStore } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { useTenantId } from "../hooks/useAuth";
import type { AdditionalMetadataClick } from "../routes/~events/additional-metadata";
import { useMtmaiV2 } from "./StoreProvider";

export type ComponentsProps = {};

export interface WorkflowStoreState extends ComponentsProps {
  isPending: boolean;
  viewQueueMetrics: boolean;
  setViewQueueMetrics: (viewQueueMetrics: boolean) => void;
  finishedBefore: string | undefined;
  setFinishedBefore: (finishedBefore: string) => void;
  createdAfter: string | undefined;
  setCreatedAfter: (createdAfter: string) => void;
  metricsQueryData: WorkflowRunsMetrics | undefined;
  setMetricsQueryData: (metricsQueryData) => void;
  tenantStepRunQueueMetrics: WorkflowRunsMetrics | undefined;
  setTenantStepRunQueueMetrics: (tenantStepRunQueueMetrics) => void;
  customTimeRange: string[] | undefined;
  setCustomTimeRange: (customTimeRange: string[]) => void;
  actions: React.ReactNode[];
  setActions: (actions: React.ReactNode[]) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (columnFilters: ColumnFiltersState) => void;
  columnVisibility: VisibilityState;
  setColumnVisibility: (columnVisibility: VisibilityState) => void;
  rowSelection: RowSelectionState;
  setRowSelection: (rowSelection: RowSelectionState) => void;
  rotate: boolean;
  setRotate: (rotate: boolean) => void;
  pageIndex: number;
  setPageIndex: (pageIndex: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  offset: number;
  setOffset: (offset: number) => void;
  onAdditionalMetadataClick: ({ key, value }: AdditionalMetadataClick) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  listWorkflowQuery: UseQueryResult<WorkflowList>;
}

export const createWorkbrenchSlice: StateCreator<WorkflowStoreState, [], [], WorkflowStoreState> = (
  set,
  get,
  init,
) => {
  return {
    isPending: false,
    viewQueueMetrics: false,
    setViewQueueMetrics: (viewQueueMetrics: boolean) => {
      set({ viewQueueMetrics });
    },
    finishedBefore: undefined,
    setFinishedBefore: (finishedBefore: string) => {
      set({ finishedBefore });
    },
    setMetricsQueryData: (metricsQueryData) => {
      set({ metricsQueryData });
    },
    createdAfter: undefined,
    setCreatedAfter: (createdAfter: string) => {
      set({ createdAfter });
    },
    tenantStepRunQueueMetrics: undefined,
    setTenantStepRunQueueMetrics: (tenantStepRunQueueMetrics) => {
      set({ tenantStepRunQueueMetrics });
    },
    ...init,
  };
};

const createWorkflowStore = (initProps?: Partial<WorkflowStoreState>) => {
  return createStore<WorkflowStoreState>()(
    subscribeWithSelector(
      // persist(
      devtools(
        immer((...a) => ({
          ...createWorkbrenchSlice(...a),
          ...initProps,
        })),
        {
          name: "workflow-run-store",
        },
      ),
    ),
  );
};
const workflowStoreContext = createContext<ReturnType<typeof createWorkflowStore> | null>(null);

export const WorkflowsProvider = (props: React.PropsWithChildren<ComponentsProps>) => {
  const { children, ...etc } = props;
  const tid = useTenantId();
  // const [isPending, startTransition] = useTransition();
  const {
    createdAfter,
    initColumnVisibility,
    // showMetrics = true,
    // viewType = "table",
    workflowId,
    parentWorkflowRunId,
    parentStepRunId,
    refetchInterval = 5000,
    filterVisibility = {},
    timeRangeParam,
    sort = "",
    filters = "[]",
    metadataFilter = [],
    pageIndex = 0,
    pageSize = 50,
    // backTo = "/workflow-runs",
  } = RootRoute.useSearch();

  const [customTimeRange, setCustomTimeRange] = useState<string[] | undefined>(() => {
    // const timeRangeParam = search.get("customTimeRange");
    if (timeRangeParam) {
      return timeRangeParam?.split(",").map((param) => {
        return new Date(param).toISOString();
      });
    }
    return undefined;
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [rotate, setRotate] = useState(false);

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
      <ArrowPathIcon className={`h-4 w-4 transition-transform ${rotate ? "rotate-180" : ""}`} />
    </Button>,
  ];

  const defaultTimeRange = useMtmaiV2((x) => x.lastTimeRange);
  // const setDefaultTimeRange = useMtmaiV2((x) => x.setLastTimeRange);

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

  const [pagination, setPagination] = useState<PaginationState>(() => {
    // const pageIndex = Number(search.get("pageIndex")) || 0;
    // const pageSize = Number(search.get("pageSize")) || 50;
    return { pageIndex, pageSize };
  });
  const offset = useMemo(() => {
    if (!pagination) {
      return;
    }

    return pagination.pageIndex * pagination.pageSize;
  }, [pagination]);

  const listWorkflowQuery = useQuery({
    ...workflowListOptions({
      path: {
        tenant: tid,
      },
      query: {
        offset,
        limit: pageSize,
        // statuses,
        // workflowId: workflow,
        // parentWorkflowRunId,
        // parentStepRunId,
        // orderByDirection,
        // orderByField,
        // additionalMetadata: AdditionalMetadataFilter,
        // createdAfter,
        // finishedBefore: mystore.getState().finishedBefore,
      },
    }),
    placeholderData: (prev) => prev,
    refetchInterval,
  });

  const selectedRuns = useMemo(() => {
    return Object.entries(rowSelection)
      .filter(([, selected]) => !!selected)
      ?.map(([id]) => (listWorkflowQuery.data?.rows || [])[Number(id)]);
  }, [listWorkflowQuery.data?.rows, rowSelection]);

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
        listWorkflowQuery.refetch();
      }, 1000);
    },
    // onError: handleApiError,
  });

  const onAdditionalMetadataClick = ({ key, value }: AdditionalMetadataClick) => {
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const mystore = useMemo(
    () =>
      createWorkflowStore({
        ...etc,
        customTimeRange,
        setCustomTimeRange,
        actions,
        onAdditionalMetadataClick,
        listWorkflowQuery: listWorkflowQuery,
      }),
    [listWorkflowQuery],
  );
  return <workflowStoreContext.Provider value={mystore}>{children}</workflowStoreContext.Provider>;
};

const DEFAULT_USE_SHALLOW = false;
export function useWorkflowsStore(): WorkflowStoreState;
export function useWorkflowsStore<T>(selector: (state: WorkflowStoreState) => T): T;
export function useWorkflowsStore<T>(selector?: (state: WorkflowStoreState) => T) {
  const store = useContext(workflowStoreContext);
  if (!store) throw new Error("useWorkflowsStore must in WorkflowsProvider");
  if (selector) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore(store, DEFAULT_USE_SHALLOW ? useShallow(selector) : selector);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(store);
}
