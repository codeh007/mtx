"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { AgEvent } from "mtmaiapi";
import { DataTableColumnHeader } from "mtxuilib/data-table/data-table-column-header";

export const AgEventsColumns: ColumnDef<AgEvent>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <>
        {row.original.metadata.id}
      </>
    ),
    enableSorting: false,
    enableHiding: false,
  },
//   {
//     accessorKey: "title",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Title" />
//     ),
//     cell: ({ row }) => {
//       const basePath = useBasePath();
//       return (
//         <Link href={`${basePath}/workflows/${row.original.metadata.id}`}>
//           <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap text-md p-2">
//             {row.original.name}
//           </div>
//         </Link>
//       );
//     },
//     enableSorting: true,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "createdAt",
//     header: ({ column }) => (
//       <DataTableColumnHeader
//         column={column}
//         title="Created at"
//         className="whitespace-nowrap"
//       />
//     ),
//     sortingFn: (a, b) => {
//       return (
//         new Date(a.original.metadata.createdAt).getTime() -
//         new Date(b.original.metadata.createdAt).getTime()
//       );
//     },
//     cell: ({ row }) => {
//       return (
//         <div className="whitespace-nowrap">
//           <RelativeDate date={row.original.metadata.createdAt} />
//         </div>
//       );
//     },
//     enableSorting: true,
//     enableHiding: true,
//   },
//   {
//     header: () => <></>,
//     accessorKey: "chevron",
//     cell: ({ row }) => {
//       const basePath = useBasePath();
//       return (
//         <div className="flex gap-2 justify-end">
//           <Link href={`${basePath}/workflows/${row.original.metadata.id}`}>
//             <div className="cursor-pointer hover:underline min-w-fit whitespace-nowrap text-md p-2">
//               <ChevronRightIcon
//                 className="h-5 w-5 flex-none text-gray-700 dark:text-gray-300"
//                 aria-hidden="true"
//               />
//             </div>
//           </Link>
//         </div>
//       );
//     },
//     enableSorting: false,
//     enableHiding: false,
//   },
];
