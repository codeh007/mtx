// import { createRouter } from "../../lib/createApp";
import express from "express";
import { sleep } from "mtxuilib/lib/sslib";

import { spawn } from "node:child_process";
// import { sleep } from "bun";
import { chromium } from "playwright-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
chromium.use(stealthPlugin());

async function runExample() {
  /**
   * 要补丁,都在会被检测出 cdp 协议,识别为bot
   * playwright 版本 1.49.1
   * npx rebrowser-patches@latest patch --packageName playwright-core
   */
  const browser = await chromium.launch({
    headless: false,
    // executablePath: "/opt/google/chrome/chrome",
  });
  const page = await browser.newPage();
  await page.goto("https://pixelscan.net");
  await page.waitForTimeout(160000);
  await browser.close();
}

async function runExample2() {
  // 直接通过系统命令启动chrome,禁用共享内存

  const debugPort = 19222;
  const cmd = `/opt/google/chrome/chrome --disable-dev-shm-usage --disable-gpu --remote-debugging-port=${debugPort} "https://www.browserscan.net/zh"`;
  const child = spawn(cmd, { shell: true });

  child.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  child.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  // 阻塞主程序直到浏览器进程结束
  await new Promise((resolve) => {
    child.on("close", (code) => {
      console.log(`Browser process exited with code ${code}`);
      resolve(code);
    });
  });
}

async function runExamplePuppeteer() {
  /**
   * 要补丁,都在会被检测出 cdp 协议,识别为bot
   * npx rebrowser-patches@latest patch --packageName puppeteer-core
   */
  const startupPages = ["https://www.browserscan.net/zh", "https://pixelscan.net"];
  const puppeteer = require("puppeteer-extra");
  puppeteer.use(stealthPlugin());
  const browser = await puppeteer.launch({
    headless: false,
    // executablePath: "/opt/google/chrome/chrome",
    args: ["--disable-dev-shm-usage", "--remote-debugging-port=19222"],
  });

  for (const pageUrl of startupPages) {
    const page = await browser.newPage();
    await page.goto(pageUrl);
    // await sleep(160000);
    await page.close();
  }

  //   await page.waitForTimeout(160000);

  await sleep(160000);
  await browser.close();
}

const browserRouter = createRouter();

browserRouter.all("/hellobrowser", async (c) => {
  runExample();
  return c.json({
    message: "Hello browser",
  });
});

export const v0Router = express.Router();

export default browserRouter;
