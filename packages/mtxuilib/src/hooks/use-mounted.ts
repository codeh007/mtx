import * as React from "react";
import { useEffect } from "react";

export function useMounted() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function useMountedEffect(effect: React.EffectCallback) {
  const mounted = useMounted();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(effect, [mounted]);
}
