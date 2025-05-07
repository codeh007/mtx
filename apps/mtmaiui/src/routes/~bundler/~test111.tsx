import { createFileRoute } from "@tanstack/react-router";
import { Button } from "mtxuilib/ui/button";
import { useRef } from "react";

export const Route = createFileRoute("/bundler/test111")({
  component: RouteComponent,
});

const someValue = "someValue4444";
function RouteComponent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleClick = async () => {
    // 创建一个包含 React 组件的代码字符串
    const code = `
      function App() {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <h1>Hello from Standalone React!</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count + 1)}>Increment</button>
          </div>
        );
      }

      // 渲染 React 组件
      const root = ReactDOM.createRoot(document.getElementById('standalone-root'));
      root.render(<App />);
    `;

    // 获取 iframe 的 document 对象
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    // 写入HTML内容
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Standalone React Demo</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script type="module" src="https://cdn.jsdelivr.net/npm/@motion-canvas/core@3.17.2/lib/index.min.js"></script>
          <script type="module" src="https://cdn.jsdelivr.net/npm/@motion-canvas/2d@3.17.2/lib/index.min.js"></script>

        </head>
        <body>
          <div id="standalone-root"></div>
          <script type="text/babel">
            ${code}
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  return (
    <div>
      <Button onClick={handleClick}>Load React in iframe</Button>
      <iframe
        ref={iframeRef}
        title="Standalone React Demo"
        style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
      />

      <div>
        <script type="text/javascript">console.log("hello222255" + someValue);</script>
      </div>
    </div>
  );
}
