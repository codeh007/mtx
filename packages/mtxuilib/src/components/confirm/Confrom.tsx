"use client";

import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../../ui/dialog";
import { useConfirmStore } from "./ConfirmProvider";

export function ConfirmModal() {
  const open = useConfirmStore((x) => x.open);
  const setOpen = useConfirmStore((x) => x.setOpen);
  const onConfirm = useConfirmStore((x) => x.onConfirm);
  const options = useConfirmStore((x) => x.options);
  const values = useConfirmStore((x) => x.values);

  const title = options?.title || "Confirm";
  const message = options?.message || "Are you sure?";
  const confirmText = options?.confirmText || "Confirm";
  const cancelText = options?.cancelText || "Cancel";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{message}</DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            className="min-w-14"
            onClick={() => setOpen(false)}
          >
            {cancelText}
          </Button>
          <Button
            className="min-w-14"
            onClick={() => {
              setOpen(false);
              console.log("onConfirm", values);
              onConfirm?.(values);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
