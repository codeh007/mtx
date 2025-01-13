interface ManifestEntry {
  file: string;
  isEntry?: boolean;
  imports?: string[];
  css?: string[];
}

interface Manifest {
  [key: string]: ManifestEntry;
}

export class MTMAIUILoader {
  private baseUrl: string;
  private manifest: Manifest | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  async init() {
    // 加载 manifest.json
    const manifestUrl = `${this.baseUrl}.vite/manifest.json`;
    const response = await fetch(manifestUrl);
    this.manifest = await response.json();
  }

  private async loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.type = 'module';
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private async loadCSS(url: string): Promise<void> {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  }

  //加载生产环境的脚本
  async loadLoadProduction() {
    if (!this.manifest) {
      await this.init();
    }

    // 找到入口文件
    const entryPoint = Object.entries(this.manifest!).find(
      ([_, entry]) => entry.isEntry
    );

    if (!entryPoint) {
      throw new Error('No entry point found in manifest');
    }

    const [_, entry] = entryPoint;

    // 加载 CSS
    if (entry.css) {
      await Promise.all(
        entry.css.map((css) => this.loadCSS(`${this.baseUrl}${css}`))
      );
    }

    // 加载主脚本
    await this.loadScript(`${this.baseUrl}${entry.file}`);
  }

  //加载开发环境的脚本
  async loadLoadDevelopment(viteServerUrl: string, entrySrcName="/src/entry-client.tsx") {
      // 加载 Vite 客户端
    const viteClientScript = document.createElement("script");
    viteClientScript.src = import.meta.resolve(`${viteServerUrl}/@vite/client`);
    viteClientScript.type = "module";
    document.head.appendChild(viteClientScript);
    // 加载 React 刷新运行时
    const reactRefreshScript = document.createElement("script");
    reactRefreshScript.type = "module";
    reactRefreshScript.textContent = `
      import RefreshRuntime from "${viteServerUrl}/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    `;
    document.head.appendChild(reactRefreshScript);

    // 等待一小段时间确保 React refresh 初始化完成
    // await new Promise((resolve) => setTimeout(resolve, 100));

    // 加载客户端入口
    const entryScript = document.createElement("script");
    entryScript.src = `${viteServerUrl}${entrySrcName}`
    entryScript.type = "module";
    document.body.appendChild(entryScript);
    return;
  }
}

if(typeof window !== "undefined"){
  const nextJsDevDomains = ["colab-3600.yuepa8.com"];
  const domain = window.location.hostname;
  if (nextJsDevDomains.includes(domain)) {
    //开发环境
    const baseUrl = 'https://colab-6111.yuepa8.com';
    const loader = new MTMAIUILoader(baseUrl);
    loader.loadLoadDevelopment(baseUrl).catch(console.error);
  }else{
    const baseUrl = "/mtmaiui";

    const loader = new MTMAIUILoader(baseUrl);
    loader.loadLoadProduction().catch(console.error);
  }
  
}
