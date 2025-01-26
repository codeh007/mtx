import { execSync } from "node:child_process";
import os from "node:os";
export async function setupOsUser(userName: string, password: string) {
  await exec(`echo "${userName}:${password}" | sudo chpasswd`);
}

export async function isUbuntu() {
  return (
    execSync("lsb_release -d")
      .toString()
      .toLocaleLowerCase()
      .indexOf("ubuntu") > 0
  );
}

export function isWindows() {
  const platform = os.platform();
  return platform === "win32";
}

import child_process, { spawnSync } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import { dirname } from "node:path";

// export const exec = (
//   command: string,
//   options?: child_process.SpawnSyncOptionsWithBufferEncoding & {
//     env?;
//     logPath?: string;
//   },
// ) => {
//   // console.log("[exec]", command, options)
//   const logFile = options?.logPath;
//   let logStream = process.stdout;
//   if (logFile) {
//     const dirName = dirname(logFile);
//     mkdirSync(dirName, { recursive: true });
//     // console.log("exec日志文件:", logFile)
//     //@ts-ignore
//     logStream = openSync(logFile, "a");
//   }
//   return new Promise((resolve, reject) => {
//     try {
//       const childProcess = child_process.spawn(command, {
//         shell: true,
//         // stdio: "inherit",
//         // stdio: "pipe",
//         stdio: [process.stdin, logStream, logStream],
//         env: { ...process.env, ...(options?.env || {}) },
//         ...options,
//       });
//       childProcess.on("error", (e) => {
//         console.log("error", e);
//         reject(e);
//       });
//       // a.stdout!.on("data",(data)=>{
//       //   console.log("on data:", data.toString())
//       // })
//       childProcess.once("exit", (num) => {
//         if (num !== 0) {
//           console.log("exe 命令出错,code=", {
//             code: num,
//             command,
//           });
//           reject(num);
//         } else {
//           resolve(num);
//         }
//       });
//       // childProcess.on('close', (code) => {
//       //   if (code === 0) {
//       //     console.log(`XXXXXXXChild process finished successfully. Output saved to `);
//       //   } else {
//       //     console.error('XXXXXXChild process failed.');
//       //   }
//       // });
//     } catch (e) {
//       console.log({ message: "[exec error]", error: e, command });
//       reject(e);
//     }
//   });
// };

export const execLogFile = (
  command: string,
  options?: child_process.SpawnSyncOptionsWithBufferEncoding & { env? },
) => {
  return new Promise((resolve, reject) => {
    try {
      const a = child_process.spawn(command, {
        shell: true,
        stdio: "inherit",
        env: process.env,
        ...options,
      });
      a.on("error", (e) => {
        console.log("error", e);
        reject(e);
      });
      a.once("exit", (num) => {
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

export function commandExistAsync(cmd: string) {
  if (isWindows()) {
    try {
      const stdout = execSync(`where ${cmd}`, { stdio: [] });
      !!stdout;
    } catch (e) {
      return false;
    }
  }
  return spawnSync("which", [cmd]).status === 0;
}

export const exec = (
  command: string,
  options?: child_process.SpawnSyncOptionsWithBufferEncoding & {
    env?;
    logPath?: string;
    args?: string[];
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
