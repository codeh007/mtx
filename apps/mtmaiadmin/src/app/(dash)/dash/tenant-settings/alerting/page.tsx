"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { columns as emailGroupsColumns } from "./components/email-groups-columns";
import { columns } from "./components/slack-webhooks-columns";
import { UpdateTenantAlertingSettings } from "./components/update-tenant-alerting-settings-form";

import { SkeletonListview } from "mtxuilib/components/skeletons/SkeletonListView";

import api, {
  queries,
  type CreateTenantAlertEmailGroupRequest,
  type SlackWebhook,
  type TenantAlertEmailGroup,
  type UpdateTenantRequest,
} from "mtmaiapi/api";
import { DashSidebar } from "mtmaiui/components/sidebar/siderbar";
import { useApiError, useApiMetaIntegrations } from "mtmaiui/hooks/useApi";
import { useTenant } from "mtmaiui/hooks/useAuth";
import { useMtmClient } from "mtmaiui/hooks/useMtmapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "mtxuilib/ui/breadcrumb";
import { Button } from "mtxuilib/ui/button";
import { Dialog } from "mtxuilib/ui/dialog";
import { Separator } from "mtxuilib/ui/separator";
import { SidebarInset, SidebarTrigger } from "mtxuilib/ui/sidebar";
import { CreateEmailGroupDialog } from "./components/create-email-group-dialog";
import { DeleteEmailGroupForm } from "./components/delete-email-group-form";
import { DeleteSlackForm } from "./components/delete-slack-form";

export default function Alerting() {
  const integrations = useApiMetaIntegrations();

  const hasEmailIntegration = integrations?.find((i) => i.name === "email");
  const hasSlackIntegration = integrations?.find((i) => i.name === "slack");

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
                <BreadcrumbPage>Alerting</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<SkeletonListview />}>
            <div className="space-y-8">
              <div className="flex-grow h-full w-full">
                <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-semibold leading-tight text-foreground">
                    Alerting
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 my-4">
                    Manage alerts to get notified on workflow failure.
                  </p>
                  <Separator className="my-4" />
                  <AlertingSettings />
                  {hasEmailIntegration && <Separator className="my-4" />}
                  {hasEmailIntegration && <EmailGroupsList />}
                  {hasSlackIntegration && <Separator className="my-4" />}
                  {hasSlackIntegration && <SlackWebhooksList />}
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </SidebarInset>
    </>
  );
}

const AlertingSettings: React.FC = () => {
  const tenant = useTenant();

  const mtmapi = useMtmClient();

  const alertingSettings = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/alerting/settings",
    {
      params: {
        path: {
          tenant: tenant.metadata.id,
        },
      },
    },
  );

  const [isLoading, setIsLoading] = useState(false);

  const { handleApiError } = useApiError({});

  const updateMutation = useMutation({
    mutationKey: ["tenant:update"],
    mutationFn: async (data: UpdateTenantRequest) => {
      await api.tenantUpdate(tenant.metadata.id, data);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
      alertingSettings.refetch();
    },
    onError: handleApiError,
  });

  if (!alertingSettings.data) {
    return <Spinner />;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold leading-tight text-foreground">
        Settings
      </h3>
      <Separator className="my-4" />
      <div className="flex items-center space-x-2">
        <UpdateTenantAlertingSettings
          alertingSettings={alertingSettings.data}
          isLoading={isLoading}
          onSubmit={(opts) => {
            updateMutation.mutate(opts);
          }}
          fieldErrors={{}}
        />
      </div>
    </div>
  );
};

