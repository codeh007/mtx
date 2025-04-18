"use client";

import { useQuery } from "@tanstack/react-query";
import { queries } from "mtmaiapi/api";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import { columns as githubInstallationsColumns } from "./components/github-installations-columns";

import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import { DataTable } from "mtxuilib/data-table/data-table";
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { Suspense } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Separator } from "mtxuilib/ui/separator";

export default function Github() {
  // const cloudMeta = useCloudApiMeta();

  const hasGithubIntegration = cloudMeta?.data?.canLinkGithub;

  return (
    <>
      <DashSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Github</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<SkeletonListview />}>
            <div className="space-y-8">
              {!cloudMeta || !hasGithubIntegration ? (
                <>
                  <div className="flex-grow h-full w-full">
                    <p className="text-gray-700 dark:text-gray-300 my-4">
                      Not enabled for this tenant or instance.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-grow h-full w-full">
                    <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
                      <h2 className="text-2xl font-semibold leading-tight text-foreground">
                        Github Integration
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 my-4">
                        Link your Github account to Hatchet to integrate with
                        CI/CD and workflow versioning.
                      </p>
                      <Separator className="my-4" />
                      {hasGithubIntegration && <Separator className="my-4" />}
                      {hasGithubIntegration && <GithubInstallationsList />}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}

function GithubInstallationsList() {
  const listInstallationsQuery = useQuery({
    ...queries.github.listInstallations,
  });

  const cols = githubInstallationsColumns();

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-semibold leading-tight text-foreground">
          Github Accounts
        </h3>
        <a href="/api/v1/cloud/users/github-app/start">
          <Button key="create-api-token">Link new account</Button>
        </a>
      </div>
      <Separator className="my-4" />
      <DataTable
        isLoading={listInstallationsQuery.isLoading}
        columns={cols}
        data={listInstallationsQuery.data?.rows || []}
        filters={[]}
        getRowId={(row) => row.metadata.id}
      />
    </div>
  );
}
