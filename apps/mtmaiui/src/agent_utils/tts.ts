/**
 * 生成音频
 * 提示: 使用post 虽然可以提交更长的上下文, 但是返回音频文件需要自己保存
 * @param text 文本
 * @param voice 声音
 * @returns 音频
 */
export async function generateAudioViaPost(text, voice = "alloy") {
  const url = "https://text.pollinations.ai/openai";
  const payload = {
    model: "openai-audio",
    messages: [{ role: "user", content: text }],
    voice: voice,
  };
  //   console.log("Generating audio via POST:", payload);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    if (response.headers.get("Content-Type")?.includes("audio/mpeg")) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      //   console.log("Audio generated and playing.");
    } else {
      const errorText = await response.text();
      console.error("Expected audio, received:", response.headers.get("Content-Type"), errorText);
      throw new Error("API did not return audio content.");
    }
  } catch (error) {
    console.error("Error generating audio via POST:", error);
  }
}

/**
 * 生成音频
 * 提示: 使用 get
 * @param text 文本
 * @param voice 声音
 * @returns 音频
 */
export async function generateAudioViaGet(text, voice = "alloy") {
  const encodedText = encodeURIComponent(text);
  const params = new URLSearchParams({
    model: "openai-audio",
    voice: voice,
  });
  const url = `https://text.pollinations.ai/${encodedText}?${params.toString()}`;
  // const response = await fetch(url);

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  // }

  // if (response.headers.get("Content-Type")?.includes("audio/mpeg")) {
  //   const audioBlob = await response.blob();
  //   const audioUrl = URL.createObjectURL(audioBlob);

  //   // Example: Play the audio
  //   const audio = new Audio(audioUrl);
  //   audio.play();
  //   console.log("Audio generated and playing.");
  // } else {
  //   const errorText = await response.text();
  //   console.error("Expected audio, received:", response.headers.get("Content-Type"), errorText);
  //   throw new Error("API did not return audio content.");
  // }
  // 仅返回网址即可
  return url;
}

// --- Usage ---
// generateAudioGet("This audio comes from a GET request.", "shimmer");
