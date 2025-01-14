"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  CreateTenantInviteRequest,
  TenantInvite,
  UpdateTenantInviteRequest,
  UserChangePasswordRequest,
} from "mtmaiapi/api";
import api, { queries } from "mtmaiapi/api";
import { useApiError, useApiMeta } from "mtmaiui/hooks/useApi";
import { useTenant } from "mtmaiui/hooks/useAuth";
import { useMtmClient } from "mtmaiui/hooks/useMtmapi";
import { DataTable } from "mtxuilib/data-table/data-table";
import { Button } from "mtxuilib/ui/button";
import { Dialog } from "mtxuilib/ui/dialog";
import { Separator } from "mtxuilib/ui/separator";
import { useState } from "react";
import { ChangePasswordDialog } from "./components/change-password-dialog";
import { CreateInviteForm } from "./components/create-invite-form";
import { DeleteInviteForm } from "./components/delete-invite-form";
import { columns } from "./components/invites-columns";
import { columns as membersColumns } from "./components/members-columns";
import { UpdateInviteForm } from "./components/update-invite-form";

export default function Members() {
  const meta = useApiMeta();

  return (
    <div className="flex-grow h-full w-full">
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold leading-tight text-foreground">
          Members and Invites
        </h2>
        <Separator className="my-4" />
        <MembersList />
        {meta.data?.allowInvites && (
          <>
            <Separator className="my-4" />
            <InvitesList />
          </>
        )}
      </div>
    </div>
  );
}

