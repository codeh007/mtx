import type { TenantInvite } from "mtmaiapi/api";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "mtxuilib/ui/dialog";

interface DeleteInviteFormProps {
  className?: string;
  onSubmit: (invite: TenantInvite) => void;
  onCancel: () => void;
  invite: TenantInvite;
  isLoading: boolean;
}

export function DeleteInviteForm({
  className,
  ...props
}: DeleteInviteFormProps) {
  return (
    <DialogContent className="w-fit max-w-[80%] min-w-[500px]">
      <DialogHeader>
        <DialogTitle>Delete invite</DialogTitle>
      </DialogHeader>
      <div>
        <div className="text-sm text-foreground mb-4">
          Are you sure you want to delete this invite?
        </div>
        <div className="flex flex-row gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              props.onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              props.onSubmit(props.invite);
            }}
          >
            {props.isLoading && <Spinner />}
            Delete invite
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
