import { Daytona } from "@daytonaio/sdk";

const exampleTask = `
请自我介绍, 告诉我你的能力.
`;

function getDaytona() {
  return new Daytona({
    apiKey: process.env.DAYTONA_API_KEY,
    apiUrl: process.env.DAYTONA_API_URL,
  });
}

export const getDefaultSandbox = async () => {
  // Create a new sandbox
  const daytona = getDaytona();
  //   const sandbox = await daytona.create({
  //     language: "typescript",
  //     envVars: { NODE_ENV: "development" },
  //   });

  const sandbox = await daytona.create({
    image: "gitgit188/gomtm",
    language: "typescript",
    autoStopInterval: 10, // n 分钟后自动停止
    envVars: { NODE_ENV: "development" },
    resources: {
      cpu: 1,
      memory: 1, // 4GB RAM
      disk: 1,
    },
  });

  return sandbox;
};

export const runPython = async (task: string) => {
  const files = [
    {
      path: "smolagent.py",
      content: new File([task], "task.py", { type: "text/plain" }),
    },
  ];

  const sandbox = await getDefaultSandbox();

  const uploadResponse = await sandbox.fs.uploadFiles(files);

  console.log(uploadResponse);

  // 执行代码
  const response = await sandbox.process.executeCommand("python smolagent.py");

  return response;
};
