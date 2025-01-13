// src/lib/mtmaiui_loader.ts
async function loadMtmaiuiClientApp(options) {
  const { isDev } = options;
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
    } catch (error) {
      console.error("加载过程中发生错误:", error);
    }
    return;
  }
  const uri = new URL(options.manifest, window.location.href);
  console.log("uri", uri);
  const response = await fetch(uri);
  const data = await response.json();
  console.log("manifest", options.manifest, data);
  console.log("开始加载生产环境脚本...TODO");
}

class MTMAIUILoader {
  baseUrl;
  manifest = null;
  constructor(baseUrl) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  }
  async init() {
    const manifestUrl = `${this.baseUrl}.vite/manifest.json`;
    const response = await fetch(manifestUrl);
    this.manifest = await response.json();
  }
  async loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.type = "module";
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  async loadCSS(url) {
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  }
  async load() {
    if (!this.manifest) {
      await this.init();
    }
    const entryPoint = Object.entries(this.manifest).find(([_2, entry2]) => entry2.isEntry);
    if (!entryPoint) {
      throw new Error("No entry point found in manifest");
    }
    const [_, entry] = entryPoint;
    if (entry.css) {
      await Promise.all(entry.css.map((css) => this.loadCSS(`${this.baseUrl}${css}`)));
    }
    await this.loadScript(`${this.baseUrl}${entry.file}`);
  }
}
if (typeof window !== "undefined") {
  console.log("加强脚本V2");
  const loader = new MTMAIUILoader("/mtmaiui");
  loader.load().catch(console.error);
}
export {
  loadMtmaiuiClientApp,
  MTMAIUILoader
};
