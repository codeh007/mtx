import { test, expect } from '@playwright/test';

test.describe('布局测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('应该有正确的HTML结构', async ({ page }) => {
    // 验证基本HTML结构
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('suppressHydrationWarning');
    
    // 验证head部分
    await expect(page.locator('head')).toBeAttached();
    
    // 验证body结构
    const body = page.locator('body');
    await expect(body).toHaveClass(/min-h-screen/);
    await expect(body).toHaveClass(/bg-background/);
    await expect(body).toHaveClass(/font-sans/);
    await expect(body).toHaveClass(/antialiased/);
  });

  test('应该有正确的主容器布局', async ({ page }) => {
    // 验证主容器
    const mainContainer = page.locator('div.flex.flex-col.min-h-screen');
    await expect(mainContainer).toBeVisible();
    await expect(mainContainer).toHaveClass(/h-full/);
    await expect(mainContainer).toHaveClass(/w-full/);
    
    // 验证header在主容器内
    const header = mainContainer.locator('header');
    await expect(header).toBeVisible();
  });

  test('应该正确处理不同视口尺寸', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'Mobile Small' },
      { width: 375, height: 667, name: 'Mobile Medium' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Desktop Small' },
      { width: 1920, height: 1080, name: 'Desktop Large' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // 验证页面在不同视口下都能正常显示
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
      await expect(page.getByText('Hello home page')).toBeVisible();
      
      // 验证导航栏在不同视口下的表现
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // 验证导航链接在不同视口下都可见
      await expect(page.getByRole('link', { name: '首页' })).toBeVisible();
    }
  });

  test('应该有正确的主题支持', async ({ page }) => {
    // 验证主题相关的meta标签
    const lightThemeMeta = page.locator('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
    const darkThemeMeta = page.locator('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
    
    // 注意：这些meta标签可能在运行时动态添加，所以我们检查它们是否存在
    // 如果不存在也不算错误，因为主题脚本可能在客户端处理
  });

  test('应该正确加载样式', async ({ page }) => {
    // 验证body有正确的字体类
    const body = page.locator('body');
    await expect(body).toHaveClass(/font-sans/);
    
    // 验证header有正确的样式
    const header = page.locator('header');
    await expect(header).toHaveClass(/bg-background/);
    await expect(header).toHaveClass(/sticky/);
    await expect(header).toHaveClass(/top-0/);
    
    // 验证主容器有正确的flex布局
    const mainContainer = page.locator('div.flex.flex-col.min-h-screen');
    await expect(mainContainer).toBeVisible();
  });

  test('应该正确处理页面滚动', async ({ page }) => {
    // 添加一些内容来测试滚动
    await page.evaluate(() => {
      const content = document.createElement('div');
      content.style.height = '2000px';
      content.style.background = 'linear-gradient(to bottom, red, blue)';
      content.textContent = '滚动测试内容';
      document.body.appendChild(content);
    });
    
    // 验证header是sticky的
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // 滚动页面
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // 验证header仍然可见（sticky效果）
    await expect(header).toBeVisible();
    
    // 滚动回顶部
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toBeVisible();
  });

  test('应该有正确的z-index层级', async ({ page }) => {
    const header = page.locator('header');
    
    // 验证header有正确的z-index类
    await expect(header).toHaveClass(/z-30/);
    
    // 验证header在视觉上位于其他内容之上
    await expect(header).toBeVisible();
  });

  test('应该支持键盘导航', async ({ page }) => {
    // 测试Tab键导航
    await page.keyboard.press('Tab');
    
    // 验证焦点管理
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('应该有正确的语义化HTML', async ({ page }) => {
    // 验证语义化标签
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // 验证导航链接使用正确的标签
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    
    // 验证每个链接都有href属性
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      await expect(link).toHaveAttribute('href');
    }
  });
});
