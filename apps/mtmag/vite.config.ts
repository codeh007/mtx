import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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
  environments: {
    mtmag: {
      define: {
        MY_VARIABLE: "MY_VARIABLE9999invite",
      },
    },
  },
  define: {
    __dirname: '""', // 或者使用 process.cwd() 的路径,
    // 添加这个配置来模拟 process.env
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  },
  resolve: {
    alias: {
      // "@": path.resolve(__dirname, "./src"),
      mtmaiapi: path.resolve(__dirname, "../../packages/mtmaiapi/src"),
      mtxuilib: path.resolve(__dirname, "../../packages/mtxuilib/src"),
      // mtxuilib: "../packages/mtxuilib/src",
    },
  },
  build: {
    sourcemap: true,
  },

  // server: {
  //   port: 6111,
  //   cors: true,
  //   env: {
  //     isDev: true,
  //   },
  //   headers: {
  //     "Access-Control-Allow-Origin": "*",
  //     "Cross-Origin-Resource-Policy": "cross-origin",
  //   },
  // },
  // build: {
  //   manifest: true,
  //   outDir: "public/mtmaiui/",
  //   // base: "/mtmaiui/",
  //   rollupOptions: {
  //     input: {
  //       // main: resolve(__dirname, "index.html"),
  //       // main
  //       // loader: resolve(__dirname, "src/lib/mtmaiui_loader.ts"),
  //     },
  //     output: {
  //       // 添加这个配置来控制输出文件的命名
  //       entryFileNames: (chunkInfo) => {
  //         // 如果是 loader 入口，保持原始名称
  //         if (chunkInfo.name === "loader") {
  //           return "mtmaiui_loader.js";
  //         }
  //         return "assets/[name]-[hash].js";
  //       },
  //     },
  //   },
  //   // optimizeDeps: {
  //   //   include: ['react', 'react-dom']
  //   // },
  //   // output: {
  //   //   format: 'es',
  //   //   entryFileNames: "[name].js",
  //   //   chunkFileNames: "chunks/[name].[hash].js",
  //   //   assetFileNames: "assets/[name].[ext]",
  //   //   inlineDynamicImports: false,
  //   //   experimentalMinChunkSize: 10000,
  //   //   chunkSizeWarningLimit: 1000,
  //   // },

  //   // lib: {
  //   //   entry: "src/lib/hello123.ts",
  //   //   name: "hello123",
  //   //   fileName: "hello123",
  //   //   formats: ["es"],
  //   // },
  //   // overwrite default .html entry
  //   // input: "src/entry-client.tsx",
  //   // lib: {
  //   //   // 添加库构建配置
  //   //   entry: resolve(__dirname, "src/lib/mtmaiui_loader.ts"),
  //   //   name: 'mtmaiui_loader',
  //   //   fileName: 'mtmaiui_loader',
  //   //   formats: ['es'],
  //   // },
  // },
});
