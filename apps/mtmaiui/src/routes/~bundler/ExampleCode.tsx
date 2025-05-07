"use client";

import { Button } from "mtxuilib/ui/button";

/**
 * 实验: 使用 esbuild-wasm 在浏览器内实时编译 tsx 文件
 * @returns
 */
export function ExampleCode() {
  return (
    <div>
      <Button
        onClick={async () => {
          // 创建一个简单的模块代码
          const moduleCode = `
            export function hello() {
              return "Hello from dynamic module!";
              console.log("hello");
            }
            hello();
          `;

          // 创建一个 Blob URL
          const blob = new Blob([moduleCode], { type: "text/javascript" });
          const blobUrl = URL.createObjectURL(blob);

          try {
            console.log("开始动态导入", blobUrl);
            const module = await import(blobUrl);
            console.log("动态导入成功:", module.hello());
          } catch (error: any) {
            console.error("动态导入失败", error, error.stack);

            // 使用 <script> 标签
            const script = document.createElement("script");
            script.src = blobUrl;
            script.type = "module";
            document.head.appendChild(script);
          } finally {
            // 清理 Blob URL
            URL.revokeObjectURL(blobUrl);
          }
        }}
      >
        Hello Dynamic Import
      </Button>
    </div>
  );
}
