import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { RootRoute } from "@mtmaiui/routes/~__root";
import { useQuery } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  type CronWorkflows,
  CronWorkflowsOrderByField,
  WorkflowRunOrderByDirection,
  cronWorkflowListOptions,
  workflowListOptions,
} from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import {
  type FilterOption,
  type ToolbarFilters,
  ToolbarType,
} from "mtxuilib/data-table/data-table-toolbar";
import { Button } from "mtxuilib/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useTenantId } from "../../../hooks/useAuth";
import { DeleteCron } from "./delete-cron";
import { columns } from "./recurring-columns";

export function CronsTable() {
  const tid = useTenantId();
  const { sort } = RootRoute.useSearch();

  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = sort;
    if (sortParam) {
      const [id, desc] = sortParam.split(":");
      return [{ id, desc: desc === "desc" }];
    }
    return [];
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    // const filtersParam = filters;
    // if (filtersParam) {
    //   // return JSON.parse(filtersParam);
    // }
    return [];
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [pagination, setPagination] = useState<PaginationState>(() => {
    // const pageIndex = Number(pageIndex) || 0;
    // const pageSize = Number(pageSize) || 50;
    return { pageIndex: 0, pageSize: 50 };
  });

  // const [pageSize, setPageSize] = useState<number>(
  //   Number(searchParams.get("pageSize")) || 50,
  // );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    // const newSearchParams = new URLSearchParams(searchParams);
    // newSearchParams.set(
    //   "sort",
    //   sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    // );
    // newSearchParams.set("filters", JSON.stringify(columnFilters));
    // newSearchParams.set("pageIndex", pagination.pageIndex.toString());
    // newSearchParams.set("pageSize", pagination.pageSize.toString());
    // setSearchParams(newSearchParams);
  }, [sorting, columnFilters, pagination]);

  const workflow = useMemo<string | undefined>(() => {
    const filter = columnFilters.find((filter) => filter.id === "Workflow");

    if (!filter) {
      return;
    }

    const vals = filter?.value as Array<string>;
    return vals[0];
  }, [columnFilters]);

  const orderByDirection = useMemo<WorkflowRunOrderByDirection | undefined>(() => {
    if (!sorting.length) {
      return;
    }

    return sorting[0]?.desc ? WorkflowRunOrderByDirection.DESC : WorkflowRunOrderByDirection.ASC;
  }, [sorting]);

  const orderByField = useMemo<CronWorkflowsOrderByField | undefined>(() => {
    if (!sorting.length) {
      return;
    }

    switch (sorting[0]?.id) {
      case "createdAt":
        return CronWorkflowsOrderByField.CREATED_AT;
      case "name":
        return CronWorkflowsOrderByField.NAME;
      default:
        return CronWorkflowsOrderByField.CREATED_AT;
    }
  }, [sorting]);

  const offset = useMemo(() => {
    if (!pagination) {
      return;
    }

    return pagination.pageIndex * pagination.pageSize;
  }, [pagination]);

  // const {
  //   data,
  //   isLoading: queryIsLoading,
  //   error: queryError,
  //   refetch,
  // } = useQuery({
  //   ...queries.cronJobs.list(tenant.metadata.id, {
  //     orderByField,
  //     orderByDirection,
  //     offset,
  //     limit: pageSize,
  //     workflowId: workflow,
  //     additionalMetadata: columnFilters.find(
  //       (filter) => filter.id === "Metadata",
  //     )?.value as string[] | undefined,
  //   }),
  //   refetchInterval: 2000,
  // });

  const cronJobsQuery = useQuery({
    ...cronWorkflowListOptions({
      path: {
        tenant: tid,
      },
      query: {
        orderByField,
        orderByDirection,
        offset,
        limit: pagination.pageSize,
        workflowId: workflow,
      },
    }),
    refetchInterval: 2000,
  });

  const [showDeleteCron, setShowDeleteCron] = useState<CronWorkflows | undefined>();

  const handleDeleteClick = (cron: CronWorkflows) => {
    setShowDeleteCron(cron);
  };

  const handleConfirmDelete = () => {
    if (showDeleteCron) {
      setShowDeleteCron(undefined);
      cronJobsQuery.refetch();
    }
  };

  // const { data: workflowKeys } = useQuery({
  //   ...queries.workflows.list(tenant.metadata.id, { limit: 200 }),
  // });

  const workflowListQuery = useQuery({
    ...workflowListOptions({
      path: {
        tenant: tid,
      },
      query: {
        limit: 200,
      },
    }),
  });

  const workflowKeyFilters = useMemo((): FilterOption[] => {
    return (
      workflowListQuery?.data?.rows?.map((key) => ({
        value: key.metadata.id,
        label: key.name,
      })) || []
    );
  }, [workflowListQuery]);

  const filters: ToolbarFilters = [
    {
      columnId: "Workflow",
      title: "Workflow",
      options: workflowKeyFilters,
      type: ToolbarType.Radio,
    },
    {
      columnId: "Metadata",
      title: "Metadata",
      type: ToolbarType.KeyValue,
    },
  ];

  const actions = [
    <Button
      key="refresh"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        cronJobsQuery.refetch();
      }}
      variant={"outline"}
      aria-label="Refresh crons list"
    >
      <ArrowPathIcon className={"size-4"} />
    </Button>,
  ];

  return (
    <>
      {showDeleteCron && (
        <DeleteCron
          tenant={tid}
          cron={showDeleteCron}
          setShowCronRevoke={setShowDeleteCron}
          onSuccess={handleConfirmDelete}
        />
      )}
      <DataTable
        error={cronJobsQuery.error}
        isLoading={cronJobsQuery.isLoading}
        columns={columns({
          onDeleteClick: handleDeleteClick,
        })}
        data={cronJobsQuery.data?.rows || []}
        filters={filters}
        showColumnToggle={true}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        pagination={pagination}
        setPagination={setPagination}
        // onSetPageSize={setPageSize}
        // pageCount={data?.pagination?.num_pages || 0}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        actions={actions}
        getRowId={(row) => row.metadata.id}
      />
    </>
  );
}
