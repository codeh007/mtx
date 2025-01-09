"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Icons } from "../icons";
import { searchString } from "../lib/utils";
import { Button } from "../ui/button";
interface TBountyListPagination {
  itemCount: number;
  pageSize: number;
  baseUrl: string;
}

export function Pagination({
  itemCount,
  pageSize,
  baseUrl,
}: TBountyListPagination) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number.parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const previousPage = page ? Number.parseInt(page.toString()) - 1 : null;
  const nextPage = page ? Number.parseInt(page.toString()) + 1 : 2;
  const nextPageQueryString = searchString(
    nextPage.toString(),
    search || "",
    sort || "",
  );
  const previousPageQueryString = searchString(
    previousPage?.toString() || "",
    search || "",
    sort || "",
  );

  return (
    <nav
      className="border-raised-border bg-appbg flex items-center justify-between border-t px-0 py-3"
      aria-label="Pagination"
    >
      <div className="block">
        <p className="text-brandtext-600 text-sm">
          Showing{" "}
          <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
          <span className="font-medium">{page * pageSize}</span> of {itemCount}{" "}
          results
        </p>
      </div>
      <div className="flex w-full flex-1 justify-end gap-4">
        {" "}
        {previousPage ? (
          <Button
            onClick={() => {
              router.push(`${baseUrl}?${previousPageQueryString}`);
              startTransition(() => {
                router.refresh();
              });
            }}
            className="inline-flex gap-2"
            // intent="secondary"
            // size="small"
          >
            {isPending ? (
              <Icons.spinner className="text-brandtext-600 size-4 animate-spin" />
            ) : (
              <Icons.arrowLeft size={16} />
            )}
            Previous
          </Button>
        ) : null}
        {page * pageSize < itemCount && (
          <Button
            onClick={() => {
              router.push(`${baseUrl}?${nextPageQueryString}`);
              startTransition(() => {
                router.refresh();
              });
            }}
            className="inline-flex gap-2"
            // intent="secondary"
            // size="small"
          >
            Next
            {isPending ? (
              <Icons.spinner className="text-brandtext-600 size-4 animate-spin" />
            ) : (
              <Icons.arrowRight size={16} />
            )}
          </Button>
        )}
      </div>
    </nav>
  );
}
