"use client";
import { Slot } from "@radix-ui/react-slot";
import React, { type ComponentProps, useState } from "react";
import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

export const DeleteConformDlg = (props: {
  handleOk: () => void;
}) => {
  const { handleOk } = props;
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Button>删除</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>确认删除</DialogTitle>
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleOk?.();
            }}
          >
            确定删除
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ConformDeleteBtn = React.forwardRef<
  HTMLButtonElement,
  { callback: () => Promise<void> } & ComponentProps<typeof Button>
>(({ callback, className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const [deleteConformOpen, setDeleteConformOpen] = useState(false);
  return (
    <>
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          setDeleteConformOpen(true);
        }}
      />
      {deleteConformOpen && (
        <Dialog open={deleteConformOpen} onOpenChange={setDeleteConformOpen}>
          <DialogContent>
            <DialogTitle>确认</DialogTitle>
            <DialogDescription>将删除记录，确认继续吗？</DialogDescription>
            <Button
              variant={"destructive"}
              onClick={async () => {
                if (callback) {
                  await callback();
                  setDeleteConformOpen(false);
                }
              }}
            >
              删除确认
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                setDeleteConformOpen(false);
              }}
            >
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
});
// ConformDeleteBtn.displayName = "ConformDeleteBtn";
