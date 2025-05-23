"use client";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Spinner } from "./mtloading";

interface ConfirmDialogProps {
  title: string;
  description: React.ReactNode;

  submitLabel: string;
  cancelLabel?: string;
  className?: string;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isOpen: boolean;
}

export function ConfirmDialog({
  className,
  title,
  description,
  submitLabel,
  cancelLabel = "Cancel",
  isOpen,
  ...props
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="w-fit max-w-[80%] min-w-[500px]">
        <DialogTitle>{title}</DialogTitle>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="text-sm text-foreground mb-4">{description}</div>
          <div className="flex flex-row gap-4 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                props.onCancel();
              }}
            >
              {cancelLabel}
            </Button>
            <Button onClick={props.onSubmit}>
              {props.isLoading && <Spinner />}
              {submitLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
