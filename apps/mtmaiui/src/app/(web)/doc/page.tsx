export default async function Page(props: { params }) {
  return (
    <div className="flex-col items-center mx-auto max-w-9/12 container flex justify-center align-center w-full">
      <div className="prose dark:prose-invert max-w-96 mx-auto">
        <div>
          <h2>提示</h2>
        </div>
        <p className="flex flex-col items-center justify-center">
          在 "对话"窗口, 输入消息后,可能需要1分钟,才能看到反应
        </p>
      </div>
    </div>
  );
}
