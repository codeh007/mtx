"use client";

import { useWorkbrenchStore } from "mtmaiui/stores/workbrench.store";

import { useEffect } from "react";

export default function SiteAutoPage(props: {
  params: { id: string };
}) {
  const setShowWorkbench = useWorkbrenchStore((x) => x.setShowWorkbench);
  const showWorkbench = useWorkbrenchStore((x) => x.uiState.openWorkbench);

  const openChat = useWorkbrenchStore((x) => x.uiState.openChat);
  const setOpenChat = useWorkbrenchStore((x) => x.setOpenChat);

  const setThreadId = useWorkbrenchStore((x) => x.setThreadId);

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
