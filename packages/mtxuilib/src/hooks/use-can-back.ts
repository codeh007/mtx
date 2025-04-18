"use client";

import { useEffect, useState } from "react";

export function useCanGoBack() {
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  return canGoBack;
}
