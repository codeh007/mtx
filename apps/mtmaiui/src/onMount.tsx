"use client";

import { Button } from "mtxuilib/ui/button";
import { StrictMode, createContext, useState } from "react";
import { createRoot } from "react-dom/client";

// 独立应用的入口文件
declare global {
  interface Window {
    __POST_APP_STATE__: {
      isAuthenticated: boolean;
      userId: string;
      posts: Array<{ id: string }>;
    };
  }
}

// 创建一个全局的状态管理
const createPostAppStore = () => {
  let listeners: Array<() => void> = [];
  let state = {
    likedPosts: new Set<string>(),
    // 其他状态...
  };

  return {
    getState: () => state,
    setState: (newState: typeof state) => {
      state = newState;
      // biome-ignore lint/complexity/noForEach: <explanation>
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };
};
// 创建全局单例store
const store = createPostAppStore();

// (实验)使用 Context 在所有按钮实例间共享状态
const ActionContext = createContext(null);
const ActionProvider = ({ children }) => {
  const [state, setState] = useState({});
  return (
    <ActionContext.Provider value={{ state, setState }}>
      {children}
    </ActionContext.Provider>
  );
};
const PageActions = () => {
  const [count, setCount] = useState(4);
  return (
    <>
      <Button
        onClick={() => {
          console.log("click", count);
          setCount((pre) => pre + 1);
        }}
      >
        HelloPageActions{count}
      </Button>
    </>
  );
};

export function onMount() {
  if (typeof window !== "undefined") {
    const pageActions = document.getElementById("page-actions");
    if (pageActions) {
      const root = createRoot(pageActions);
      root.render(
        <StrictMode>
          <PageActions />
        </StrictMode>,
      );
    }
  }
}
