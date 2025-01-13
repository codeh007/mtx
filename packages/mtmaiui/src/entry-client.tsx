import { MtmaiFrontApp } from "./MtmaiFrontApp";

const mainApp = new MtmaiFrontApp({
  routerType: "memory",
  mountType: "normal",
});
mainApp.mount();
