import BundleAnalyzerPlugin from "@next/bundle-analyzer";
const mode = process.env.BUILD_MODE ?? "standalone";
const disableChunk = !!process.env.DISABLE_CHUNK || mode === "export";
const distDir = process.env.NEXT_BUILD_OUTPUT ?? ".next";
console.log(`NEXTJS (mtmaiui)===================================
mode : ${mode} output: ${distDir} disableChunk ${disableChunk}`);
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 提示： 当 reactStrictMode 为 true，组件会渲染两次。
  //       见文档：https://stackoverflow.com/questions/71847778/why-my-nextjs-component-is-rendering-twice
  reactStrictMode: false,
  transpilePackages: ["mtmaiapi", "mtmaiui"],
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

  // outputFileTracingRoot: path.join(__dirname, "../../"),

  experimental: {
    optimizePackageImports: ["icon-library"],
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

    if (!isServer) {
      // 为独立应用设置 library 配置
      if (process.env.BUILD_TARGET === "widget") {
        config.output.library = "DashApp";
        config.output.libraryTarget = "umd";
        config.output.globalObject = "this";
      }
    }
    return config;
  },

  serverExternalPackages: [
    "@prisma/client",
    "clone-deep",
    "puppeteer-core",
    "puppeteer",
    "merge-deep",
    "puppeteer-extra",
    "puppeteer-extra-plugin-stealth",
    "puppeteer-extra-plugin-recaptcha",
    "cross-fetch",
    "node-fetch",
    "puppeteer-extra-plugin-devtools",
    "puppeteer-extra-plugin-stealth",
    "puppeteer-extra-plugin-session",
    "@puppeteer",
    "turndown",
    "linkedom",
    "cloudflare:sockets",
    "cloudflare",
    "cosmiconfig",
    "inngest",
    "llamaindex",
    "onnxruntime-node",
    "canvas",
    "@xenova",
    "tiktoken",
    "unpdf",
    "agent-base",
    "basic-ftp",
  ],
};

const withBundleAnalyzer = BundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === "true",
});
// export default nextConfig;
export default withBundleAnalyzer(nextConfig);
