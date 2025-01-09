"use client";

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4 prose dark:prose-invert">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">欢迎使用面试聊天机器人</h1>
        <p className="leading-normal text-muted-foreground">
          技术栈： 前端 nextjs， 后端 也是 nextjs，可以直接云端部署。支持 RAG
          知识库功能，支持联网搜索功能。
          <div>模型层： </div>
          <h3>模型层</h3>
          <p>llama3-8b-8192，托管于groq ， 未微调，未训练</p>
          <div>
            <h3>持久层</h3>
            <span>数据库： postgresql </span>
            <span>向量存取： postgresql </span>
          </div>
        </p>
      </div>
    </div>
  );
}
