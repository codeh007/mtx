"use client";

import { useWorkbenchStore } from "mtmaiui/stores/workbrench.store";
import { useEffect } from "react";

export default function SiteAutoPage(props: {
  params: { id: string };
}) {
  const setShowWorkbench = useWorkbenchStore((x) => x.setShowWorkbench);
  const showWorkbench = useWorkbenchStore((x) => x.openWorkbench);

  const openChat = useWorkbenchStore((x) => x.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);

  const setThreadId = useWorkbenchStore((x) => x.setThreadId);

  useEffect(() => {
    if (showWorkbench) {
      setShowWorkbench(false);
    }
  }, [showWorkbench, setShowWorkbench]);

  useEffect(() => {
    if (!openChat) {
      setOpenChat(true);
    }
  }, [setOpenChat, openChat]);

  useEffect(() => {
    if (props.params?.id) {
      setThreadId(props.params?.id);
    }
  }, [props.params, setThreadId]);

  return null;
}
