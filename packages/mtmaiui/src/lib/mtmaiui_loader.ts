// const basePath = "/mtmaiui";
// const manifest = import.meta.resolve(`${basePath}/.vite/manifest.json`);
// const entrySrcName = "/src/entry-client.tsx";

const loaderOptions ={
  isDev: false,
  basePath: "/mtmaiui",
  manifest: "/mtmaiui/.vite/manifest.json",
  entrySrcName: "/src/entry-client.tsx",
}

// interface LoadMtmaiuiClientAppOptions {
//   isDev?: boolean;
// }

/**
 * 加载 mtmaiui 客户端
 * @param {LoadMtmaiuiClientAppOptions} options - 配置选项
 * @returns {Promise<void>}
 */
export async function loadMtmaiuiClientApp(options: typeof loaderOptions) {
  console.log("import.meta", import.meta);
  let { isDev } = options;
  if (
    isDev === undefined &&
    (import.meta.url.includes("localhost") ||
      import.meta.url.includes("127.0.0.1"))
  ) {
    isDev = true;
  }
  if (isDev) {
    try {
      // 1. 加载 Vite 客户端
      const viteClientScript = document.createElement("script");
      viteClientScript.src = import.meta.resolve("/@vite/client");
      viteClientScript.type = "module";
      await new Promise((resolve, reject) => {
        viteClientScript.onload = resolve;
        viteClientScript.onerror = (e) =>
          reject(new Error(`Vite client 加载失败: ${e.message}`));
        document.head.appendChild(viteClientScript);
      });
      console.log("Vite client 加载完成");

      // 2. 加载 React 刷新运行时
      const reactRefreshScript = document.createElement("script");
      reactRefreshScript.type = "module";
      reactRefreshScript.textContent = `
        import RefreshRuntime from "${import.meta.resolve("/@react-refresh")}"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
      `;
      document.head.appendChild(reactRefreshScript);

      // 等待一小段时间确保 React refresh 初始化完成
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. 加载入口文件
      console.log("开始加载入口文件...");
      const entryScript = document.createElement("script");
      entryScript.src = import.meta.resolve(options.entrySrcName);
      entryScript.type = "module";
      await new Promise((resolve, reject) => {
        entryScript.onload = () => {
          console.log("入口文件加载完成");
          resolve(void 0);
        };
        entryScript.onerror = (e) =>
          reject(new Error(`入口文件加载失败: ${e.message}`));
        document.body.appendChild(entryScript);
      });
    } catch (error) {
      console.error("加载过程中发生错误:", error);
    }
    return;
  }
  //生产环境的路径
  const uri = new URL(options.manifest, window.location.href);
  const response = await fetch(uri);
  const data = await response.json();
  console.log("manifest", options.manifest, data);
  //TODO: 生产环境加载
  console.log("开始加载生产环境脚本...TODO");
}

// 根据url判断是否生成环境
function IsProduction() {
  const protocol = window.location.protocol;
  // const host = window.location.host;
  // const url = `${protocol}//${host}`;
  return protocol === "https:"
}
loadMtmaiuiClientApp(loaderOptions);
