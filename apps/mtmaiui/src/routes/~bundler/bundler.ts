import * as esbuild from "esbuild-wasm";
// import { fetchPlugin } from "./plugins/fetch-plugin";
// import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

let isInit = false;
export const setupBundle = async () => {
  if (isInit) return;
  await esbuild.initialize({
    worker: true,
    wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm",
  });
  isInit = true;
};

export const esbuildTransform = async (rawCode: string) => {
  await setupBundle();
  const result = await esbuild.build({
    stdin: {
      contents: rawCode,
      loader: "tsx",
    },
    bundle: true,
    format: "esm",
    target: "es2015",
    write: false,
    external: ["react", "react-dom"],
    // define: {
    //   "process.env.NODE_ENV": '"development"',
    // },
    // jsx: "automatic",
    // jsxFactory: "React.createElement",
    // jsxFragment: "React.Fragment",
    // plugins: [unpkgPathPlugin(rawCode), fetchPlugin(rawCode)],
  });
  console.log("esbuild wasm 编译结果", result);
  return result.outputFiles[0].text;
};
