"use client";

import { useCallback } from "react";
import {
  type HubmanInput,
  useWorkbenchStore,
} from "../../../../../stores/workbrench.store";

export const useHumanInput = () => {
  const handleHumanInput = useWorkbenchStore((x) => x.handleHumanInput);

  const handleInput = useCallback((input: HubmanInput) => {
    handleHumanInput(input);
  }, []);
  return { handleInput };
};
