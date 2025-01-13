import type { Manifest } from 'vite';
export class MTMAIUILoader {
  private baseUrl: string;
  private manifest: Manifest | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  async init() {
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
  async loadProduction() {
    if (!this.manifest) {
      await this.init();
    }
    if(!this.manifest) throw new Error("manifest is null");
    // 找到入口文件
    const entryPoint = Object.entries(this.manifest).find(
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
    await this.loadScript(`${this.baseUrl}${entry.file}`);
  }

  //加载开发环境的脚本
  async loadLoadDevelopment(viteServerUrl: string, entrySrcName="/src/entry-client.tsx") {
    // css
    const cssSrc="/src/styles/globals.css"
    this.loadCSS(`${viteServerUrl}${cssSrc}`);
    // 加载 Vite 客户端
    await import(`${viteServerUrl}/@vite/client`);
    const RefreshRuntime = (await import(`${viteServerUrl}/@react-refresh`)).default;
    RefreshRuntime.injectIntoGlobalHook(window);
    //@ts-ignore
    window.$RefreshReg$ = () => {};
    //@ts-ignore
    window.$RefreshSig$ = () => (type) => type;
    //@ts-ignore
    window.__vite_plugin_react_preamble_installed__ = true;
    // 应用入口
    await import(`${viteServerUrl}${entrySrcName}`);
    
    await this.loadCSS(`${viteServerUrl}/${cssSrc}`);
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
    loader.loadProduction().catch(console.error);
  }
}
