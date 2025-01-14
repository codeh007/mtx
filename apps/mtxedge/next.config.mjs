import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
// 获取当前文件的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mode = process.env.BUILD_MODE ?? "standalone";
const disableChunk = !!process.env.DISABLE_CHUNK || mode === "export";
const distDir = process.env.NEXT_BUILD_OUTPUT ?? ".next";
console.log(`nextjs (mtmaiadmin)===================================
mode : ${mode}, output: ${distDir}, disableChunk ${disableChunk}`);
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 提示： 当 reactStrictMode 为 true，组件会渲染两次。
  //       见文档：https://stackoverflow.com/questions/71847778/why-my-nextjs-component-is-rendering-twice
  reactStrictMode: false,
  experimental: {
    // ppr: "incremental",
  },
  transpilePackages: [
    "@bufbuild/protobuf",
    "@connectrpc/connect",
    "@connectrpc/connect-web",
    "mtxuilib",
    "mtmaiapi",
    "mtmaiui",
  ],
  sassOptions: {
    includePaths: [path.join("styles"), path.join("src/styles")],
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
    ],
  },

  // output: mode,
  // ...(mode === "standalone" && {
  // 	outputFileTracingRoot: path.join("../../"),
  // }),
  // outputFileTracingIncludes: {
  // 	"/api/hello": ["./un-necessary-folder/**/*"],
  // },
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  distDir: distDir, //输出路径
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    // add externals
    config.externals = config.externals || [];
    config.externals.push(
      "puppeteer-extra",
      "puppeteer-extra-plugin-stealth",
      "puppeteer-extra-plugin-adblocker",
      "puppeteer-extra-plugin-block-resources",
      "puppeteer-extra-plugin-devtools",
      "puppeteer-extra-plugin-stealth",
      "puppeteer-extra-plugin-recaptcha",
      "puppeteer-extra-plugin-session",
      "@puppeteer",
      "turndown",
      "linkedom",
      "cloudflare:sockets",
      "cloudflare",
      "onnxruntime-node",
      "cosmiconfig",
      "inngest",
      "canvas",
      "onnxruntime-node",
      "@xenova",
      "tiktoken",
      "unpdf",
      "agent-base",
      "basic-ftp",
    );
    if (nextRuntime === "edge") {
      config.externals.push("pg");
    }
  },
};

export default nextConfig;
