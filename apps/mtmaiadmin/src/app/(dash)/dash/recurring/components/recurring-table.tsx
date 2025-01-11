"use client";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  CronWorkflowsOrderByField,
  WorkflowRunOrderByDirection,
} from "mtmaiapi/api";
import { useTenant } from "mtmaiui/hooks/useAuth";
import { useMtmClient } from "mtmaiui/hooks/useMtmapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { columns } from "./recurring-columns";

export function CronsTable() {
  const searchParams = useSearchParams();
  const router = useMtRouter();
  const mtmapi = useMtmClient();
  const tenant = useTenant();

  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      const [id, desc] = sortParam.split(":");
      return [{ id, desc: desc === "desc" }];
    }
    return [];
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filtersParam = searchParams.get("filters");
    if (filtersParam) {
      return JSON.parse(filtersParam);
    }
    return [];
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    createdAt: false,
  });

  const [pagination, setPagination] = useState<PaginationState>(() => {
    const pageIndex = Number(searchParams.get("pageIndex")) || 0;
    const pageSize = Number(searchParams.get("pageSize")) || 50;
    return { pageIndex, pageSize };
  });
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get("pageSize")) || 50,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set(
      "sort",
      sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    );
    newSearchParams.set("filters", JSON.stringify(columnFilters));
    newSearchParams.set("pageIndex", pagination.pageIndex.toString());
    newSearchParams.set("pageSize", pagination.pageSize.toString());
    router.setSearchParams(newSearchParams);
  }, [sorting, columnFilters, pagination, router, searchParams]);

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

  const orderByField = useMemo((): CronWorkflowsOrderByField | undefined => {
    if (!sorting.length) {
      return;
    }

    switch (sorting[0]?.id) {
      case "triggerAt":
        return CronWorkflowsOrderByField.CreatedAt;
      default:
        return CronWorkflowsOrderByField.CreatedAt;
    }
  }, [sorting]);

  const offset = useMemo(() => {
    if (!pagination) {
      return;
    }

    return pagination.pageIndex * pagination.pageSize;
  }, [pagination]);
  const {
    data,
    isLoading: queryIsLoading,
    error: queryError,
  } = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/workflows/crons",
    {
      params: {
        path: {
          tenant: currentTenant.metadata.id,
        },
        query: {
          // TODO: add filters
          orderByField,
          orderByDirection,
          offset,
          limit: pageSize,
        },
      },
    },
    {
      refetchInterval: 2000,
    },
  );

  return (
    <DataTable
      error={queryError}
      isLoading={queryIsLoading}
      columns={columns}
      data={data?.rows || []}
      filters={[]}
      showColumnToggle={true}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      pagination={pagination}
      setPagination={setPagination}
      onSetPageSize={setPageSize}
      pageCount={data?.pagination?.num_pages || 0}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      getRowId={(row) => row.metadata.id}
    />
  );
}
