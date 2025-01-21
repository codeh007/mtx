import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  define: {
    // 添加这个配置来模拟 process.env
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  },
  resolve: {
    alias: {
      // 添加 mtmaiapi 的路径别名
      'mtmaiapi': resolve(__dirname, '../mtmaiapi/src'),
      'mtxuilib': resolve(__dirname, '../mtxuilib/src'),
      'mtmaiui': resolve(__dirname, '../mtmaiui/src'),
    }
  },
  server: {
    port: 6111,
    cors: true, // 启用 CORS
    env: {
      isDev: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  },
  build: {
    manifest: true,
    outDir: "public/mtmaiui_dev",
    base: "/mtmaiui_dev/",
    emptyOutDir: true,
    // base: 'https://your-cdn-domain.com/assistant/',
    rollupOptions: {
      
      input: {
        main: resolve(__dirname, "index.html"),
        loader: resolve(__dirname, "src/lib/mtmaiui_loader.ts"),
      },

      output: {
        format: 'es',
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].[hash].js",
        assetFileNames: "assets/[name].[ext]",
        inlineDynamicImports: false,
        experimentalMinChunkSize: 10000,
        chunkSizeWarningLimit: 1000,
      },
    },
    
    // lib: {
    //   entry: "src/lib/hello123.ts",
    //   name: "hello123",
    //   fileName: "hello123",
    //   formats: ["es"],
    // },
    // overwrite default .html entry
    // input: "src/entry-client.tsx",
  },
});
