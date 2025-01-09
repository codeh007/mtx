"use client";

import {
  MarkdownTextPrimitive,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
// 警告: 不要这样直接导入,后果是 构建出来的 (tailwinddcss css 文件体积非常大,里面包含了内联的katex字体)
// import "katex/dist/katex.min.css";
import { memo } from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "../lib/utils";
// import { TooltipIconButton } from "./tooltip-icon-button";
import { CodeHeader } from "./CodeHeader";
import { SyntaxHighlighter } from "./syntax-highlighter";
const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <h1
            className={cn(
              "mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0",
              className,
            )}
            {...props}
          />
        ),
        h2: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <h2
            className={cn(
              "mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className,
            )}
            {...props}
          />
        ),
        h3: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <h3
            className={cn(
              "mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className,
            )}
            {...props}
          />
        ),
        h4: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <h4
            className={cn(
              "mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0",
              className,
            )}
            {...props}
          />
        ),
        h5: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <h5
            className={cn(
              "my-4 text-lg font-semibold first:mt-0 last:mb-0",
              className,
            )}
            {...props}
          />
        ),
        h6: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <h6
            className={cn("my-4 font-semibold first:mt-0 last:mb-0", className)}
            {...props}
          />
        ),
        p: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <p
            className={cn(
              "mb-5 mt-5 leading-7 first:mt-0 last:mb-0",
              className,
            )}
            {...props}
          />
        ),
        a: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <a
            target="_blank"
            className={cn(
              "text-primary font-medium underline underline-offset-4",
              className,
            )}
            {...props}
          />
        ),
        blockquote: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <blockquote
            className={cn("border-l-2 pl-6 italic", className)}
            {...props}
          />
        ),
        ul: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <ul
            className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)}
            {...props}
          />
        ),
        ol: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <ol
            className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
            {...props}
          />
        ),
        hr: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <hr className={cn("my-5 border-b", className)} {...props} />
        ),
        table: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          //@ts-ignore
          <table
            className={cn(
              "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
              className,
            )}
            {...props}
          />
        ),
        th: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <th
            className={cn(
              "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
              className,
            )}
            {...props}
          />
        ),
        td: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <td
            className={cn(
              "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
              className,
            )}
            {...props}
          />
        ),
        tr: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <tr
            className={cn(
              "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
              className,
            )}
            {...props}
          />
        ),
        sup: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <sup
            className={cn("[&>a]:text-xs [&>a]:no-underline", className)}
            {...props}
          />
        ),
        pre: ({ node: _node, className, ...props }) => (
          //@ts-ignore
          <pre
            className={cn(
              "overflow-x-auto rounded-b-lg bg-black p-4 text-white",
              className,
            )}
            {...props}
          />
        ),
        code: function Code({ node: _node, className, ...props }) {
          const isCodeBlock = useIsMarkdownCodeBlock();
          return (
            //@ts-ignore
            <code
              className={cn(
                !isCodeBlock && "bg-aui-muted rounded border font-semibold",
                className,
              )}
              {...props}
            />
          );
        },
        CodeHeader,
        SyntaxHighlighter,
      }}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);
