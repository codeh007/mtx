import { type RefObject, useEffect, useRef } from "react";

export function useScrollToBottom<T extends HTMLElement>(): [RefObject<T>, RefObject<T>] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        // container.scrollIntoView({ behavior: "smooth" });
        end.scrollIntoView({
          // 瞬间滚动到最底部
          // behavior: "instant",
          // 平滑
          behavior: "smooth",

          block: "end",
        });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);
  /* @ts-ignore*/
  return [containerRef, endRef];
}
