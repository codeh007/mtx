import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import path from "node:path";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	// const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [react()],
		define: {
			"process.env": {},
		},
		css: {
			postcss: {
				plugins: [tailwindcss, autoprefixer],
			},
		},
		resolve: {
			alias: {
				mtmaiapi: path.resolve(__dirname, "../../packages/mtmaiapi/src"),
				mtxuilib: path.resolve(__dirname, "../../packages/mtxuilib/src"),
				mtmeditor: path.resolve(__dirname, "../../packages/mtmeditor/src"),
			},
		},
		build: {
			lib: {
				entry: path.resolve(__dirname, "src/main.tsx"),
				name: "MtmaiBot",
				// fileName: (format) => `mtmaibot.${format}.js`,
				fileName: (format) => "mtmaibot.js",
				formats: ["iife"], // 使用 IIFE 格式
			},
			// outDir: "dist",
			// rollupOptions: {
			// 	external: [], // 不排除任何依赖
			// },
			// minify: "terser",
			// sourcemap: false,
		},
		// optimizeDeps: {
		// 	include: ["react", "react-dom"], // 确保这些依赖被包含在构建中
		// },
		// define: {
		// 	// 只在开发模式下定义环境变量
		// 	...(mode === "development"
		// 		? {
		// 				"import.meta.env.VITE_BACKENDS": JSON.stringify(env.VITE_BACKENDS),
		// 				"import.meta.env.VITE_ACCESS_TOKEN": JSON.stringify(
		// 					env.VITE_ACCESS_TOKEN,
		// 				),
		// 			}
		// 		: {
		// 				"import.meta.env.VITE_BACKENDS": JSON.stringify(
		// 					env.VITE_BACKENDS || "",
		// 				),
		// 				"import.meta.env.VITE_ACCESS_TOKEN": JSON.stringify(
		// 					env.VITE_ACCESS_TOKEN || "",
		// 				),
		// 			}),
		// },
	};
});
