// src/lib/mtmaiui_loader.ts
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
  const loader = new MTMAIUILoader("/mtmaiui");
  loader.load().catch(console.error);
}
export {
  MTMAIUILoader
};
