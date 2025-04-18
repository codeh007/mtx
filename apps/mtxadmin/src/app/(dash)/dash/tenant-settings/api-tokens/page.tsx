"use client";
import { useMutation } from "@tanstack/react-query";
import { DataTable } from "mtxuilib/data-table/data-table";

import api, { type APIToken } from "mtmaiapi/api";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import { useApiError } from "mtmaiui/hooks/useApi";
import { useTenant } from "mtmaiui/hooks/useAuth";
import { useMtmClient } from "mtmaiui/hooks/useMtmapi";
import { MtErrorBoundary } from "mtxuilib/components/MtErrorBoundary";
import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Dialog } from "mtxuilib/ui/dialog";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { Suspense, useState } from "react";
import { columns as apiTokensColumns } from "./components/api-tokens-columns";
import { CreateTokenDialog } from "./components/create-token-dialog";
import { RevokeTokenForm } from "./components/revoke-token-form";

export default function APITokens() {
  const tenant = useTenant();

  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [revokeToken, setRevokeToken] = useState<APIToken | null>(null);
  const mtmapi = useMtmClient();

  const listTokensQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/api-tokens",
    {
      params: {
        path: {
          tenant: tenant!.metadata.id,
        },
      },
    },
  );

  const cols = apiTokensColumns({
    onRevokeClick: (row) => {
      setRevokeToken(row);
    },
  });

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
                <BreadcrumbPage>Api token</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<SkeletonListview />}>
            <MtErrorBoundary>
              <div className="flex-grow h-full w-full">
                <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-row justify-between items-center">
                    <h2 className="text-2xl font-semibold leading-tight text-foreground">
                      API Tokens
                    </h2>

                    <Button
                      key="create-api-token"
                      onClick={() => setShowTokenDialog(true)}
                    >
                      Create API Token
                    </Button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 my-4">
                    API tokens are used by workers to connect with the Hatchet
                    API and engine.
                  </p>
                  <Separator className="my-4" />
                  <DataTable
                    isLoading={listTokensQuery.isLoading}
                    columns={cols}
                    data={listTokensQuery.data?.rows || []}
                    filters={[]}
                    getRowId={(row) => row.metadata.id}
                  />

                  {showTokenDialog && (
                    <CreateToken
                      tenant={tenant.metadata.id}
                      showTokenDialog={showTokenDialog}
                      setShowTokenDialog={setShowTokenDialog}
                      onSuccess={() => {
                        listTokensQuery.refetch();
                      }}
                    />
                  )}
                  {revokeToken && (
                    <RevokeToken
                      tenant={tenant.metadata.id}
                      apiToken={revokeToken}
                      setShowTokenRevoke={() => setRevokeToken(null)}
                      onSuccess={() => {
                        setRevokeToken(null);
                        listTokensQuery.refetch();
                      }}
                    />
                  )}
                </div>
              </div>
            </MtErrorBoundary>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}

function CreateToken({
  tenant,
  showTokenDialog,
  setShowTokenDialog,
  onSuccess,
}: {
  tenant: string;
  onSuccess: () => void;
  showTokenDialog: boolean;
  setShowTokenDialog: (show: boolean) => void;
}) {
  const [generatedToken, setGeneratedToken] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mtmapi = useMtmClient();
  const { handleApiError } = useApiError({
    setFieldErrors: setFieldErrors,
  });

  const createTokenMutation = mtmapi.useMutation(
    "post",
    "/api/v1/tenants/{tenant}/api-tokens",
    {
      onSuccess: (data) => {
        setGeneratedToken(data.token);
        onSuccess();
      },
      onError: handleApiError,
    },
  );

  return (
    <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
      <CreateTokenDialog
        isLoading={createTokenMutation.isPending}
        onSubmit={(opts) =>
          createTokenMutation.mutate({
            params: {
              path: {
                tenant,
              },
            },
          })
        }
        token={generatedToken}
        fieldErrors={fieldErrors}
      />
    </Dialog>
  );
}

function RevokeToken({
  tenant,
  apiToken,
  setShowTokenRevoke,
  onSuccess,
}: {
  tenant: string;
  apiToken: APIToken;
  setShowTokenRevoke: (show: boolean) => void;
  onSuccess: () => void;
}) {
  const { handleApiError } = useApiError({});

  const revokeMutation = useMutation({
    mutationKey: ["api-token:revoke", tenant, apiToken],
    mutationFn: async () => {
      await api.apiTokenUpdateRevoke(apiToken.metadata.id);
    },
    onSuccess: onSuccess,
    onError: handleApiError,
  });

  return (
    <Dialog open={!!apiToken} onOpenChange={setShowTokenRevoke}>
      <RevokeTokenForm
        apiToken={apiToken}
        isLoading={revokeMutation.isPending}
        onSubmit={() => revokeMutation.mutate()}
        onCancel={() => setShowTokenRevoke(false)}
      />
    </Dialog>
  );
}
