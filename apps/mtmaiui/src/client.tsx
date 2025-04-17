"use client";
import { createRoot } from "react-dom/client";
import { PlaygroundApp } from "./components/cloudflare-agents/playground-client";
import "./styles/globals.css";
const root = createRoot(document.getElementById("app")!);

root.render(
  <div>
    <div className="bg-neutral-50 text-base text-neutral-900 antialiased transition-colors selection:bg-blue-700 selection:text-white dark:bg-neutral-950 dark:text-neutral-100">
      {/* <Chat /> */}
      <PlaygroundApp />
    </div>
  </div>,
);
