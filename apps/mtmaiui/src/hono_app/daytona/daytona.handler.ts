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
  const sandbox = await getDaytona().create({
    // language: "typescript",
    language: "python",
    autoStopInterval: 10, // n 分钟后自动停止
    envVars: { NODE_ENV: "development" },
  });
  try {
    // Create a new sandbox

    const smolagentTask = "请自我介绍, 告诉我你的能力.";

    const files = [
      {
        path: "smolagent.py",
        content: new File([smolagentTask], "smolagent.py", { type: "text/plain" }),
      },
    ];

    const uploadResponse = await sandbox.fs.uploadFiles(files);

    console.log(uploadResponse);
    const installMtmai = "curl -LsSf https://astral.sh/uv/install.sh | sh";

    // Execute a command
    const response = await sandbox.process.executeCommand(installMtmai);
    const installMtmaiResponse = await sandbox.process.executeCommand(
      "export PATH=$HOME/.local/bin:$PATH && uv pip install mtmai --system",
    );

    const fullResponseText = response.result;
    const pythonCode = `
    print ("Hello, World!")
    `;
    const response2 = await sandbox.process.codeRun(pythonCode, {});
    return c.json({
      result: response2.result,
      fullResponseText: fullResponseText,
      uploadResponse: uploadResponse,
      installMtmaiResponse,
    });
  } catch (error: any) {
    return c.text(error);
  } finally {
    await sandbox.stop();
    await sandbox.delete();
  }
});
