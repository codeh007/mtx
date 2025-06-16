# gomtm-前端开发指引

* 对代码的任何修改, 都以运行 `bun run turbo build` 成功构建作为最基本的要求

## 关键子项目

* `gomtmui`
    - 路径: `apps/gomtmui`, 主站前端. 也是当前开发的首要关注的项目

* `mtxuilib`
    前端公共 UI 库, 路径: `packages/mtxuilib` 
    "mtxuilib"包下的重要目录介绍:
        - "packages/mtxuilib/src/ui/", 是最新的 `shadcn` ui 组件, 可以这样导入: `import { Button } from "mtxuilib/ui/button";`

        - `packages/mtxuilib/src/mt/`, 在 **shadcn** ui 基础上进行二次封装的高级组件, 假如应用需要新增自定义组件,可以尝试在这里看看,如果有合适的,就直接用,没有合适的,就在这里直接新增一个.
* `mtmaiapi`
    路径: `packages/mtmaiapi` 是 typescript opanapi 库, 用来对后端的api 进行调用.
    主要源码在 `packages/mtmaiapi/src/gomtmapi/`下
    主要有三种类型的库:
    - `packages/mtmaiapi/src/gomtmapi/sdk.gen.ts` 是原生 api 调用函数
    - `packages/mtmaiapi/src/gomtmapi/@tanstack/react-query.gen.ts` 是在 sdk.gen 基础上封装封装为 react-query
    - `packages/mtmaiapi/src/gomtmapi/zod.gen.ts` 是以 api 对应的 zod schema库,可以用于表单验证
    - `packages/mtmaiapi/openapi.yaml` 完整的 openapi 文档



## 技术栈

- `NEXTJS v15.3`
- `react v19`
- `openapi`
- `react-query`

### 包管理
* 使用 **bun** workspace 的方式管理 npm包, 目前不完全支持 npm,如果使用npm, 如果当前环境确实不支持 bun, 应尝试安装,bun安装失败则使用 pnpm 替代
    - 常用命令 `bun i` 安装依赖
    - 启动开发服务器 `(cd apps/gomtmui && bun run dev)`


### 常用工具安装

* `bun`, 方式1: `npm i -g bun` , 方式2: `curl -fsSL https://bun.sh/install | bash`

### openapi

... 待补充

### 提出后端开发需求
作为前端开发人员, 在实现相关功能的过程中, 会涉及到跟后端的配合, 例如 API 功能的增加,修改.
当确实需要提出后端开发需求时, 前端的相关组件,应该显示相关的占位符, 例如,显示"xxx"功能暂未实现.
如果相关功能必须等待后端开发人员完成才能继续的, 就暂时停止当前前端组件的相关更改,等到后端开发完成.
当确实需要后端开发人员配合时, 应在 `docs/prd/` 目录下填写 prd文件, 文件名应当包含实践搓,精确到分钟

### 要求与约束

* 前端总是以能成功构建作为首页考量.
* 遇到无法技术问题, 例如后端api不支持之类的问题, 可以用占位符替代,例如:"xxx功能暂未实现"
* 对于界面的样式, 只能使用 tailwindcss v4 库


