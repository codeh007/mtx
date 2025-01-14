#!/usr/bin/env node
import { program } from "commander";
import { fileURLToPath } from 'node:url'
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import vite from "vite";
// import { buildWithTsc } from "./build_tsc";
// import { buildWithViteBuild } from "./build_vite";
// import { compileMigrations } from "./compile-migrations";

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const envFiles = ["../../env/dev.env", "./env/dev.env", ".env"];
function loadEnv() {
  // biome-ignore lint/complexity/noForEach: <explanation>
  envFiles.forEach((envFile) => {
    if (fs.existsSync(envFile)) {
      const envPath = path.resolve(envFile);
      const dotenvConfig = dotenv.config({
        path: envPath,
      });
      if (dotenvConfig.error) {
        throw new Error("parse env error", dotenvConfig.error);
      }
    }
  });
}
(async () => {
  await loadEnv();
  program.command("build_mtmaiui").action(async () => {
    console.log("(build_mtmaiui)", import.meta.url);

    // const projectDir = path.resolve(__dirname, "../../../packages/mtmaiui");
    // await vite.build({
    //   configFile: path.resolve(projectDir, "vite.config.js"),
    // });
  });

  // program.command("gen").action(async () => {
  //   try {
  //     await exec("drizzle-kit generate");
  //     await compileMigrations();
  //   } catch (e) {
  //     console.error("执行 compile-migrations 失败", e);
  //     process.exit(1);
  //   }
  // });
  // program.command("dp_workflow").action(async () => {
  //   try {
  //     const codeRoot = path.resolve(
  //       path.dirname(fileURLToPath(import.meta.url)),
  //       "../",
  //     );
  //     const cmd = `cd ${codeRoot} && bun run dp_workflow`;
  //     console.log("执行命令：", cmd);
  //     await exec(cmd);
  //   } catch (e) {
  //     console.error("执行 dp_workflow 失败", e);
  //     process.exit(1);
  //   }
  // });
  program.parse();
})();
