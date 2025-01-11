"use client";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { RateLimitOrderByDirection, RateLimitOrderByField } from "mtmaiapi/api";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";

import { DashContent } from "mtmaiui/components/DashContent";
import { DashHeaders } from "mtmaiui/components/DashHeaders";
import { useTenant } from "mtmaiui/hooks/useAuth";
import { useMtmClient } from "mtmaiui/hooks/useMtmapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { useMtRouter } from "mtxuilib/hooks/use-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";
import { SidebarInset } from "mtxuilib/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type RateLimitRow, columns } from "./components/rate-limit-columns";

export default function RateLimits() {
  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <DashHeaders>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Rate Limits</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashHeaders>
        <DashContent>
          <RateLimitsTable />
        </DashContent>
      </SidebarInset>
    </>
  );
}

function RateLimitsTable() {
  const tenant = useTenant();
  const mtmapi = useMtmClient();

  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string | undefined>(
    searchParams.get("search") || undefined,
  );
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
    RateLimitId: false,
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

  const router = useMtRouter();
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (search) {
      newSearchParams.set("search", search);
    } else {
      newSearchParams.delete("search");
    }
    newSearchParams.set(
      "sort",
      sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    );
    newSearchParams.set("filters", JSON.stringify(columnFilters));
    newSearchParams.set("pageIndex", pagination.pageIndex.toString());
    newSearchParams.set("pageSize", pagination.pageSize.toString());
    router.setSearchParams(newSearchParams);
  }, [
    search,
    sorting,
    columnFilters,
    pagination,
    router.setSearchParams,
    searchParams,
  ]);

  const orderByDirection = useMemo(():
    | RateLimitOrderByDirection
    | undefined => {
    if (!sorting.length) {
      return;
    }

    return sorting[0]?.desc
      ? RateLimitOrderByDirection.Desc
      : RateLimitOrderByDirection.Asc;
  }, [sorting]);

  const orderByField = useMemo((): RateLimitOrderByField | undefined => {
    if (!sorting.length) {
      return;
    }

    switch (sorting[0]?.id) {
      case "Key":
        return RateLimitOrderByField.Key;
      case "Value":
        return RateLimitOrderByField.Value;
      case "LimitValue":
        return RateLimitOrderByField.LimitValue;
      default:
        return RateLimitOrderByField.Key;
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
    isLoading: rateLimitsIsLoading,
    error: rateLimitsError,
  } = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/rate-limits",
    {
      params: {
        path: {
          tenant: currentTenant.metadata.id,
        },
        query: {
          search,
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

  const tableData =
    data?.rows?.map(
      (row): RateLimitRow => ({
        ...row,
        metadata: {
          id: row.key,
        },
      }),
    ) || [];

  return (
    <DataTable
      error={rateLimitsError}
      isLoading={rateLimitsIsLoading}
      columns={columns}
      data={tableData}
      filters={[]}
      showColumnToggle={true}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      sorting={sorting}
      setSorting={setSorting}
      search={search}
      setSearch={setSearch}
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
