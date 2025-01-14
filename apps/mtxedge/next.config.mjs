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

    // 演示将 chunk 文件名改为特定名称
    // config.optimization.splitChunks = {
    //   cacheGroups: {
    //     testLazy: {
    //       // 匹配 TestLazy2 组件的路径
    //       test: /[\\/]components[\\/]TestLazy2/,
    //       name: 'test-lazy222',  // 这将是输出的文件名前缀
    //       chunks: 'async',    // 只处理异步加载的代码
    //       enforce: true       // 强制创建这个chunk
    //     },
    //   },
    // }
    /*
      自定义 chunk 文件名生成规则
      提示:
          - 在代码中使用"webpackChunkName"魔法注释,可以指定 chunck 名称
          - 
    */
    config.output.chunkFilename = (pathData) => {
      // 特定脚本则使用无哈希的文件名, 可以明确url路径,方便自定义加载
      if (pathData.chunk.name === "test-lazy2") {
        return "static/chunks/test-lazy222.js";
      }
      if (pathData.chunk.name === "dashapp") {
        return "static/chunks/dashapp.js";
      }

      // 其他 chunks 保持原有的命名方式（带哈希）
      return "static/chunks/[name].[contenthash].js";
      // return config.output.chunkFilename
    };

    return config;
  },
};

export default nextConfig;
