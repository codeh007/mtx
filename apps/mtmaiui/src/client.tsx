import { createRoot } from "react-dom/client";
// import "./styles.css";
import Chat from "./App3";
import { Providers } from "./components/cloudflare-agents/providers";
import "./styles/globals.css";

const root = createRoot(document.getElementById("app")!);

root.render(
  <Providers>
    <div className="bg-neutral-50 text-base text-neutral-900 antialiased transition-colors selection:bg-blue-700 selection:text-white dark:bg-neutral-950 dark:text-neutral-100">
      <Chat />
    </div>
  </Providers>,
);
