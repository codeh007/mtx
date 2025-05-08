import { WhisperSubtitle } from "./index";

async function main() {
  // 创建 WhisperSubtitle 实例
  const subtitleGenerator = new WhisperSubtitle({
    apiKey: process.env.OPENAI_API_KEY || "", // 请设置你的 OpenAI API 密钥
    language: "zh", // 设置语言为中文
  });

  try {
    // 生成字幕
    await subtitleGenerator.generateSubtitle(
      "path/to/your/audio.mp3", // 输入音频文件路径
      "output.srt", // 输出字幕文件路径
    );
    console.log("字幕生成成功！");
  } catch (error) {
    console.error("生成字幕时出错:", error);
  }
}

main();
