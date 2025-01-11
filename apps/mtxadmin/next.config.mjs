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

  // webpack: (
  // 	config,
  // 	{ buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  // ) => {
  // 	// config.ignoreWarnings = [
  // 	// 	{ module: /node_modules\/@radix-ui\/react-select/ },
  // 	// ];
  // 	// add externals
  // 	config.externals = config.externals || [];
  // 	config.externals.push(
  // 		"puppeteer-extra",
  // 		"puppeteer-extra-plugin-stealth",
  // 		"puppeteer-extra-plugin-adblocker",
  // 		"puppeteer-extra-plugin-block-resources",
  // 		"puppeteer-extra-plugin-devtools",
  // 		"puppeteer-extra-plugin-stealth",
  // 		"puppeteer-extra-plugin-recaptcha",
  // 		"puppeteer-extra-plugin-session",
  // 		"@puppeteer",
  // 		"turndown",
  // 		"linkedom",
  // 		"cloudflare:sockets",
  // 		"cloudflare",
  // 		"onnxruntime-node",
  // 		"cosmiconfig",
  // 		"inngest",
  // 		"canvas",
  // 		"onnxruntime-node",
  // 		"@xenova",
  // 		"tiktoken",
  // 		"unpdf",
  // 		"agent-base",
  // 		"basic-ftp",
  // 	);
  // 	return config;
  // },

  // serverExternalPackages: [
  //   "@prisma/client",
  //   "clone-deep",
  //   "puppeteer-core",
  //   "puppeteer",
  //   "merge-deep",
  //   "puppeteer-extra",
  //   "puppeteer-extra-plugin-stealth",
  //   "puppeteer-extra-plugin-recaptcha",
  //   "cross-fetch",
  //   "node-fetch",
  //   "puppeteer-extra-plugin-devtools",
  //   "puppeteer-extra-plugin-stealth",
  //   "puppeteer-extra-plugin-session",
  //   "@puppeteer",
  //   "turndown",
  //   "linkedom",
  //   "cloudflare:sockets",
  //   "cloudflare",
  //   "cosmiconfig",
  //   // "inngest",
  //   "llamaindex",
  //   "onnxruntime-node",
  //   "canvas",
  //   "@xenova",
  //   "tiktoken",
  //   "unpdf",
  //   // "agent-base",
  //   "basic-ftp",
  // ],

  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     /** *******************************************************************************
  //      * 这个配置目的是 额外打包一个 example-entry 纯客户端入口
  //      * 让第三方站点以 <script src="https://example.com/example-entry.js"></script> 方式引入
  //      **********************************************************************************/
  //     const originalEntry = config.entry;
  //     config.entry = async () => {
  //       const originalEntries = await originalEntry();
  //       return {
  //         ...originalEntries,
  //         "example-entry": [join(__dirname, "src/entry-client.tsx")],
  //       };
  //     };

  //     // 配置代码分割
  //     config.optimization = {
  //       ...config.optimization,
  //       splitChunks: {
  //         chunks: "all",
  //         cacheGroups: {
  //           // 复用已有的公共模块
  //           commons: {
  //             test: /[\\/]node_modules[\\/]/,
  //             name: "vendors",
  //             chunks: "all",
  //           },
  //           // 大型依赖单独分包
  //           defaultVendors: {
  //             test: /[\\/]node_modules[\\/](react|react-dom|@monaco-editor)[\\/]/,
  //             name(module) {
  //               const packageName = module.context.match(
  //                 /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
  //               )[1];
  //               return `vendor.${packageName.replace("@", "")}`;
  //             },
  //             priority: 10,
  //             chunks: "all",
  //           },
  //         },
  //       },
  //     };

  //     // 配置输出
  //     const originalFilename = config.output.filename;
  //     config.output = {
  //       ...config.output,
  //       filename: (pathData) => {
  //         if (pathData.chunk.name === "example-entry") {
  //           return "static/js/[name].js";
  //         }
  //         return typeof originalFilename === "function"
  //           ? originalFilename(pathData)
  //           : originalFilename;
  //       },
  //       chunkFilename: "static/js/[name].[chunkhash].js",
  //       library: {
  //         type: "umd",
  //         name: "ExampleApp",
  //       },
  //     };
  //   }
  //   return config;
  // },

  async headers() {
    return [
      {
        source: "/:path*",
        //webcontainer 跨域问题
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
