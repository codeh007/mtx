import { test, expect } from '@playwright/test';

test.describe('Playwright 集成测试演示', () => {
  test('演示测试 - 验证页面基本功能', async ({ page }) => {
    // 这是一个简单的演示测试，不需要实际的服务器
    // 我们可以测试一个简单的HTML页面
    
    // 创建一个简单的HTML内容
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Playwright 演示</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { background: #f0f0f0; padding: 10px; margin-bottom: 20px; }
          .nav { display: flex; gap: 10px; }
          .nav a { text-decoration: none; color: #333; padding: 5px 10px; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <header class="header">
          <nav class="nav">
            <a href="#home">首页</a>
            <a href="#docs">文档</a>
            <a href="#studio">智能工作室</a>
            <a href="#register">用户注册</a>
          </nav>
        </header>
        <main class="content">
          <h1>Hello home page</h1>
          <p>这是一个 Playwright 集成测试演示页面</p>
          <button id="demo-button">点击测试</button>
        </main>
        <script>
          document.getElementById('demo-button').addEventListener('click', function() {
            this.textContent = '已点击';
            this.style.background = '#4CAF50';
            this.style.color = 'white';
          });
        </script>
      </body>
      </html>
    `;
    
    // 导航到数据URL（不需要服务器）
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);
    
    // 验证页面标题
    await expect(page).toHaveTitle('Playwright 演示');
    
    // 验证主要内容
    await expect(page.getByText('Hello home page')).toBeVisible();
    await expect(page.getByText('这是一个 Playwright 集成测试演示页面')).toBeVisible();
    
    // 验证导航链接
    await expect(page.getByRole('link', { name: '首页' })).toBeVisible();
    await expect(page.getByRole('link', { name: '文档' })).toBeVisible();
    await expect(page.getByRole('link', { name: '智能工作室' })).toBeVisible();
    await expect(page.getByRole('link', { name: '用户注册' })).toBeVisible();
    
    // 测试按钮交互
    const button = page.getByRole('button', { name: '点击测试' });
    await expect(button).toBeVisible();
    
    // 点击按钮
    await button.click();
    
    // 验证按钮状态变化
    await expect(button).toHaveText('已点击');
    await expect(button).toHaveCSS('background-color', 'rgb(76, 175, 80)');
    await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('演示测试 - 响应式设计', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>响应式演示</title>
        <style>
          body { margin: 0; font-family: Arial, sans-serif; }
          .container { padding: 20px; }
          .responsive-text { font-size: 16px; }
          @media (max-width: 768px) {
            .responsive-text { font-size: 14px; color: blue; }
          }
          @media (min-width: 1200px) {
            .responsive-text { font-size: 20px; color: green; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="responsive-text">响应式文本</h1>
          <p>这个文本会根据屏幕尺寸改变样式</p>
        </div>
      </body>
      </html>
    `;
    
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);
    
    // 测试桌面视图
    await page.setViewportSize({ width: 1400, height: 900 });
    const responsiveText = page.locator('.responsive-text');
    await expect(responsiveText).toHaveCSS('font-size', '20px');
    await expect(responsiveText).toHaveCSS('color', 'rgb(0, 128, 0)'); // green
    
    // 测试平板视图
    await page.setViewportSize({ width: 800, height: 600 });
    await expect(responsiveText).toHaveCSS('font-size', '16px');
    
    // 测试移动视图
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(responsiveText).toHaveCSS('font-size', '14px');
    await expect(responsiveText).toHaveCSS('color', 'rgb(0, 0, 255)'); // blue
  });

  test('演示测试 - 表单交互', async ({ page }) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>表单演示</title>
        <style>
          body { padding: 20px; font-family: Arial, sans-serif; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; }
          input, select { padding: 8px; width: 200px; }
          button { padding: 10px 20px; background: #007cba; color: white; border: none; cursor: pointer; }
          .result { margin-top: 20px; padding: 10px; background: #f0f0f0; display: none; }
        </style>
      </head>
      <body>
        <h1>表单测试</h1>
        <form id="demo-form">
          <div class="form-group">
            <label for="name">姓名:</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">邮箱:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="category">类别:</label>
            <select id="category" name="category">
              <option value="">请选择</option>
              <option value="developer">开发者</option>
              <option value="designer">设计师</option>
              <option value="manager">管理者</option>
            </select>
          </div>
          <button type="submit">提交</button>
        </form>
        <div id="result" class="result"></div>
        <script>
          document.getElementById('demo-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const result = document.getElementById('result');
            result.innerHTML = '表单提交成功！姓名: ' + formData.get('name') + ', 邮箱: ' + formData.get('email') + ', 类别: ' + formData.get('category');
            result.style.display = 'block';
          });
        </script>
      </body>
      </html>
    `;
    
    await page.goto(`data:text/html,${encodeURIComponent(htmlContent)}`);
    
    // 填写表单
    await page.fill('#name', '张三');
    await page.fill('#email', 'zhangsan@example.com');
    await page.selectOption('#category', 'developer');
    
    // 提交表单
    await page.click('button[type="submit"]');
    
    // 验证结果
    const result = page.locator('#result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('表单提交成功！');
    await expect(result).toContainText('姓名: 张三');
    await expect(result).toContainText('邮箱: zhangsan@example.com');
    await expect(result).toContainText('类别: developer');
  });
});
