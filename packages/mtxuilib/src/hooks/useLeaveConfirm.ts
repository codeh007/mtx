"use client";

import { useEffect } from "react";

export const useLeaveConfirm = (shouldPreventLeave: boolean) => {
  // const router = useRouter();

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!shouldPreventLeave) return;
      e.preventDefault();
      return (e.returnValue = "");
    };

    const handleBrowseAway = () => {
      if (!shouldPreventLeave) return;

      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?",
        )
      ) {
        return;
      }

      // 阻止导航
      throw new Error("Route change was aborted");
    };

    window.addEventListener("beforeunload", handleWindowClose);
    window.addEventListener("popstate", handleBrowseAway);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      window.removeEventListener("popstate", handleBrowseAway);
    };
  }, [shouldPreventLeave]);
};
