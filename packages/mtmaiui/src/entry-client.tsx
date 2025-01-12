import { MtmaiFrontApp } from "./lib/index.ts--";
const mainApp = new MtmaiFrontApp({
  routerType: "memory",
  mountType: "normal",
});
mainApp.mount();
