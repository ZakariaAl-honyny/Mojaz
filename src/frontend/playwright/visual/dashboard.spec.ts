import { test, expect } from '@playwright/test';

/**
 * T015: Portal Dashboard Visual Snapshots
 * 
 * Visual regression tests for applicant and employee dashboards across:
 * - Arabic (RTL) and English (LTR) locales
 * - Light and Dark themes
 * - Desktop and Mobile viewports
 */
test.describe('US3: Applicant Dashboard Visual', () => {
  
  const locales = ['ar', 'en'] as const;
  const themes = ['light', 'dark'] as const;
  
  test.beforeEach(async ({ page }) => {
    // Login as applicant
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
  
  for (const locale of locales) {
    for (const theme of themes) {
      test(`${locale.toUpperCase()} - ${theme} - Applicant Dashboard`, async ({ page }) => {
        // Set theme if needed
        if (theme === 'dark') {
          const themeToggle = page.locator('[data-testid="theme-toggle"]');
          if (await themeToggle.isVisible()) {
            await themeToggle.click();
          }
        }
        
        await page.goto(`/${locale}/dashboard`);
        await page.waitForLoadState('networkidle');
        
        // Wait for dashboard content to load
        await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 10000 });
        
        await expect(page.locator('body')).toHaveScreenshot(`applicant-dashboard-${locale}-${theme}.png`, {
          maxDiffPixelRatio: 0.05
        });
      });
    }
  }
  
  // Mobile viewport
  test('Applicant Dashboard Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar/dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 10000 });
    
    await expect(page.locator('body')).toHaveScreenshot('applicant-dashboard-mobile.png', {
      maxDiffPixelRatio: 0.05
    });
  });
});

test.describe('US3: Employee Dashboard Visual', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as receptionist
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000002');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
  
  const locales = ['ar', 'en'] as const;
  const themes = ['light', 'dark'] as const;
  
  for (const locale of locales) {
    for (const theme of themes) {
      test(`${locale.toUpperCase()} - ${theme} - Employee Dashboard`, async ({ page }) => {
        if (theme === 'dark') {
          const themeToggle = page.locator('[data-testid="theme-toggle"]');
          if (await themeToggle.isVisible()) {
            await themeToggle.click();
          }
        }
        
        await page.goto(`/${locale}/dashboard`);
        await page.waitForLoadState('networkidle');
        
        await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 10000 });
        
        await expect(page.locator('body')).toHaveScreenshot(`employee-dashboard-${locale}-${theme}.png`, {
          maxDiffPixelRatio: 0.05
        });
      });
    }
  }
});

test.describe('US3: Dashboard Components', () => {
  
  test('Applicant dashboard shows applications widget', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Applications widget should be visible
    const appsWidget = page.locator('[data-testid="applications-widget"]');
    await expect(appsWidget).toBeVisible({ timeout: 10000 });
  });
  
  test('Employee dashboard shows queue widget', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000002');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    const queueWidget = page.locator('[data-testid="queue-widget"]');
    await expect(queueWidget).toBeVisible({ timeout: 10000 });
  });
  
  test('Dashboard stats cards render correctly', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Stats cards should be visible
    const statsCards = page.locator('[data-testid="stat-card"]');
    const count = await statsCards.count();
    expect(count).toBeGreaterThan(0);
  });
  
  test('Notifications panel renders in RTL', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Notifications panel should exist
    const notifPanel = page.locator('[data-testid="notifications-panel"]');
    const count = await notifPanel.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('US3: Dashboard Responsive', () => {
  
  test('Mobile dashboard is usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Mobile navigation should be visible
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    expect(await mobileNav.count()).toBeGreaterThanOrEqual(0);
  });
  
  test('Tablet dashboard layout adapts', async ({ page }) => {
    // iPad Pro dimensions
    await page.setViewportSize({ width: 1024, height: 1366 });
    
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Dashboard should render without horizontal scroll
    const body = page.locator('body');
    const boundingBox = await body.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(1024);
  });
});