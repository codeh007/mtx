import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import type { SortingState, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";
import { BiCard, BiTable } from "react-icons/bi";

import { agEventListOptions } from "mtmaiapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { CustomLink } from "mtxuilib/mt/CustomLink";
import { Button } from "mtxuilib/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "mtxuilib/ui/card";

import { useTenant } from "../../hooks/useAuth";
import { AgEventCard } from "./components/AgEventCard";
import { AgEventsColumns } from "./components/ag-events-columns";

export const Route = createLazyFileRoute("/agEvents/")({
  component: AgEventListView,
});

export function AgEventListView() {
  const { siteId } = Route.useParams();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rotate, setRotate] = useState(false);
  const tenant = useTenant();
  const emptyState = (
    <Card className="w-full text-justify">
      <CardHeader>
        <CardTitle>No posts</CardTitle>
        <CardDescription>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            There are no workflows registered in this tenant. To enable workflow
            execution, please register a workflow with a worker or{" "}
            <a href="support@hatchet.run">contact support</a>.
          </p>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <CustomLink to="#" className="flex flex-row item-center">
          <Button onClick={() => {}} variant="link" className="p-0 w-fit">
            {/* <QuestionMarkCircleIcon className={cn("h-4 w-4 mr-2")} /> */}
            {/* Docs: Understanding Workflows in Hatchet */}
          </Button>
        </CustomLink>
      </CardFooter>
    </Card>
  );

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "metadata.id",
      desc: true,
    },
  ]);

  const [cardToggle, setCardToggle] = useState(true);

  // const basePath = useBasePath();

  const agEventsQuery = useSuspenseQuery({
    ...agEventListOptions({
      path: {
        tenant: tenant!.metadata.id,
      },
    }),
  });

  const actions = [
    <Button
      key="card-toggle"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        setCardToggle((t) => !t);
      }}
      variant={"outline"}
      aria-label="Toggle card/table view"
    >
      {!cardToggle ? (
        <BiCard className="size-4" />
      ) : (
        <BiTable className="size-4" />
      )}
    </Button>,
    <Button
      key="refresh"
      className="h-8 px-2 lg:px-3"
      size="sm"
      onClick={() => {
        agEventsQuery.refetch();
        setRotate(!rotate);
      }}
      variant={"outline"}
      aria-label="Refresh events list"
    >
      <ArrowPathIcon
        className={`h-4 w-4 transition-transform ${rotate ? "rotate-180" : ""}`}
      />
    </Button>,
    // <CustomLink
    //   key="create-post"
    //   to={`/agEvents/create`}
    //   search={{ siteId: siteId }}
    //   className={cn("h-8 px-2 lg:px-3", buttonVariants({ variant: "outline" }))}
    //   aria-label="Create new post"
    // >
    //   <Icons.plus className="size-4" />
    //   {/* <PlusCircleIcon className="size-4" /> */}
    // </CustomLink>,
  ];

  return (
    <>
      <DataTable
        columns={AgEventsColumns}
        data={agEventsQuery.data?.rows || []}
        pageCount={1}
        filters={[]}
        emptyState={emptyState}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        sorting={sorting}
        setSorting={setSorting}
        manualSorting={false}
        actions={actions}
        manualFiltering={false}
        card={
          cardToggle
            ? {
                component: AgEventCard,
              }
            : undefined
        }
      />
    </>
  );
}
