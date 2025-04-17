// import { nodePolyfills } from '@vitejs/plugin-node';
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    cloudflare(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    // nodePolyfills(), // 添加这个插件
  ],
  define: {
    __dirname: '""', // 或者使用 process.cwd() 的路径
  },
  resolve: {
    alias: {
      // "@": path.resolve(__dirname, "./src"),
      mtmaiapi: path.resolve(__dirname, "../../packages/mtmaiapi/src"),
      mtxuilib: path.resolve(__dirname, "../../packages/mtxuilib/src"),
      // mtxuilib: "../packages/mtxuilib/src",
    },
  },
});
