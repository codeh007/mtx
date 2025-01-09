import {} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { exec } from "../lib/exec";

export const buildWithTsc = async () => {
  try {
    // Run TypeScript compiler programmatically
    const tsconfig = path.resolve("./tsconfig.json");
    console.log("tsconfig path:", tsconfig);
    const commandLine = `tsc --outDir dist --jsx react-jsx --incremental false --declaration true --noEmit false --removeComments true --project ${tsconfig}`;
    console.log("(mtxuilib)build tsc", commandLine);
    await exec(commandLine);

    // Copy styles directory recursively using Node.js fs
    const copyDir = (src: string, dest: string) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const entries = fs.readdirSync(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };

    copyDir("src/styles", "dist/styles");
  } catch (e) {
    console.error("执行 compile-migrations 失败", e);
  }
};
