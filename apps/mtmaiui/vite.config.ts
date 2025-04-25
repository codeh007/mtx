import path from "node:path";
// import { nodePolyfills } from '@vitejs/plugin-node';
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    cloudflare({
      inspectorPort: 9229,
    }),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    // nodePolyfills(), // 添加这个插件
  ],
  define: {
    __dirname: '""', // 或者使用 process.cwd() 的路径
    // 添加这个配置来模拟 process.env
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  },
  resolve: {
    alias: {
      mtmaiapi: path.resolve(__dirname, "../../packages/mtmaiapi/src"),
      mtxuilib: path.resolve(__dirname, "../../packages/mtxuilib/src"),
    },
  },
  server: {
    port: 6111,
  },
});
