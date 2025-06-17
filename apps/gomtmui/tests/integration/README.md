# 集成测试文档

本目录包含使用 Playwright 编写的集成测试用例。

## 测试结构

```
tests/integration/
├── README.md           # 本文档
├── home.spec.ts        # 首页功能测试
├── navigation.spec.ts  # 导航功能测试
└── layout.spec.ts      # 布局和响应式测试
```

## 运行测试

### 基本命令

```bash
# 运行所有集成测试
bun run test:integration

# 以UI模式运行测试（推荐用于开发）
bun run test:integration:ui

# 以有头模式运行测试（可以看到浏览器）
bun run test:integration:headed

# 调试模式运行测试
bun run test:integration:debug

# 查看测试报告
bun run test:integration:report
```

### 运行特定测试

```bash
# 运行特定测试文件
bun run test:integration home.spec.ts

# 运行特定测试用例
bun run test:integration --grep "应该正确加载首页"

# 只在Chrome浏览器运行
bun run test:integration --project=chromium
```

## 测试覆盖范围

### 1. 首页测试 (home.spec.ts)
- ✅ 页面正确加载
- ✅ 导航栏显示
- ✅ 页面结构验证
- ✅ 移动端响应式
- ✅ 无障碍访问支持

### 2. 导航功能测试 (navigation.spec.ts)
- ✅ 首页导航链接
- ✅ 文档页面导航
- ✅ 智能工作室链接
- ✅ 用户注册链接
- ✅ 导航栏一致性
- ✅ 导航栏样式
- ✅ 键盘导航
- ✅ 移动端导航

### 3. 布局测试 (layout.spec.ts)
- ✅ HTML结构验证
- ✅ 主容器布局
- ✅ 多视口响应式
- ✅ 主题支持
- ✅ 样式加载
- ✅ 页面滚动
- ✅ z-index层级
- ✅ 语义化HTML

## 浏览器支持

测试在以下浏览器中运行：
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit/Safari (Desktop)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## 测试配置

测试配置位于 `playwright.config.ts`，包含：
- 测试目录：`./tests/integration`
- 基础URL：`http://localhost:3700`
- 自动启动开发服务器
- 失败时截图和录制
- 重试机制（CI环境）

## 最佳实践

### 1. 测试组织
- 使用 `test.describe()` 组织相关测试
- 使用 `test.beforeEach()` 设置通用前置条件
- 测试名称使用中文，清晰描述测试目的

### 2. 选择器策略
- 优先使用语义化选择器：`page.getByRole()`, `page.getByText()`
- 避免使用脆弱的CSS选择器
- 使用 `data-testid` 属性作为稳定的测试钩子

### 3. 断言
- 使用 `await expect()` 进行异步断言
- 验证元素可见性：`toBeVisible()`
- 验证文本内容：`toHaveText()`, `toContainText()`
- 验证属性：`toHaveAttribute()`

### 4. 等待策略
- 使用 `page.waitForLoadState()` 等待页面加载
- 使用 `expect().toBeVisible()` 等待元素出现
- 避免使用固定时间等待 `page.waitForTimeout()`

## 故障排除

### 常见问题

1. **测试超时**
   - 检查开发服务器是否正常启动
   - 增加 `webServer.timeout` 配置
   - 检查网络连接

2. **元素找不到**
   - 使用 `page.locator().highlight()` 调试选择器
   - 检查元素是否在DOM中
   - 验证页面是否完全加载

3. **样式断言失败**
   - 确保CSS类名正确
   - 检查Tailwind CSS是否正确加载
   - 使用浏览器开发者工具验证样式

### 调试技巧

```bash
# 使用调试模式逐步执行
bun run test:integration:debug

# 生成详细的测试报告
bun run test:integration --reporter=html

# 保留测试痕迹用于分析
bun run test:integration --trace=on
```

## 持续集成

在CI环境中，测试会：
- 自动重试失败的测试（最多2次）
- 生成HTML报告
- 保存失败时的截图和视频
- 使用单个worker避免资源竞争

## 扩展测试

添加新的测试时：
1. 在 `tests/integration/` 目录创建新的 `.spec.ts` 文件
2. 遵循现有的测试结构和命名约定
3. 添加适当的测试描述和断言
4. 更新本文档的测试覆盖范围部分
