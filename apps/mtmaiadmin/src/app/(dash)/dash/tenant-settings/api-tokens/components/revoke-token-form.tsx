"use client";
import type { APIToken } from "mtmaiapi/api";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "mtxuilib/ui/dialog";

interface RevokeTokenFormProps {
  className?: string;
  onSubmit: (apiToken: APIToken) => void;
  onCancel: () => void;
  apiToken: APIToken;
  isLoading: boolean;
}

export function RevokeTokenForm({ className, ...props }: RevokeTokenFormProps) {
  return (
    <DialogContent className="w-fit max-w-[80%] min-w-[500px]">
      <DialogHeader>
        <DialogTitle>Delete token</DialogTitle>
      </DialogHeader>
      <div>
        <div className="text-sm text-foreground mb-4">
          Are you sure you want to revoke the API token {props.apiToken.name}?
          This action will immediately prevent any services running with this
          token from dispatching events or executing steps.
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
              props.onSubmit(props.apiToken);
            }}
          >
            {props.isLoading && <Spinner />}
            Revoke API token
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
