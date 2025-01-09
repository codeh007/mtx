"use client";

import dynamic from "next/dynamic";

export const LzMarkdownText= dynamic(import("./markdown-text").then(x=>x.MarkdownText),{ssr:false})
