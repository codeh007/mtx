"use client";

// export const dynamic = "force-dynamic";

export default function Page() {
  const openChat = useWorkbenchStore((x) => x.uiState.openChat);
  const setOpenChat = useWorkbenchStore((x) => x.setOpenChat);

  // useEffect(() => {
  //   if (!openChat) {
  //     setOpenChat(true);
  //   }
  // }, [setOpenChat, openChat]);

  return <>chat home page</>;
}
