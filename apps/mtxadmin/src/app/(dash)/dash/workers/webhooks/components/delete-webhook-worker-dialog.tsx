"use client";

import { cn } from "mtxuilib/lib/utils";
import { Spinner } from "mtxuilib/mt/mtloading";
import { Button } from "mtxuilib/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "mtxuilib/ui/dialog";

interface DeleteWebhookWorkerDialogProps {
  onSubmit: () => void;
  className?: string;
  isLoading: boolean;
  fieldErrors?: Record<string, string>;
}

export function DeleteWebhookWorkerDialog({
  onSubmit,
  className,
  ...props
}: DeleteWebhookWorkerDialogProps) {
  return (
    <DialogContent className="w-fit max-w-[80%] min-w-[500px]">
      <DialogTitle>Delete Webhook Worker?</DialogTitle>
      <DialogHeader></DialogHeader>
      <div className={cn("grid gap-6", className)}>
        <div className="grid gap-4">
          This is a permanent action. Are you sure you want to delete this
          webhook worker?
          <Button
            onClick={() => {
              onSubmit();
            }}
          >
            {props.isLoading && <Spinner />}
            Delete
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
