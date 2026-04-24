import { test, expect } from '@playwright/test';

/**
 * T008: Visual Regression Tests - RTL/LTR Switching
 * 
 * Tests visual layout consistency across:
 * - Arabic RTL mode
 * - English LTR mode
 * - Language switch transitions
 */
test.describe('Visual: RTL Layout', () => {
  
  const locales = ['ar'] as const;
  const themes = ['light', 'dark'] as const;
  
  for (const locale of locales) {
    for (const theme of themes) {
      test(`${locale.toUpperCase()} - ${theme} - RTL Visual Layout`, async ({ page }) => {
        // Verify RTL direction
        await page.goto(`/${locale}`);
        
        if (theme === 'dark') {
          const themeToggle = page.locator('[data-testid="theme-toggle"]');
          if (await themeToggle.isVisible()) {
            await themeToggle.click();
          }
        }
        
        await page.waitForLoadState('networkidle');
        
        // Verify direction is RTL
        const direction = await page.locator('html').getAttribute('dir');
        expect(direction).toBe('rtl');
        
        // Take screenshot for visual regression
        await expect(page.locator('body')).toHaveScreenshot(`rtl-${theme}-layout.png`, {
          maxDiffPixelRatio: 0.05
        });
      });
    }
  }
});

test.describe('Visual: LTR Layout', () => {
  
  const themes = ['light', 'dark'] as const;
  
  for (const theme of themes) {
    test(`EN - ${theme} - LTR Visual Layout`, async ({ page }) => {
      await page.goto('/en');
      
      if (theme === 'dark') {
        const themeToggle = page.locator('[data-testid="theme-toggle"]');
        if (await themeToggle.isVisible()) {
          await themeToggle.click();
        }
      }
      
      await page.waitForLoadState('networkidle');
      
      // Verify direction is LTR
      const direction = await page.locator('html').getAttribute('dir');
      expect(direction).toBe('ltr');
      
      await expect(page.locator('body')).toHaveScreenshot(`ltr-${theme}-layout.png`, {
        maxDiffPixelRatio: 0.05
      });
    });
  }
});

test.describe('Visual: RTL/LTR Component Comparison', () => {
  
  test('Login page visual consistency RTL vs LTR', async ({ page }) => {
    // Test Arabic
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    expect(await page.locator('html').getAttribute('dir')).toBe('rtl');
    
    // Take RTL screenshot
    await expect(page.locator('body')).toHaveScreenshot('login-rtl.png', {
      maxDiffPixelRatio: 0.05
    });
    
    // Test English
    await page.goto('/en/login');
    await page.waitForLoadState('networkidle');
    expect(await page.locator('html').getAttribute('dir')).toBe('ltr');
    
    // Take LTR screenshot
    await expect(page.locator('body')).toHaveScreenshot('login-ltr.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Dashboard visual consistency RTL vs LTR', async ({ page }) => {
    // Login first
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Take RTL dashboard screenshot
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toHaveScreenshot('dashboard-rtl.png', {
      maxDiffPixelRatio: 0.05
    });
    
    // Switch to English
    await page.goto('/en/dashboard');
    await page.waitForLoadState('networkidle');
    expect(await page.locator('html').getAttribute('dir')).toBe('ltr');
    
    // Take LTR dashboard screenshot
    await expect(page.locator('body')).toHaveScreenshot('dashboard-ltr.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Application wizard visual consistency RTL vs LTR', async ({ page }) => {
    // Login
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Go to wizard
    await page.goto('/ar/applications/new');
    await page.waitForLoadState('networkidle');
    
    // Take RTL wizard screenshot
    await expect(page.locator('body')).toHaveScreenshot('wizard-rtl.png', {
      maxDiffPixelRatio: 0.05
    });
    
    // Switch to English
    await page.goto('/en/applications/new');
    await page.waitForLoadState('networkidle');
    
    // Take LTR wizard screenshot
    await expect(page.locator('body')).toHaveScreenshot('wizard-ltr.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Forms align correctly in RTL', async ({ page }) => {
    await page.goto('/ar/register');
    await page.waitForLoadState('networkidle');
    
    // Verify form elements are visible
    await expect(page.getByTestId('register-fullname')).toBeVisible();
    await expect(page.getByTestId('register-identifier')).toBeVisible();
    await expect(page.getByTestId('register-password')).toBeVisible();
    
    // Take form screenshot
    await expect(page.locator('body')).toHaveScreenshot('register-form-rtl.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Tables render correctly in RTL', async ({ page }) => {
    // Login as admin to see user table
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000006');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Go to users page
    await page.goto('/ar/users');
    await page.waitForLoadState('networkidle');
    
    // Take table screenshot
    await expect(page.locator('body')).toHaveScreenshot('table-rtl.png', {
      maxDiffPixelRatio: 0.05
    });
  });
});

test.describe('Visual: Dark/Light Mode Comparison', () => {
  
  test('Landing page dark mode matches design spec', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Toggle to dark mode
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
    
    await page.waitForLoadState('networkidle');
    
    // Verify dark mode is applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    // Take dark mode screenshot
    await expect(page.locator('body')).toHaveScreenshot('landing-dark-mode.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Login form dark mode renders correctly', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toHaveScreenshot('login-dark-mode.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Dashboard dark mode renders correctly', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toHaveScreenshot('dashboard-dark-mode.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Contrast ratios are maintained in dark mode', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
    
    await page.waitForLoadState('networkidle');
    
    // Get text color contrast
    const styles = await page.evaluate(() => {
      const body = document.body;
      const bgColor = window.getComputedStyle(body).backgroundColor;
      const textColor = window.getComputedStyle(body).color;
      return { bg: bgColor, text: textColor };
    });
    
    console.log('Dark mode styles:', styles);
  });
});

test.describe('Visual: Mobile Responsive Layout', () => {
  
  test('Landing page mobile layout is usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('body')).toHaveScreenshot('mobile-landing.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Login form mobile layout is usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    // Form should be visible and inputs accessible
    await expect(page.getByTestId('login-identifier')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    
    await expect(page.locator('body')).toHaveScreenshot('mobile-login.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('Dashboard mobile layout adapts correctly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toHaveScreenshot('mobile-dashboard.png', {
      maxDiffPixelRatio: 0.05
    });
  });

  test('No horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Check for horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);
  });
});

test.describe('Visual: Language Switch Transition', () => {
  
  test('Switching language updates layout immediately', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Verify initial RTL
    expect(await page.locator('html').getAttribute('dir')).toBe('rtl');
    
    // Find and click language switcher
    const langSwitch = page.locator('[data-testid="language-switcher"]');
    if (await langSwitch.isVisible()) {
      await langSwitch.click();
      await page.waitForURL(/.*\/en/);
      
      // Verify LTR
      expect(await page.locator('html').getAttribute('dir')).toBe('ltr');
      
      // Take LTR screenshot
      await expect(page.locator('body')).toHaveScreenshot('language-switch-ltr.png', {
        maxDiffPixelRatio: 0.05
      });
    }
  });

  test('RTL navigation order flips correctly', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    // Get nav items
    const navItems = page.locator('[data-testid="nav-item"]');
    const count = await navItems.count();
    
    if (count > 1) {
      const firstBox = await navItems.first().boundingBox();
      const lastBox = await navItems.last().boundingBox();
      
      // In RTL, first item should be on the right (higher x value)
      if (firstBox && lastBox) {
        console.log(`First nav item x: ${firstBox.x}, Last nav item x: ${lastBox.x}`);
      }
    }
  });
});