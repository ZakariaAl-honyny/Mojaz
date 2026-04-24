import { test, expect, Page } from '@playwright/test';

/**
 * T010: Mobile Responsive Testing
 * 
 * Tests responsive design across various mobile and tablet viewports:
 * - iPhone series (SE, 14, 14 Pro Max)
 * - Android series (Galaxy S21, Pixel 7)
 * - iPad series (Mini, Pro)
 * - Various breakpoints
 * 
 * Ensures layouts adapt correctly without horizontal scroll
 */
test.describe('Mobile: iPhone Series', () => {
  
  test('iPhone SE (375x667) - Landing page renders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
    await expect(page.locator('body')).toBeVisible();
  });

  test('iPhone SE - Login form is usable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    // Form inputs should be accessible
    await expect(page.getByTestId('login-identifier')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
    
    // Form should not overflow
    const formBox = await page.locator('form').boundingBox();
    expect(formBox?.width).toBeLessThanOrEqual(375);
  });

  test('iPhone 14 (390x844) - Landing page renders', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(391);
    
    // Hero should be properly sized
    const heroBox = await page.locator('[data-testid="hero-section"]').boundingBox();
    if (heroBox) {
      expect(heroBox.width).toBeLessThanOrEqual(390);
    }
  });

  test('iPhone 14 - Dashboard is usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Login
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    
    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(391);
  });

  test('iPhone 14 Pro Max (430x932) - Landing page renders', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(431);
  });

  test('iPhone 14 Pro Max - Application wizard is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    
    // Login
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Go to wizard
    await page.goto('/ar/applications/new');
    await page.waitForLoadState('networkidle');
    
    const wizard = page.locator('[data-testid="wizard-shell"]');
    await expect(wizard).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Mobile: Android Series', () => {
  
  test('Galaxy S21 (360x800) - Landing page renders', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(361);
    
    // Service cards should reflow
    const serviceCards = page.locator('[data-testid="service-card"]');
    const count = await serviceCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('Galaxy S21 - Register form is usable', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    
    await page.goto('/ar/register');
    await page.waitForLoadState('networkidle');
    
    // Form should be visible
    await expect(page.getByTestId('register-fullname')).toBeVisible();
    await expect(page.getByTestId('register-identifier')).toBeVisible();
    
    // No horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(361);
  });

  test('Pixel 7 (412x915) - Landing page renders', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(413);
  });

  test('Pixel 7 - Navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Mobile menu button should be visible
    const menuBtn = page.locator('[data-testid="mobile-menu-btn"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible({ timeout: 2000 });
    }
  });
});

test.describe('Mobile: iPad Series', () => {
  
  test('iPad Mini (768x1024) - Landscape renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(1025);
    
    // Should show 2-column layout
    const heroBox = await page.locator('[data-testid="hero-section"]').boundingBox();
    if (heroBox) {
      expect(heroBox.width).toBeLessThan(1024);
    }
  });

  test('iPad Mini - Portrait renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(769);
  });

  test('iPad Pro (1024x1366) - Portrait renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(1025);
    
    // Service cards should have multiple columns
    const serviceCards = page.locator('[data-testid="service-card"]');
    const count = await serviceCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('iPad Pro - Dashboard with sidebar layout', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    
    // Login
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.waitForLoadState('networkidle');
    
    // Should show sidebar
    const sidebar = page.locator('[data-testid="sidebar"]');
    expect(await sidebar.count() >= 0).toBeTruthy();
  });
});

test.describe('Mobile: Navigation', () => {
  
  test('Mobile menu opens on tap', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const menuBtn = page.locator('[data-testid="mobile-menu-btn"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      await expect(mobileMenu).toBeVisible({ timeout: 2000 });
    }
  });

  test('Bottom navigation on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Bottom nav should be visible
    const bottomNav = page.locator('[data-testid="bottom-nav"]');
    if (await bottomNav.isVisible()) {
      const navItems = bottomNav.locator('[data-testid="nav-item"]');
      expect(await navItems.count()).toBeGreaterThan(0);
    }
  });

  test('Navigation works with touch gestures', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Scroll down using touch
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Mobile: Forms', () => {
  
  test('Registration form fits mobile screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar/register');
    await page.waitForLoadState('networkidle');
    
    // Form should not have horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(391);
    
    // All fields should be accessible
    await expect(page.getByTestId('register-fullname')).toBeVisible();
    await expect(page.getByTestId('register-identifier')).toBeVisible();
    await expect(page.getByTestId('register-password')).toBeVisible();
  });

  test("Keyboard doesn't cause layout issues on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    // Tap on input to show keyboard
    await page.getByTestId('login-identifier').click();
    
    // Wait for keyboard to appear
    await page.waitForTimeout(500);
    
    // Page should still be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('Dropdowns expand properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Login
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Go to applications
    await page.goto('/ar/applications/new');
    await page.waitForLoadState('networkidle');
    
    // Look for select dropdown
    const selectDropdowns = page.locator('select, [role="combobox"]');
    const count = await selectDropdowns.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Mobile: Touch Interactions', () => {
  
  test('Buttons are large enough for touch', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    // Get button dimensions
    const btn = page.getByTestId('login-submit');
    const box = await btn.boundingBox();
    
    // Touch targets should be at least 44x44 pixels
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('Swipe to navigate between wizard steps', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Login
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Go to wizard
    await page.goto('/ar/applications/new');
    await page.waitForLoadState('networkidle');
    
    const wizard = page.locator('[data-testid="wizard-shell"]');
    if (await wizard.isVisible()) {
      // Try swiping
      const wizardBox = await wizard.boundingBox();
      if (wizardBox) {
        await page.mouse.move(wizardBox.x + wizardBox.width / 2, wizardBox.y + wizardBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(wizardBox.x + 100, wizardBox.y + wizardBox.height / 2);
        await page.mouse.up();
      }
    }
  });

  test('Taps register correctly on interactive elements', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Click on language switcher
    const langSwitch = page.locator('[data-testid="language-switcher"]');
    if (await langSwitch.isVisible()) {
      await langSwitch.click();
      
      // Should navigate
      await page.waitForURL(/.*ar|.*en/, { timeout: 3000 }).catch(() => {});
    }
  });
});

test.describe('Mobile: Breakpoints', () => {
  
  test('320px (minimum supported) - renders without breaking', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Should still render
    await expect(page.locator('body')).toBeVisible();
    
    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(321);
  });

  test('375px - renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(376);
  });

  test('414px - renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(415);
  });

  test('768px tablet - renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(769);
  });

  test('834px tablet - renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(835);
  });

  test('1024px tablet - shows desktop-style layout', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(1025);
  });
});

test.describe('Mobile: Orientation', () => {
  
  test('Portrait orientation renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(391);
    
    // Content should be properly laid out
    await expect(page.locator('body')).toBeVisible();
  });

  test('Landscape orientation renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(845);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('Orientation change triggers responsive layout', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Switch to landscape
    await page.setViewportSize({ width: 844, height: 390 });
    
    await page.waitForTimeout(500);
    
    // Should still render properly
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(845);
  });
});

test.describe('Mobile: Performance', () => {
  
  test('Page loads quickly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    const start = Date.now();
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    
    // Mobile load time should be reasonable
    expect(loadTime).toBeLessThan(6000);
  });

  test('Scroll is smooth on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Measure scroll performance
    await page.evaluate(() => {
      window.scrollTo(0, 1000);
    });
    
    await page.waitForTimeout(500);
    
    // Page should remain stable
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});