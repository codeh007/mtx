import { test, expect } from '@playwright/test';

test.describe('导航功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('首页导航链接应该正常工作', async ({ page }) => {
    // 点击首页链接
    await page.getByRole('link', { name: '首页' }).click();
    
    // 验证仍在首页
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Hello home page')).toBeVisible();
  });

  test('文档页面导航应该正常工作', async ({ page }) => {
    // 点击文档链接
    await page.getByRole('link', { name: '文档' }).click();
    
    // 验证导航到文档页面
    await expect(page).toHaveURL('/doc');
    
    // 验证页面加载（可能显示404或实际内容）
    // 由于文档页面可能还未实现，我们只验证URL变化
    await page.waitForLoadState('networkidle');
  });

  test('智能工作室链接应该包含正确的hash', async ({ page }) => {
    // 获取智能工作室链接
    const studioLink = page.getByRole('link', { name: '智能工作室' });
    
    // 验证链接的href属性
    await expect(studioLink).toHaveAttribute('href', '/ag#/chat');
  });

  test('用户注册链接应该包含正确的hash', async ({ page }) => {
    // 获取用户注册链接
    const registerLink = page.getByRole('link', { name: '用户注册' });
    
    // 验证链接的href属性
    await expect(registerLink).toHaveAttribute('href', '/ag#/auth/register');
  });

  test('导航栏应该在所有页面保持一致', async ({ page }) => {
    // 验证首页导航栏
    await expect(page.locator('header nav')).toBeVisible();
    const homeNavLinks = await page.locator('nav a').count();
    
    // 导航到文档页面
    await page.goto('/doc');
    
    // 验证文档页面也有相同的导航栏
    await expect(page.locator('header nav')).toBeVisible();
    const docNavLinks = await page.locator('nav a').count();
    
    // 验证导航链接数量一致
    expect(docNavLinks).toBe(homeNavLinks);
  });

  test('导航栏应该有正确的样式', async ({ page }) => {
    const header = page.locator('header');
    
    // 验证header的基本样式类
    await expect(header).toHaveClass(/bg-background/);
    await expect(header).toHaveClass(/sticky/);
    await expect(header).toHaveClass(/top-0/);
    await expect(header).toHaveClass(/z-30/);
    await expect(header).toHaveClass(/flex/);
    await expect(header).toHaveClass(/h-14/);
    await expect(header).toHaveClass(/items-center/);
    await expect(header).toHaveClass(/gap-4/);
    await expect(header).toHaveClass(/border-b/);
    await expect(header).toHaveClass(/px-4/);
  });

  test('导航链接应该有hover效果', async ({ page }) => {
    const firstNavLink = page.locator('nav a').first();
    
    // 悬停在链接上
    await firstNavLink.hover();
    
    // 验证链接仍然可见（基本的交互测试）
    await expect(firstNavLink).toBeVisible();
  });

  test('键盘导航应该正常工作', async ({ page }) => {
    // 使用Tab键导航
    await page.keyboard.press('Tab');
    
    // 验证焦点在第一个导航链接上
    const firstLink = page.locator('nav a').first();
    await expect(firstLink).toBeFocused();
    
    // 继续Tab导航
    await page.keyboard.press('Tab');
    const secondLink = page.locator('nav a').nth(1);
    await expect(secondLink).toBeFocused();
  });

  test('移动端导航应该正常工作', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 验证导航栏在移动端仍然可见
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // 验证导航链接在移动端可点击
    const homeLink = page.getByRole('link', { name: '首页' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    
    await expect(page).toHaveURL('/');
  });
});
