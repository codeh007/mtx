import type { ComponentProps, PropsWithChildren } from "react";
import { useIsDesktop } from "../hooks/use-media-query";
import { Dialog, DialogContent } from "../ui/dialog";
import { Drawer, DrawerContent } from "../ui/drawer";

interface MtDialogProps extends ComponentProps<typeof Dialog> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}
export function MtDialog(props: React.PropsWithChildren<MtDialogProps>) {
  const { ...restProps } = props;
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return <Dialog {...restProps} />;
  }

  return <Drawer {...restProps} />;
}

export function MtDialogContent(
  props: PropsWithChildren<
    ComponentProps<typeof DialogContent> & ComponentProps<typeof DrawerContent>
  >,
) {
  const isDesktop = useIsDesktop();

  return (
    <>
      {isDesktop && <DialogContent {...props} />}
      {!isDesktop && <DrawerContent {...props} />}
    </>
  );
}
