"use client";

import { useEffect } from "react";

export const ExternalAppContainer = () => {
  useEffect(() => {
    // 这里加载外部应用的代码
    const loadExternalApp = async () => {
      try {
        // 示例：动态加载外部应用的脚本
        // const s= import.meta
        // console.log("meta",s)
        const { ExternalApp } = await import("./external-app/index");
        // mount('another-react-app') // 假设外部应用提供了 mount 方法
      } catch (error) {
        console.error("Failed to load external app:", error);
      }
    };

    loadExternalApp();

    // 清理函数
    return () => {
      // 如果需要，在组件卸载时清理外部应用
      try {
        console.log("unmount");
        // const { unmount } = require('external-app/unmount')
        // unmount('another-react-app')
      } catch (error) {
        console.error("Failed to unmount external app:", error);
      }
    };
  }, []);

  return null;
};
