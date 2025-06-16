# gomtm-前端开发指引


## 关键子项目

* `gomtmui`
  - 路径: `apps/gomtmui`, 主站前端. 也是当前开发的首要关注的项目


## 技术栈

### 包管理
* 使用 **bun** workspace 的方式管理 npm包, 目前不完全支持 npm,如果使用npm, 如果当前环境确实不支持 bun, 可以使用 pnpm 替代
    - 常用命令 `bun i` 安装依赖
    - 启动开发服务器 `(cd apps/gomtmui && bun run dev)`


### 常用工具安装

* `bun`, 方式1: `npm i -g bun` , 方式2: `curl -fsSL https://bun.sh/install | bash`