function EmailGroupsList() {
  const tenant = useTenant();

  const [showGroupsDialog, setShowGroupsDialog] = useState(false);
  const [deleteEmailGroup, setDeleteEmailGroup] =
    useState<TenantAlertEmailGroup | null>(null);

  const [isAlertMemberEmails, setIsAlertMemberEmails] = useState(
    tenant.alertMemberEmails || false,
  );

  const { handleApiError } = useApiError({});

  const updateMutation = useMutation({
    mutationKey: ["tenant:update"],
    mutationFn: async (data: UpdateTenantRequest) => {
      await api.tenantUpdate(tenant.metadata.id, data);
    },
    onError: handleApiError,
  });

  const listEmailGroupQuery = useQuery({
    ...queries.emailGroups.list(tenant.metadata.id),
  });

  const cols = emailGroupsColumns({
    onDeleteClick: (row) => {
      setDeleteEmailGroup(row);
    },
    alertTenantEmailsSet: isAlertMemberEmails,
    onToggleMembersClick: (value) => {
      setIsAlertMemberEmails(value);
      updateMutation.mutate({
        alertMemberEmails: value,
      });
    },
  });

  const groups: TenantAlertEmailGroup[] = useMemo(() => {
    const customGroups = listEmailGroupQuery.data?.rows || [];

    return [
      {
        // Special group for all tenant members
        emails: [],
        metadata: {
          id: "default",
          createdAt: "default",
          updatedAt: "default",
        },
      },
      ...customGroups,
    ];
  }, [listEmailGroupQuery.data]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-semibold leading-tight text-foreground">
          Email Groups
        </h3>
        <Button
          key="create-slack-webhook"
          onClick={() => {
            setShowGroupsDialog(true);
          }}
        >
          Create new group
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable
        isLoading={listEmailGroupQuery.isLoading}
        columns={cols}
        data={groups}
        filters={[]}
        getRowId={(row) => row.metadata.id}
      />
      {showGroupsDialog && (
        <CreateEmailGroup
          tenant={tenant.metadata.id}
          onSuccess={() => {
            setShowGroupsDialog(false);
            listEmailGroupQuery.refetch();
          }}
          showGroupDialog={showGroupsDialog}
          setShowGroupDialog={setShowGroupsDialog}
        />
      )}
      {deleteEmailGroup && (
        <DeleteEmailGroup
          tenant={tenant.metadata.id}
          emailGroup={deleteEmailGroup}
          setShowEmailGroupDelete={() => setDeleteEmailGroup(null)}
          onSuccess={() => {
            setDeleteEmailGroup(null);
            listEmailGroupQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

function CreateEmailGroup({
  tenant,
  showGroupDialog,
  setShowGroupDialog,
  onSuccess,
}: {
  tenant: string;
  onSuccess: () => void;
  showGroupDialog: boolean;
  setShowGroupDialog: (show: boolean) => void;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { handleApiError } = useApiError({
    setFieldErrors: setFieldErrors,
  });

  const createTokenMutation = useMutation({
    mutationKey: ["api-token:create", tenant],
    mutationFn: async (data: CreateTenantAlertEmailGroupRequest) => {
      const res = await api.alertEmailGroupCreate(tenant, data);
      return res.data;
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: handleApiError,
  });

  return (
    <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
      <CreateEmailGroupDialog
        isLoading={createTokenMutation.isPending}
        onSubmit={createTokenMutation.mutate}
        fieldErrors={fieldErrors}
      />
    </Dialog>
  );
}

function DeleteEmailGroup({
  tenant,
  emailGroup,
  setShowEmailGroupDelete,
  onSuccess,
}: {
  tenant: string;
  emailGroup: TenantAlertEmailGroup;
  setShowEmailGroupDelete: (show: boolean) => void;
  onSuccess: () => void;
}) {
  const { handleApiError } = useApiError({});

  const deleteMutation = useMutation({
    mutationKey: ["alert-email-group:delete", tenant, emailGroup],
    mutationFn: async () => {
      await api.alertEmailGroupDelete(emailGroup.metadata.id);
    },
    onSuccess: onSuccess,
    onError: handleApiError,
  });

  return (
    <Dialog open={!!emailGroup} onOpenChange={setShowEmailGroupDelete}>
      <DeleteEmailGroupForm
        emailGroup={emailGroup}
        isLoading={deleteMutation.isPending}
        onSubmit={() => deleteMutation.mutate()}
        onCancel={() => setShowEmailGroupDelete(false)}
      />
    </Dialog>
  );
}

function SlackWebhooksList() {
  const tenant = useTenant();

  const [deleteSlack, setDeleteSlack] = useState<SlackWebhook | null>(null);

  const listWebhooksQuery = useQuery({
    ...queries.slackWebhooks.list(tenant.metadata.id),
  });

  const cols = columns({
    onDeleteClick: (row) => {
      setDeleteSlack(row);
    },
  });

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-semibold leading-tight text-foreground">
          Slack Webhooks
        </h3>
        {/* biome-ignore lint/style/useTemplate: <explanation> */}
        <a href={"/api/v1/tenants/" + tenant.metadata.id + "/slack/start"}>
          <Button key="create-slack-webhook">Add Slack Webhook</Button>
        </a>
      </div>
      <Separator className="my-4" />
      <DataTable
        isLoading={listWebhooksQuery.isLoading}
        columns={cols}
        data={listWebhooksQuery.data?.rows || []}
        filters={[]}
        getRowId={(row) => row.metadata.id}
      />
      {deleteSlack && (
        <DeleteSlackWebhook
          tenant={tenant.metadata.id}
          slackWebhook={deleteSlack}
          setShowSlackWebhookDelete={() => setDeleteSlack(null)}
          onSuccess={() => {
            setDeleteSlack(null);
            listWebhooksQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

function DeleteSlackWebhook({
  tenant,
  slackWebhook,
  setShowSlackWebhookDelete,
  onSuccess,
}: {
  tenant: string;
  slackWebhook: SlackWebhook;
  setShowSlackWebhookDelete: (show: boolean) => void;
  onSuccess: () => void;
}) {
  const { handleApiError } = useApiError({});

  const deleteMutation = useMutation({
    mutationKey: ["slack-webhook:delete", tenant, slackWebhook],
    mutationFn: async () => {
      await api.slackWebhookDelete(slackWebhook.metadata.id);
    },
    onSuccess: onSuccess,
    onError: handleApiError,
  });

  return (
    <Dialog open={!!slackWebhook} onOpenChange={setShowSlackWebhookDelete}>
      <DeleteSlackForm
        slackWebhook={slackWebhook}
        isLoading={deleteMutation.isPending}
        onSubmit={() => deleteMutation.mutate()}
        onCancel={() => setShowSlackWebhookDelete(false)}
      />
    </Dialog>
  );
}
