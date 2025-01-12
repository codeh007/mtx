// src/lib/mtmaiui_loader.ts
var manifest = import.meta.resolve("/.vite/manifest.json");
var entrySrcName = "/src/entry-client.tsx";
async function loadMtmaiuiClientApp(options) {
  console.log("import.meta", import.meta);
  let { isDev } = options;
  if (isDev === undefined && (import.meta.url.includes("localhost") || import.meta.url.includes("127.0.0.1"))) {
    isDev = true;
  }
  if (isDev) {
    try {
      const viteClientScript = document.createElement("script");
      viteClientScript.src = import.meta.resolve("/@vite/client");
      viteClientScript.type = "module";
      await new Promise((resolve, reject) => {
        viteClientScript.onload = resolve;
        viteClientScript.onerror = (e) => reject(new Error(`Vite client 加载失败: ${e.message}`));
        document.head.appendChild(viteClientScript);
      });
      console.log("Vite client 加载完成");
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
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log("开始加载入口文件...");
      const entryScript = document.createElement("script");
      entryScript.src = import.meta.resolve(entrySrcName);
      entryScript.type = "module";
      await new Promise((resolve, reject) => {
        entryScript.onload = () => {
          console.log("入口文件加载完成");
          resolve(undefined);
        };
        entryScript.onerror = (e) => reject(new Error(`入口文件加载失败: ${e.message}`));
        document.body.appendChild(entryScript);
      });
    } catch (error) {
      console.error("加载过程中发生错误:", error);
    }
    return;
  }
  const response = await fetch(manifest);
  const data = await response.json();
  console.log("manifest", manifest, data);
  console.log("开始加载生产环境脚本...TODO");
}
loadMtmaiuiClientApp(false);
export {
  loadMtmaiuiClientApp
};
