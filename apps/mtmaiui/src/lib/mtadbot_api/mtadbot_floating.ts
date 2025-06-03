"use client";

import { useEffect } from "react";

/**
 * 悬浮窗相关api
 */
export const MtadbotConsts = {
  DefaultSingBoxProfileName: "default",
};

export interface MtadbotFloatingApi {
  closeWindow: () => Promise<string>;
  toggleWindowToolbar: () => Promise<string>;
  //拖拽相关
  startDrag: (x: number, y: number) => void;
  moveDrag: (x: number, y: number) => void;
  endDrag: () => void;
}

export function isInMtAdbotFloating(): boolean {
  // @ts-ignore
  return typeof window !== "undefined" && window.floatingWindow;
}

export function getMtAdbotFloatingApi(): MtadbotFloatingApi {
  if (typeof window === "undefined") {
    // return null;
    throw new Error("window is undefined");
  }
  // @ts-ignore
  if (!window.floatingWindow) {
    // return null;
    throw new Error("floatingWindow is undefined");
  }
  //@ts-ignore
  return window.floatingWindow as unknown as MtadbotFloatingApi;
}

// 自定义Hook用于添加拖拽功能
export const useDragWindow = (ref) => {
  useEffect(() => {
    const element = ref.current;
    if (!isInMtAdbotFloating() || !element) return;

    const { startDrag, moveDrag, endDrag } = getMtAdbotFloatingApi();
    let isMouseDown = false;

    // 触摸开始处理函数
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (startDrag) {
        startDrag(touch.clientX, touch.clientY);
      }
    };

    // 触摸移动处理函数
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (moveDrag) {
        moveDrag(touch.clientX, touch.clientY);
      }
    };

    // 触摸结束处理函数
    const handleTouchEnd = (e) => {
      e.preventDefault();
      if (endDrag) {
        endDrag();
      }
    };

    // 鼠标按下处理函数
    const handleMouseDown = (e) => {
      e.preventDefault();
      isMouseDown = true;
      if (startDrag) {
        startDrag(e.clientX, e.clientY);
      }
    };

    // 鼠标移动处理函数
    const handleMouseMove = (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      if (moveDrag) {
        moveDrag(e.clientX, e.clientY);
      }
    };

    // 鼠标松开处理函数
    const handleMouseUp = (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      isMouseDown = false;
      if (endDrag) {
        endDrag();
      }
    };

    // 添加事件监听器
    element.addEventListener("touchstart", handleTouchStart, { passive: false });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });
    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // 设置鼠标样式
    element.style.cursor = "move";

    // 清理函数
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref]);
};
