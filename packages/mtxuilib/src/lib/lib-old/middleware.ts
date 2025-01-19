import { NextResponse } from "next/server";

/** **********************************************************************************
 * nextjs 中间件库，在nextjs 中，在项目根据了下添加 文件
 *  ```
 *  内容： export { config, middleware, runtime } from 'mtxcli/lib/middleware';
 *  ```
 *  即可应用本中间件
 * **********************************************************************************/

// 临时配置项
const MtxMiddleconfig = {
  enableSp: false,
};

export const runtime = "experimental-edge";
export const config = {
  matcher: ["/:path*"],
  unstable_allowDynamic: [
    "**/node_modules/.pnpm/**/function-bind/**",
    "**/node_modules/.pnpm/**",
    "/node_modules/function-bind/**",
    "/node_modules/.pnpm/function-bind/**",
  ],
};

export async function middleware(request: Request) {
  console.log("middleware", request.url);
  //TODO: 从后端获取配置数据，
  //           如果配置指定使用原始后端反代，则使用原先的spHandler的方式。
  //           如果配置执行使用 page.tsx 的方式反代， 则 使用 react html parse 的方式解释并渲染页面。
  //
  if (!MtxMiddleconfig.enableSp) {
    return NextResponse.next();
  }
  {
    const uri = new URL(request.url);
    const pathName = uri.pathname;
    if (pathName.startsWith("/api")) {
      return NextResponse.next();
    }
  }
}
