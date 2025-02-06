"use client";
import { useQuery } from "@tanstack/react-query";
import type {
  VisibilityState
} from "@tanstack/react-table";


import { agEventListOptions, type Tenant } from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { AgEventsColumns } from "./ag-events-columns";
export interface AgEventTableProps {
  tenant: Tenant;
  createdAfter?: string;
  createdBefore?: string;
  workflowId?: string;
  parentWorkflowRunId?: string;
  parentStepRunId?: string;
  initColumnVisibility?: VisibilityState;
  filterVisibility?: { [key: string]: boolean };
  refetchInterval?: number;
  showMetrics?: boolean;
}

export function AgEventsTable({
  tenant,
  createdAfter: createdAfterProp,
  workflowId,
  initColumnVisibility = {},
  filterVisibility = {},
  parentWorkflowRunId,
  parentStepRunId,
  refetchInterval = 5000,
  showMetrics = false,
}: AgEventTableProps) {
  // const searchParams = useSearchParams();
  // const router = useMtRouter();
  // const mtmapi = useMtmClient();

  // const [viewQueueMetrics, setViewQueueMetrics] = useState(false);

  // const defaultTimeRange = useMtmaiV2((x) => x.lastTimeRange);
  // const setDefaultTimeRange = useMtmaiV2((x) => x.setLastTimeRange);

  const agEventsQuery = useQuery({
    ...agEventListOptions({
      path: {
        tenant: tenant.metadata.id, 
      }
    })
  });

  const  columnVisibility = true
  return (
    <>
      <DataTable
        emptyState={<>No workflow runs found with the given filters.</>}
        // error={workflowKeysError}
        isLoading={agEventsQuery.isLoading}
        columns={AgEventsColumns}
        columnVisibility={columnVisibility}
        // setColumnVisibility={setColumnVisibility}
        data={agEventsQuery.data?.rows || []}
        // filters={filters}
        // actions={actions}
        // sorting={sorting}
        // setSorting={setSorting}
        // columnFilters={columnFilters}
        // setColumnFilters={setColumnFilters}
        // pagination={pagination}
        // setPagination={setPagination}
        // onSetPageSize={setPageSize}
        // rowSelection={rowSelection}
        // setRowSelection={setRowSelection}
        pageCount={agEventsQuery.data?.pagination?.num_pages || 0}
        showColumnToggle={true}
      />
    </>
  );
}