function MembersList() {
  const tenant = useTenant();

  if (!tenant) throw new Error("tenant required");
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  const listMembersQuery = useQuery({
    ...queries.members.list(tenant.metadata.id),
  });

  return (
    <div>
      <h3 className="text-xl font-semibold leading-tight text-foreground">
        Members
      </h3>
      <Separator className="my-4" />
      <DataTable
        columns={membersColumns({
          onChangePasswordClick: () => {
            setShowChangePasswordDialog(true);
          },
        })}
        data={listMembersQuery.data?.rows || []}
        filters={[]}
        getRowId={(row) => row.metadata.id}
        isLoading={listMembersQuery.isLoading}
      />
      {showChangePasswordDialog && (
        <ChangePassword
          tenant={tenant.metadata.id}
          showChangePasswordDialog={showChangePasswordDialog}
          setShowChangePasswordDialog={setShowChangePasswordDialog}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}

function InvitesList() {
  const tenant = useTenant();

  if (!tenant) throw new Error("tenant required");
  const [showCreateInviteModal, setShowCreateInviteModal] = useState(false);
  const [updateInvite, setUpdateInvite] = useState<TenantInvite | null>(null);
  const [deleteInvite, setDeleteInvite] = useState<TenantInvite | null>(null);
  const mtmapi = useMtmClient();

  const listInvitesQuery = mtmapi.useQuery(
    "get",
    "/api/v1/tenants/{tenant}/invites",
    {
      params: {
        path: {
          tenant: tenant.metadata.id,
        },
      },
    },
    {},
  );

  const cols = columns({
    onEditClick: (row) => {
      setUpdateInvite(row);
    },
    onDeleteClick: (row) => {
      setDeleteInvite(row);
    },
  });

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-semibold leading-tight text-foreground">
          Invites
        </h3>
        <Button
          key="create-invite"
          onClick={() => setShowCreateInviteModal(true)}
        >
          Create Invite
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable
        isLoading={listInvitesQuery.isLoading}
        columns={cols}
        data={listInvitesQuery.data?.rows || []}
        filters={[]}
        getRowId={(row) => row.metadata.id}
      />
      {showCreateInviteModal && (
        <CreateInvite
          tenant={tenant.metadata.id}
          showCreateInviteModal={showCreateInviteModal}
          setShowCreateInviteModal={setShowCreateInviteModal}
          onSuccess={() => {
            setShowCreateInviteModal(false);
            listInvitesQuery.refetch();
          }}
        />
      )}
      {updateInvite && (
        <UpdateInvite
          tenant={tenant.metadata.id}
          tenantInvite={updateInvite}
          setShowTenantInvite={() => setUpdateInvite(null)}
          onSuccess={() => {
            setUpdateInvite(null);
            listInvitesQuery.refetch();
          }}
        />
      )}
      {deleteInvite && (
        <DeleteInvite
          tenant={tenant.metadata.id}
          tenantInvite={deleteInvite}
          setShowTenantInviteDelete={() => setDeleteInvite(null)}
          onSuccess={() => {
            setDeleteInvite(null);
            listInvitesQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

function CreateInvite({
  tenant,
  showCreateInviteModal,
  setShowCreateInviteModal,
  onSuccess,
}: {
  tenant: string;
  showCreateInviteModal: boolean;
  setShowCreateInviteModal: (show: boolean) => void;
  onSuccess: () => void;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { handleApiError } = useApiError({
    setFieldErrors: setFieldErrors,
  });

  const createMutation = useMutation({
    mutationKey: ["tenant-invite:create", tenant],
    mutationFn: async (data: CreateTenantInviteRequest) => {
      await api.tenantInviteCreate(tenant, data);
    },
    onSuccess: onSuccess,
    onError: handleApiError,
  });

  return (
    <Dialog
      open={showCreateInviteModal}
      onOpenChange={setShowCreateInviteModal}
    >
      <CreateInviteForm
        isLoading={createMutation.isPending}
        onSubmit={createMutation.mutate}
        fieldErrors={fieldErrors}
      />
    </Dialog>
  );
}

function UpdateInvite({
  tenant,
  tenantInvite,
  setShowTenantInvite,
  onSuccess,
}: {
  tenant: string;
  tenantInvite: TenantInvite;
  setShowTenantInvite: (show: boolean) => void;
  onSuccess: () => void;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { handleApiError } = useApiError({
    setFieldErrors: setFieldErrors,
  });

  const updateMutation = useMutation({
    mutationKey: ["tenant-invite:update", tenant, tenantInvite],
    mutationFn: async (data: UpdateTenantInviteRequest) => {
      await api.tenantInviteUpdate(tenant, tenantInvite.metadata.id, data);
    },
    onSuccess: onSuccess,
    onError: handleApiError,
  });

  return (
    <Dialog open={!!tenantInvite} onOpenChange={setShowTenantInvite}>
      <UpdateInviteForm
        invite={tenantInvite}
        isLoading={updateMutation.isPending}
        onSubmit={updateMutation.mutate}
        fieldErrors={fieldErrors}
      />
    </Dialog>
  );
}

function DeleteInvite({
  tenant,
  tenantInvite,
  setShowTenantInviteDelete,
  onSuccess,
}: {
  tenant: string;
  tenantInvite: TenantInvite;
  setShowTenantInviteDelete: (show: boolean) => void;
  onSuccess: () => void;
}) {
  const { handleApiError } = useApiError({});

  const deleteMutation = useMutation({
    mutationKey: ["tenant-invite:delete", tenant, tenantInvite],
    mutationFn: async () => {
      await api.tenantInviteDelete(tenant, tenantInvite.metadata.id);
    },
    onSuccess: onSuccess,
    onError: handleApiError,
  });

  return (
    <Dialog open={!!tenantInvite} onOpenChange={setShowTenantInviteDelete}>
      <DeleteInviteForm
        invite={tenantInvite}
        isLoading={deleteMutation.isPending}
        onSubmit={() => deleteMutation.mutate()}
        onCancel={() => setShowTenantInviteDelete(false)}
      />
    </Dialog>
  );
}

function ChangePassword({
  tenant,
  showChangePasswordDialog,
  setShowChangePasswordDialog,
  onSuccess,
}: {
  tenant: string;
  onSuccess: () => void;
  showChangePasswordDialog: boolean;
  setShowChangePasswordDialog: (show: boolean) => void;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { handleApiError } = useApiError({
    setFieldErrors: setFieldErrors,
  });

  const updatePasswordMutation = useMutation({
    mutationKey: ["user:update", tenant],
    mutationFn: async (data: UserChangePasswordRequest) => {
      const res = await api.userUpdatePassword(data);
      return res.data;
    },
    onMutate: () => {
      setFieldErrors({});
    },
    onSuccess: () => {
      onSuccess();
      setShowChangePasswordDialog(false);
    },
    onError: (e: AxiosError<unknown, any>) => {
      return handleApiError(e);
    },
  });

  return (
    <Dialog
      open={showChangePasswordDialog}
      onOpenChange={setShowChangePasswordDialog}
    >
      <ChangePasswordDialog
        isLoading={updatePasswordMutation.isPending}
        onSubmit={(data) =>
          updatePasswordMutation.mutate({
            password: data.password,
            newPassword: data.newPassword,
          })
        }
        fieldErrors={fieldErrors}
      />
    </Dialog>
  );
}
