"use client";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";

import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";

import { useTheme } from "next-themes";
import { useRef } from "react";
import {
  anOldHope,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cn } from "../lib/utils";
import CopyToClipboard from "./copy-to-clipboard";

SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("json", json);

export function CodeHighlighter({
  code,
  copyCode,
  setCode,
  language,
  className,
  maxHeight,
  minHeight,
  maxWidth,
  copy,
  wrapLines = true,
}: {
  code: string;
  copyCode?: string;
  setCode?: (code: string) => void;
  language: string;
  className?: string;
  maxHeight?: string;
  minHeight?: string;
  maxWidth?: string;
  copy?: boolean;
  wrapLines?: boolean;
}) {
  const { theme } = useTheme();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={cn("w-full h-fit relative bg-muted rounded-lg", className)}>
      <div
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role="button"
        tabIndex={0}
        onKeyDown={() => textareaRef.current?.focus()}
        onClick={() => textareaRef.current?.focus()}
        className="relative flex"
      >
        {setCode && (
          <textarea
            className="absolute rounded-lg text-xs inset-0 resize-none bg-transparent p-2 font-mono text-transparent caret-white outline-none"
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoCorrect="off"
          />
        )}
        {/* @ts-ignore */}
        <SyntaxHighlighter
          language={language}
          style={theme === "dark" ? anOldHope : atomOneLight}
          wrapLines={wrapLines}
          lineProps={{
            style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
          }}
          customStyle={{
            cursor: setCode ? "pointer" : "default",
            borderRadius: "0.5rem",
            maxHeight: maxHeight,
            minHeight: minHeight,
            maxWidth: maxWidth,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            fontSize: "0.75rem",
            lineHeight: "1rem",
            padding: "0.5rem",
            flex: "1",
            background: "transparent",
          }}
        >
          {code?.trim()}
        </SyntaxHighlighter>
      </div>
      {copy && <CopyToClipboard text={(copyCode || code).trim()} withText />}
    </div>
  );
}
