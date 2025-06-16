"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    mtmadbot: {
      broadcast: (action: string) => boolean;
      openFloatWindow: (url: string, type: string) => string;
      stopFloatingWindowService: () => void;
      getInfo: () => string;
      toast: (message: string) => void;
      openSingbox: () => void;
      addSangBoxProfile: (profileName: string, profileUrl: string) => string;
      activateNetworkProfile: (profileName: string) => string;
      shell: (command: string) => string;
      closeMainActivity: () => void;
      closeFloatWindow: () => string;
      enableAdbWifi: () => string;
      isVpnServiceRunning: () => boolean;
    };
    floatingWindow: {
      closeWindow: () => string;
      toggleWindowToolbar: () => string;
      getWindowToolbarVisibility: () => string;
      //拖拽相关
      startDrag: (x: number, y: number) => void;
      moveDrag: (x: number, y: number) => void;
      endDrag: () => void;
      // 窗口操作相关
      isViewVisible: () => string;
      setViewVisible: (visible: boolean) => string;
      setViewAsNormal: () => string;
    };
  }
}

export function isInWebview(): boolean {
  return typeof window !== "undefined" && !!window.mtmadbot;
}
export function isInMtAdbotService(): boolean {
  return typeof window !== "undefined" && !!window.floatingWindow;
}

export function getAndroidApi(): Window["mtmadbot"] {
  if (typeof window === "undefined") {
    throw new Error("window is undefined");
  }
  if (!window.mtmadbot) {
    throw new Error("mtmadbot is undefined");
  }
  return window.mtmadbot;
}

// export function deviceCloseMainActivity() {
//   window.mtmadbot.broadcast("io.nekohasekai.sfa.ACTION_FINISH_ACTIVITY");
// }

// 自定义Hook用于添加拖拽功能
export const useDragWindow = (ref) => {
  useEffect(() => {
    const element = ref.current;
    if (!window.floatingWindow) return;
    if (!element) return;

    let isMouseDown = false;
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (window.floatingWindow.startDrag) {
        window.floatingWindow.startDrag(touch.clientX, touch.clientY);
      }
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (window.floatingWindow.moveDrag) {
        window.floatingWindow.moveDrag(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      if (window.floatingWindow.endDrag) {
        window.floatingWindow.endDrag();
      }
    };
    const handleMouseDown = (e) => {
      e.preventDefault();
      isMouseDown = true;
      if (window.floatingWindow.startDrag) {
        window.floatingWindow.startDrag(e.clientX, e.clientY);
      }
    };
    const handleMouseMove = (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      if (window.floatingWindow.moveDrag) {
        window.floatingWindow.moveDrag(e.clientX, e.clientY);
      }
    };
    const handleMouseUp = (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      isMouseDown = false;
      if (window.floatingWindow.endDrag) {
        window.floatingWindow.endDrag();
      }
    };
    element.addEventListener("touchstart", handleTouchStart, { passive: false });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });
    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    element.style.cursor = "move";

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
