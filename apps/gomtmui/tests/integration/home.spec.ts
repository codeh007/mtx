import { test, expect } from '@playwright/test';

test.describe('首页测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('/');
  });

  test('应该正确加载首页', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/gomtm/i);
    
    // 验证首页内容
    await expect(page.getByText('Hello home page')).toBeVisible();
  });

  test('应该显示导航栏', async ({ page }) => {
    // 验证导航栏存在
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // 验证导航链接
    await expect(page.getByRole('link', { name: '首页' })).toBeVisible();
    await expect(page.getByRole('link', { name: '文档' })).toBeVisible();
    await expect(page.getByRole('link', { name: '智能工作室' })).toBeVisible();
    await expect(page.getByRole('link', { name: '用户注册' })).toBeVisible();
  });

  test('应该有正确的页面结构', async ({ page }) => {
    // 验证基本页面结构
    const body = page.locator('body');
    await expect(body).toHaveClass(/min-h-screen/);
    await expect(body).toHaveClass(/bg-background/);
    await expect(body).toHaveClass(/font-sans/);
    
    // 验证主容器
    const mainContainer = page.locator('div.flex.flex-col.min-h-screen');
    await expect(mainContainer).toBeVisible();
  });

  test('应该正确响应移动端视口', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 验证页面在移动端仍然可见
    await expect(page.getByText('Hello home page')).toBeVisible();
    
    // 验证导航栏在移动端的表现
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('应该有无障碍访问支持', async ({ page }) => {
    // 检查页面是否有基本的无障碍访问属性
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
    
    // 检查导航链接是否可访问
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // 验证每个导航链接都有文本内容
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      await expect(link).not.toBeEmpty();
    }
  });
});
