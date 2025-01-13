'use client'

import { createRoot } from "react-dom/client";
import { App } from "./App";



if (typeof window !== "undefined") {
    console.log("App.tsx");
    const rootElement = document.getElementById("gomtm-runtime-container");
    if (rootElement) {
      //TODO: 需要加载独立的 应用, 还需要正确处理 相关的 Provider
      createRoot(rootElement).render(<App />);
    }
  }
  