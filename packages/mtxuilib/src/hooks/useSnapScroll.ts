"use client";

import { useCallback, useRef } from "react";

export function useSnapScroll() {
  const autoScrollRef = useRef(true);
  /* @ts-ignore*/
  const scrollNodeRef = useRef<HTMLDivElement>();
  /* @ts-ignore*/
  const onScrollRef = useRef<() => void>();
  /* @ts-ignore*/
  const observerRef = useRef<ResizeObserver>();

  const messageRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new ResizeObserver(() => {
        if (autoScrollRef.current && scrollNodeRef.current) {
          const { scrollHeight, clientHeight } = scrollNodeRef.current;
          const scrollTarget = scrollHeight - clientHeight;

          scrollNodeRef.current.scrollTo({
            top: scrollTarget,
          });
        }
      });

      observer.observe(node);
    } else {
      observerRef.current?.disconnect();
      /* @ts-ignore*/
      observerRef.current = undefined;
    }
  }, []);

  const scrollRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      onScrollRef.current = () => {
        const { scrollTop, scrollHeight, clientHeight } = node;
        const scrollTarget = scrollHeight - clientHeight;

        autoScrollRef.current = Math.abs(scrollTop - scrollTarget) <= 10;
      };

      node.addEventListener("scroll", onScrollRef.current);

      scrollNodeRef.current = node;
    } else {
      if (onScrollRef.current) {
        scrollNodeRef.current?.removeEventListener(
          "scroll",
          onScrollRef.current,
        );
      }

      /* @ts-ignore*/
      scrollNodeRef.current = undefined;
      /* @ts-ignore*/
      onScrollRef.current = undefined;
    }
  }, []);

  return [messageRef, scrollRef];
}
