#!/usr/bin/env node
import child_process from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

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
