import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import OpenAI from "openai";
import SrtParser from "srt-parser-2";

export interface SubtitleOptions {
  apiKey: string;
  model?: string;
  language?: string;
  outputFormat?: "srt" | "vtt";
}

export class WhisperSubtitle {
  private ffmpeg: FFmpeg;
  private openai: OpenAI;
  private options: SubtitleOptions;

  constructor(options: SubtitleOptions) {
    this.options = {
      model: "whisper-1",
      language: "zh",
      outputFormat: "srt",
      ...options,
    };
    this.ffmpeg = new FFmpeg();
    this.openai = new OpenAI({
      apiKey: options.apiKey,
    });
  }

  async init() {
    // 加载 FFmpeg
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd";
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
  }

  private async convertToMp3(audioFile: File): Promise<Uint8Array> {
    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    await this.ffmpeg.writeFile("input", uint8Array);

    // 转换为 MP3 格式
    await this.ffmpeg.exec([
      "-i",
      "input",
      "-vn",
      "-ar",
      "44100",
      "-ac",
      "2",
      "-b:a",
      "192k",
      "output.mp3",
    ]);

    const data = await this.ffmpeg.readFile("output.mp3");
    return data as Uint8Array;
  }

  async generateSubtitle(audioFile: File): Promise<string> {
    try {
      // 初始化 FFmpeg
      await this.init();

      // 转换音频格式
      const audioData = await this.convertToMp3(audioFile);

      // 调用 OpenAI Whisper API
      const transcription = await this.openai.audio.transcriptions.create({
        file: new File([audioData], "audio.mp3", { type: "audio/mp3" }),
        model: this.options.model!,
        language: this.options.language,
        response_format: "verbose_json",
      });

      // 生成字幕文件
      const parser = new SrtParser();
      const subtitles = transcription.segments.map((segment, index) => ({
        id: index + 1,
        startTime: this.formatTime(segment.start),
        endTime: this.formatTime(segment.end),
        text: segment.text,
        startSeconds: segment.start,
        endSeconds: segment.end,
      }));

      return parser.toSrt(subtitles);
    } catch (error) {
      console.error("Error generating subtitle:", error);
      throw error;
    }
  }

  private formatTime(seconds: number): string {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const secs = date.getUTCSeconds().toString().padStart(2, "0");
    const ms = date.getUTCMilliseconds().toString().padStart(3, "0");
    return `${hours}:${minutes}:${secs},${ms}`;
  }
}
