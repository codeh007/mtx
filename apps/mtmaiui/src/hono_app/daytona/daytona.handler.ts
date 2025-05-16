import { Daytona } from "@daytonaio/sdk";
import { createRouter } from "../agent_api/lib/createApp";

function getDaytona() {
  return new Daytona({
    apiKey: process.env.DAYTONA_API_KEY,
    apiUrl: process.env.DAYTONA_API_URL,
  });
}

export const daytonaRouter = createRouter();

/**
 * 简单执行 bash 命令
 */
daytonaRouter.get("/daytona/helloworld", async (c) => {
  try {
    // Create a new sandbox
    const sandbox = await getDaytona().create({
      language: "typescript",
      autoStopInterval: 10, // n 分钟后自动停止
      envVars: { NODE_ENV: "development" },
    });

    // Execute a command
    const response = await sandbox.process.executeCommand("echo 'Hello, World!'");
    return c.json({
      result: response.result,
    });
  } catch (error: any) {
    return c.text(error);
  }
});

daytonaRouter.get("/daytona/smolagent/hello", async (c) => {
  try {
    // Create a new sandbox
    const sandbox = await getDaytona().create({
      language: "typescript",
      autoStopInterval: 10, // n 分钟后自动停止
      envVars: { NODE_ENV: "development" },
    });

    const smolagentTask = "请自我介绍, 告诉我你的能力.";
    const installSmolagent = "pip install smolagent";
    const installDaytona = "pip install daytona";
    // Execute a command
    const response = await sandbox.process.executeCommand(installSmolagent);

    const pythonCode = `
    print ("Hello, World!")
    `;
    const response2 = await sandbox.process.codeRun(pythonCode, {});
    return c.json({
      result: response2.result,
    });
  } catch (error: any) {
    return c.text(error);
  }
});
