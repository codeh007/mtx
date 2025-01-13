

// const loaderOptions ={
//   isDev: false,
//   basePath: "/mtmaiui",
//   manifest: "/mtmaiui/.vite/manifest.json",
//   // entrySrcName: "/src/entry-client.tsx",
// }

interface ManifestEntry {
  file: string;
  isEntry?: boolean;
  imports?: string[];
  css?: string[];
}

interface Manifest {
  [key: string]: ManifestEntry;
}


/**
 * 加载 mtmaiui 客户端
 * @param {LoadMtmaiuiClientAppOptions} options - 配置选项
 * @returns {Promise<void>}
 */
// export async function loadMtmaiuiClientApp(options: typeof loaderOptions) {
//   // console.log("import.meta", import.meta);
//   const {isDev} = options;
//   if (isDev) {
//     try {
//       // 1. 加载 Vite 客户端
//       const viteClientScript = document.createElement("script");
//       viteClientScript.src = import.meta.resolve("/@vite/client");
//       viteClientScript.type = "module";
//       await new Promise((resolve, reject) => {
//         viteClientScript.onload = resolve;
//         viteClientScript.onerror = (e) =>
//           reject(new Error(`Vite client 加载失败: ${e.message}`));
//         document.head.appendChild(viteClientScript);
//       });
//       console.log("Vite client 加载完成");

//       // 2. 加载 React 刷新运行时
//       const reactRefreshScript = document.createElement("script");
//       reactRefreshScript.type = "module";
//       reactRefreshScript.textContent = `
//         import RefreshRuntime from "${import.meta.resolve("/@react-refresh")}"
//         RefreshRuntime.injectIntoGlobalHook(window)
//         window.$RefreshReg$ = () => {}
//         window.$RefreshSig$ = () => (type) => type
//         window.__vite_plugin_react_preamble_installed__ = true
//       `;
//       document.head.appendChild(reactRefreshScript);

//       // 等待一小段时间确保 React refresh 初始化完成
//       await new Promise((resolve) => setTimeout(resolve, 100));

//       // 3. 加载入口文件
//       // console.log("开始加载入口文件...");
//       // const entryScript = document.createElement("script");
//       // entryScript.src = import.meta.resolve(options.entrySrcName);
//       // entryScript.type = "module";
//       // await new Promise((resolve, reject) => {
//       //   entryScript.onload = () => {
//       //     console.log("入口文件加载完成");
//       //     resolve(void 0);
//       //   };
//       //   entryScript.onerror = (e) =>
//       //     reject(new Error(`入口文件加载失败: ${e.message}`));
//       //   document.body.appendChild(entryScript);
//       // });
//     } catch (error) {
//       console.error("加载过程中发生错误:", error);
//     }
//     return;
//   }
//   //生产环境的路径
//   const uri = new URL(options.manifest, window.location.href);
//   console.log("uri", uri);
  
//   const response = await fetch(uri);
//   const data = await response.json();
//   console.log("manifest", options.manifest, data);
//   //TODO: 生产环境加载
//   console.log("开始加载生产环境脚本...TODO");
// }


/**
 * 
 * <script type="module">
  import { MTMAIUILoader } from '/mtmaiui/mtmaiui_loader.js';

  const loader = new MTMAIUILoader('https://colab-3600.yuepa8.com/mtmaiui');
  loader.load().catch(console.error);
</script>
 * 
 */
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

  async load() {
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
}

if(typeof window !== "undefined"){
  const loader = new MTMAIUILoader('/mtmaiui');
  loader.load().catch(console.error);
}
