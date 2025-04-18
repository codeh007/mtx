import {} from "node:child_process";
import { exec } from "../lib/exec";

export async function buildWithViteBuild() {
  try {
    await exec("vite build --logLevel warn --emptyOutDir=false");
  } catch (e) {
    console.error("执行 vite build 失败", e);
    throw e;
  }
}
