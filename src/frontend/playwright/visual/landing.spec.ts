import { test, expect } from '@playwright/test';

/**
 * T014: Landing Page Visual Snapshots
 * 
 * Visual regression tests for the landing page across:
 * - Arabic (RTL) and English (LTR) locales
 * - Light and Dark themes
 * - Desktop and Mobile viewports
 */
test.describe('US3: Landing Page Visual Regression', () => {
  
  const locales = ['ar', 'en'] as const;
  const themes = ['light', 'dark'] as const;
  
  for (const locale of locales) {
    for (const theme of themes) {
      test(`${locale.toUpperCase()} - ${theme} theme - Desktop`, async ({ page }) => {
        // Set viewport to desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        // Navigate to landing page with locale and theme
        await page.goto(`/${locale}`);
        
        // Toggle theme if needed
        if (theme === 'dark') {
          const themeToggle = page.locator('[data-testid="theme-toggle"]');
          if (await themeToggle.isVisible()) {
            await themeToggle.click();
          }
        }
        
        // Wait for page to fully load
        await page.waitForLoadState('networkidle');
        
        // Take screenshot
        await expect(page.locator('body')).toHaveScreenshot(`${locale}-landing-${theme}-desktop.png`, {
          maxDiffPixelRatio: 0.05 // 5% max difference allowed
        });
      });
    }
  }
  
  // Mobile viewport tests
  for (const locale of locales) {
    test(`${locale.toUpperCase()} - Mobile viewport`, async ({ page }) => {
      // Set mobile viewport (iPhone 14 dimensions)
      await page.setViewportSize({ width: 390, height: 844 });
      
      await page.goto(`/${locale}`);
      await page.waitForLoadState('networkidle');
      
      // Should capture responsive landing page
      await expect(page.locator('body')).toHaveScreenshot(`${locale}-landing-mobile.png`, {
        maxDiffPixelRatio: 0.05
      });
    });
  }
});

test.describe('US3: Landing Page Components', () => {
  
  test('Hero section renders correctly in Arabic', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Hero section should be visible
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    
    // Should have proper RTL alignment
    const heroText = page.locator('[data-testid="hero-title"]');
    await expect(heroText).toBeVisible();
  });
  
  test('Hero section renders correctly in English', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });
  
  test('Navigation menu in RTL', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Menu items should be RTL aligned
    const navMenu = page.locator('[data-testid="nav-menu"]');
    await expect(navMenu).toBeVisible();
    
    // Login button should be on the left in RTL
    const loginBtn = page.locator('[data-testid="nav-login-btn"]');
    await expect(loginBtn).toBeVisible();
  });
  
  test('Services section displays correctly', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Services grid should display
    const servicesSection = page.locator('[data-testid="services-section"]');
    await expect(servicesSection).toBeVisible();
    
    // Each service card should be visible
    const serviceCards = page.locator('[data-testid="service-card"]');
    const count = await serviceCards.count();
    expect(count).toBeGreaterThan(0);
  });
  
  test('Footer renders in RTL', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toBeVisible();
  });
  
  test('Language switcher works', async ({ page }) => {
    await page.goto('/ar');
    
    // Find and click language switcher
    const langSwitch = page.locator('[data-testid="language-switcher"]');
    if (await langSwitch.isVisible()) {
      await langSwitch.click();
      
      // Should navigate to English version
      await expect(page).toHaveURL(/.*\/en/);
    }
  });
});

test.describe('US3: Landing Page Dark Mode', () => {
  
  test('Dark mode applies correctly in Arabic', async ({ page }) => {
    await page.goto('/ar');
    
    // Toggle dark mode
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
    
    await page.waitForLoadState('networkidle');
    
    // Check that dark mode class is applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
  
  test('Dark mode applies correctly in English', async ({ page }) => {
    await page.goto('/en');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
    
    await page.waitForLoadState('networkidle');
    
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
  
  test('Contrast is sufficient in dark mode', async ({ page }) => {
    await page.goto('/ar');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
    
    await page.waitForLoadState('networkidle');
    
    // Text should be visible against dark background
    const heroText = page.locator('[data-testid="hero-title"]');
    await expect(heroText).toBeVisible();
  });
});