# gomtm-前端开发指引


## 关键子项目

* `gomtmui`
    - 路径: `apps/gomtmui`, 主站前端. 也是当前开发的首要关注的项目

* `mtxuilib`
    前端公共 UI 库, 路径: `packages/mtxuilib` 
    "mtxuilib"包下的重要目录介绍:
        - "packages/mtxuilib/src/ui/", 是最新的 `shadcn` ui 组件, 可以这样导入: `import { Button } from "mtxuilib/ui/button";`

        - `packages/mtxuilib/src/mt/`, 在 **shadcn** ui 基础上进行二次封装的高级组件, 假如应用需要新增自定义组件,可以尝试在这里看看,如果有合适的,就直接用,没有合适的,就在这里直接新增一个.


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
