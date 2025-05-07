import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MyraVideoLib",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"],
    },
    minify: false,
    rollupOptions: {
      output: {},
    },
  },
});
