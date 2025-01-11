#!/usr/bin/env node
import { program } from "commander";
import child_process from "node:child_process";
import fs, { mkdirSync } from "node:fs";
import path, { dirname } from "node:path";

import dotenv from "dotenv";

export const exec = (
  command: string,
  options?: child_process.SpawnSyncOptionsWithBufferEncoding & {
    env?;
    logPath?: string;
  },
) => {
  const logFile = options?.logPath;
  let logStream = process.stdout;
  if (logFile) {
    const dirName = dirname(logFile);
    mkdirSync(dirName, { recursive: true });
    //@ts-ignore
    logStream = openSync(logFile, "a");
  }
  return new Promise((resolve, reject) => {
    try {
      const childProcess = child_process.spawn(command, {
        shell: true,
        // stdio: "inherit",
        // stdio: "pipe",
        stdio: [process.stdin, logStream, logStream],
        env: { ...process.env, ...(options?.env || {}) },
        ...options,
      });
      childProcess.on("error", (e) => {
        console.log("error", e);
        reject(e);
      });
      // a.stdout!.on("data",(data)=>{
      //   console.log("on data:", data.toString())
      // })
      childProcess.once("exit", (num) => {
        if (num !== 0) {
          console.log("exe 命令出错,code=", {
            code: num,
            command,
          });
          reject(num);
        } else {
          resolve(num);
        }
      });
    } catch (e) {
      console.log({ message: "[exec error]", error: e, command });
      reject(e);
    }
  });
};

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
  program.command("build").action(async () => {
    const result = await Bun.build({
      entrypoints: ["./src/cli/main.ts"],
      outdir: "./dist",
      target: "node",
      format: "esm",
      minify: true, // default false,
      // external: ["lodash", "react"], // default: []
      // banner: "#!/usr/bin/env node",
    });
    if (!result.success) {
      throw new Error(`bun build 出错: ${result.logs}`);
    }
    await exec("chmod +x dist/main.js");
    console.log("maiaiadmin build  main script success");
    await exec("next build");
    await exec(`rm -rdf /workspace/gomtm/apps/mtmaiadmin/.next/cache `);
    await exec(`rm -rdf /workspace/gomtm/apps/mtmaiadmin/.next/diagnostics `);
    await exec(`rm -rdf /workspace/gomtm/apps/mtmaiadmin/.next/types `);
    // 安装
    // console.log("安装 mtmaiadmin 命令");
    // try {
    //   exec("npm i -g");
    // } catch (e) {
    //   console.log("安装 mtmaiadmin 命令失败", e);
    //   throw e;
    // }



    // 构建tailwindcss 样式
    // console.log("build tailwindcss 样式");
    // await exec(
    //   "bun run tailwindcss -i ./src/styles/globals.css -o ./dist/globals.css",
    // );

    // fs.copyFileSync("./dist/mtmaibot.js", "./public/mtmaibot.js");
    // fs.copyFileSync("./dist/style.css", "./public/style.css");
  });

  // program.command("serve").action(async () => {
  //   try {
  //     const codeRoot = path.resolve(
  //       path.dirname(fileURLToPath(import.meta.url)),
  //       "../",
  //     );
  //     console.log("nextjs 当前目录：", codeRoot);
  //     await exec(`cd ${codeRoot} && bun run next start`);
  //   } catch (e) {
  //     console.error("启动 nextjs (mtmaiadmin) 失败", e);
  //   }
  // });
  program.parse();
})();
