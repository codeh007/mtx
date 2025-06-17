import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    __dirname: '""',
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@mtmaiui": path.resolve(__dirname, "./src"),
      mtmaiapi: path.resolve(__dirname, "../../packages/mtmaiapi/src"),
      mtxuilib: path.resolve(__dirname, "../../packages/mtxuilib/src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/tests/integration/**', // 排除 Playwright 集成测试
    ],
  },
});
