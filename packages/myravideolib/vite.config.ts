import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    open: true, // 自动打开浏览器
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MyraVideoLib",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"],
    },
    minify: false,
  },
});
