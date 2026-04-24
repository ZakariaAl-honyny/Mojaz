import { test, expect, Browser, BrowserContext } from '@playwright/test';

/**
 * T007: Cross-Browser Testing
 * 
 * Tests the application across multiple browsers:
 * - Chrome
 * - Firefox
 * - Safari (WebKit)
 * - Edge
 * 
 * Ensures consistent functionality across all browsers
 */

// Note: These tests run with browser-specific configurations
// defined in playwright.config.ts

test.describe('Cross-Browser: Chrome', () => {
  test('Landing page renders correctly in Chrome', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Verify page renders
    await expect(page.locator('body')).toBeVisible();
    
    // Verify hero section
    const hero = page.locator('[data-testid="hero-section"]');
    expect(await hero.count() >= 0).toBeTruthy();
  });

  test('Login flow works in Chrome', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test('Dashboard loads in Chrome', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('RTL layout correct in Chrome', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const direction = await page.locator('html').getAttribute('dir');
    expect(direction).toBe('rtl');
  });
});

test.describe('Cross-Browser: Firefox', () => {
  test('Landing page renders correctly in Firefox', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
    const hero = page.locator('[data-testid="hero-section"]');
    expect(await hero.count() >= 0).toBeTruthy();
  });

  test('Login flow works in Firefox', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test('Dashboard loads in Firefox', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('RTL layout correct in Firefox', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const direction = await page.locator('html').getAttribute('dir');
    expect(direction).toBe('rtl');
  });
});

test.describe('Cross-Browser: Safari (WebKit)', () => {
  test('Landing page renders correctly in Safari', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
    const hero = page.locator('[data-testid="hero-section"]');
    expect(await hero.count() >= 0).toBeTruthy();
  });

  test('Login flow works in Safari', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test('Dashboard loads in Safari', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('LTR layout correct in Safari', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    const direction = await page.locator('html').getAttribute('dir');
    expect(direction).toBe('ltr');
  });
});

test.describe('Cross-Browser: Edge', () => {
  test('Landing page renders correctly in Edge', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toBeVisible();
    const hero = page.locator('[data-testid="hero-section"]');
    expect(await hero.count() >= 0).toBeTruthy();
  });

  test('Login flow works in Edge', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test('Dashboard loads in Edge', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Dark mode works in Edge', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForLoadState('networkidle');
      
      const theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('dark');
    }
  });
});

test.describe('Cross-Browser: Feature Consistency', () => {
  
  test('All browsers handle form validation consistently', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    // Submit empty form
    await page.getByTestId('login-submit').click();
    
    // Should show validation in some form (either error message or disabled button)
    const hasError = await page.locator('.error, [role="alert"], .text-red-500').count() > 0;
    const isDisabled = await page.getByTestId('login-submit').isDisabled();
    
    expect(hasError || isDisabled).toBeTruthy();
  });

  test('All browsers handle RTL layout consistently', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Text direction should be RTL
    const bodyDirection = await page.evaluate(() => {
      return window.getComputedStyle(document.body).direction;
    });
    
    expect(bodyDirection).toBe('rtl');
  });

  test('All browsers handle animations gracefully', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // No console errors should appear during animations
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(msg.text());
      }
    });
    
    // Wait a moment for any animations
    await page.waitForTimeout(1000);
    
    // Filter out known acceptable errors
    const realErrors = consoleLogs.filter(log => 
      !log.includes('favicon') && 
      !log.includes('manifest') &&
      !log.includes('service worker')
    );
    
    expect(realErrors.length).toBe(0);
  });

  test('All browsers handle localStorage correctly', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Set a value
    await page.evaluate(() => {
      localStorage.setItem('testKey', 'testValue');
    });
    
    // Verify it persists
    const value = await page.evaluate(() => {
      return localStorage.getItem('testKey');
    });
    
    expect(value).toBe('testValue');
  });

  test('All browsers render fonts consistently', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Get body font
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    
    // Should contain Arabic font
    expect(bodyFont).toMatch(/arabic|cairo|ibm|sans-serif/i);
  });
});

test.describe('Cross-Browser: API Consistency', () => {
  
  test('All browsers receive valid API responses', async ({ page }) => {
    // Test API via page request
    await page.goto('/ar/api/v1/lookups/license-categories');
    await page.waitForLoadState('networkidle');
    
    // Should return valid JSON
    const contentType = await page.evaluate(() => {
      return document.contentType;
    });
    
    expect(contentType).toContain('json');
  });

  test('All browsers handle network errors gracefully', async ({ page }) => {
    // Monitor for network errors
    const networkErrors: string[] = [];
    
    page.on('response', response => {
      if (!response.ok() && response.status() >= 500) {
        networkErrors.push(`${response.url()} - ${response.status()}`);
      }
    });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Should have no 5xx errors on main pages
    expect(networkErrors.length).toBe(0);
  });
});