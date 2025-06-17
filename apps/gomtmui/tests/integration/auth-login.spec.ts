import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('用户后台登录页测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问登录页面
    await page.goto('/auth/login');
  });

  test('应该正确加载登录页面', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/gomtm/i);
    
    // 验证页面URL
    expect(page.url()).toContain('/auth/login');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
  });

  test('应该显示登录页面的核心元素', async ({ page }) => {
    // 验证页面标题
    await expect(page.getByText('用户登录')).toBeVisible();

    // 验证登录表单存在
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });

  test('应该显示登录表单元素', async ({ page }) => {
    // 验证邮箱输入框
    const emailInput = page.getByPlaceholder('name@example.com');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    // 验证密码输入框
    const passwordInput = page.getByPlaceholder('请输入密码');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 验证登录按钮
    const loginButton = page.getByRole('button', { name: '登录' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test('应该支持表单交互', async ({ page }) => {
    // 测试邮箱输入
    const emailInput = page.getByPlaceholder('name@example.com');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // 测试密码输入
    const passwordInput = page.getByPlaceholder('请输入密码');
    await passwordInput.fill('testpassword123');
    await expect(passwordInput).toHaveValue('testpassword123');

    // 验证登录按钮仍然可用
    const loginButton = page.getByRole('button', { name: '登录' });
    await expect(loginButton).toBeEnabled();
  });

  test('应该有正确的页面布局结构', async ({ page }) => {
    // 验证主容器
    const mainContainer = page.locator('div.size-screen');
    await expect(mainContainer).toBeVisible();
    
    // 验证居中布局
    const centerContainer = page.locator('div.flex.flex-col.items-center.justify-center');
    await expect(centerContainer).toBeVisible();
    
    // 验证表单容器宽度限制
    const formContainer = page.locator('div.mx-auto.flex.w-full.flex-col.justify-center.space-y-6');
    await expect(formContainer).toBeVisible();
  });

  test('应该正确响应移动端视口', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 验证页面在移动端仍然可见和可用
    await expect(page.getByText('欢迎回来')).toBeVisible();
    await expect(page.getByPlaceholder('邮箱')).toBeVisible();
    await expect(page.getByPlaceholder('密码')).toBeVisible();
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible();
    
    // 验证返回按钮在移动端的位置
    const backButton = page.getByRole('link').first();
    await expect(backButton).toBeVisible();
  });

  test('应该支持键盘导航', async ({ page }) => {
    // 使用Tab键导航
    await page.keyboard.press('Tab');
    
    // 验证焦点在邮箱输入框
    const emailInput = page.getByPlaceholder('邮箱');
    await expect(emailInput).toBeFocused();
    
    // 继续Tab导航到密码输入框
    await page.keyboard.press('Tab');
    const passwordInput = page.getByPlaceholder('密码');
    await expect(passwordInput).toBeFocused();
    
    // 继续Tab导航到登录按钮
    await page.keyboard.press('Tab');
    const loginButton = page.getByRole('button', { name: '登录' });
    await expect(loginButton).toBeFocused();
  });

  test('应该正确处理返回首页链接', async ({ page }) => {
    // 点击返回按钮
    const backButton = page.getByRole('link').first();
    await expect(backButton).toHaveAttribute('href', '/');
  });

  test('登录页面截图测试', async ({ page, browserName }) => {
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 确保所有关键元素都已加载
    await expect(page.getByText('欢迎回来')).toBeVisible();
    await expect(page.getByPlaceholder('邮箱')).toBeVisible();
    await expect(page.getByPlaceholder('密码')).toBeVisible();
    
    // 截取整个页面的截图
    const screenshotPath = path.join('docs', 'screenshots', 'e2e-tests', `login-page-${browserName}.png`);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    // 截取登录表单区域的截图
    const formContainer = page.locator('div.mx-auto.flex.w-full.flex-col.justify-center.space-y-6');
    const formScreenshotPath = path.join('docs', 'screenshots', 'e2e-tests', `login-form-${browserName}.png`);
    await formContainer.screenshot({ 
      path: formScreenshotPath 
    });
  });

  test('移动端登录页面截图测试', async ({ page, browserName }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 确保所有关键元素都已加载
    await expect(page.getByText('欢迎回来')).toBeVisible();
    await expect(page.getByPlaceholder('邮箱')).toBeVisible();
    
    // 截取移动端页面截图
    const mobileScreenshotPath = path.join('docs', 'screenshots', 'e2e-tests', `login-page-mobile-${browserName}.png`);
    await page.screenshot({ 
      path: mobileScreenshotPath,
      fullPage: true 
    });
  });
});
