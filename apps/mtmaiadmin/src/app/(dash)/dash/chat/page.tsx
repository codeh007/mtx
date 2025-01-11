"use client";
import { useWorkbrenchStore } from "mtmaiui/stores/workbrench.store";

// export const dynamic = "force-dynamic";

export default function Page() {
  const openChat = useWorkbrenchStore((x) => x.uiState.openChat);
  const setOpenChat = useWorkbrenchStore((x) => x.setOpenChat);

  // useEffect(() => {
  //   if (!openChat) {
  //     setOpenChat(true);
  //   }
  // }, [setOpenChat, openChat]);

  return <>chat home page</>;
}
