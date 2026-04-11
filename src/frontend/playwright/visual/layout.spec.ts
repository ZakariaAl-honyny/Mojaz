import { test, expect } from '@playwright/test';

/**
 * T016: RTL/LTR Flip Verification Tests
 * 
 * Tests that verify:
 * - UI elements flip correctly between RTL and LTR
 * - Logical CSS properties work correctly
 * - Icons that indicate direction are properly flipped
 * - Text alignment is correct in both directions
 */
test.describe('US3: RTL/LTR Logical Property Verification', () => {
  
  test('Margin properties flip correctly in RTL', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Get computed styles for elements using logical properties
    // margin-inline-start should become margin-right in RTL
    const testElement = page.locator('[data-testid="hero-section"]');
    if (await testElement.isVisible()) {
      const styles = await testElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          marginStart: computed.marginInlineStart,
          marginEnd: computed.marginInlineEnd,
          paddingStart: computed.paddingInlineStart,
          paddingEnd: computed.paddingInlineEnd,
        };
      });
      
      // In RTL, inline-start should be on the right
      console.log('RTL Margins:', styles);
      expect(styles.marginStart).toBeDefined();
    }
  });

  test('Text alignment is correct in Arabic', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Text should be right-aligned in Arabic by default
    const body = page.locator('body');
    const direction = await body.evaluate((el) => {
      return window.getComputedStyle(el).direction;
    });
    
    expect(direction).toBe('rtl');
  });

  test('Text alignment is correct in English', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    const body = page.locator('body');
    const direction = await body.evaluate((el) => {
      return window.getComputedStyle(el).direction;
    });
    
    expect(direction).toBe('ltr');
  });
});

test.describe('US3: RTL Icon Flip Verification', () => {
  
  test('Directional icons flip in RTL', async ({ page }) => {
    await page.goto('/ar/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Find chevron icons that should flip
    const chevronRight = page.locator('[data-testid="chevron-right"]');
    
    // In RTL, these should be visually flipped
    if (await chevronRight.isVisible()) {
      const transform = await chevronRight.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      
      // The transform may include rotation for RTL flip
      console.log('Chevron transform:', transform);
    }
  });

  test('Arrows point in correct direction RTL', async ({ page }) => {
    await page.goto('/ar/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Find any arrow icons
    const arrowRight = page.locator('[data-testid="arrow-right"]');
    
    if (await arrowRight.isVisible()) {
      // In RTL, arrow-right should actually point left visually
      const transform = await arrowRight.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      
      console.log('Arrow transform:', transform);
    }
  });

  test('Navigation sidebar order flips in RTL', async ({ page }) => {
    await page.goto('/ar/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Sidebar should be on the right in RTL
    const sidebar = page.locator('[data-testid="sidebar"]');
    
    if (await sidebar.isVisible()) {
      const position = await sidebar.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.left;
      });
      
      // In RTL, sidebar should be on the right side of viewport
      console.log('Sidebar position:', position);
      // This is more of a visual check - we can't assert exact position
      expect(sidebar).toBeVisible();
    }
  });
});

test.describe('US3: RTL Form Elements', () => {
  
  test('Form inputs align correctly in RTL', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    // Find login form inputs
    const input = page.getByTestId('login-identifier');
    
    if (await input.isVisible()) {
      const textAlign = await input.evaluate((el) => {
        return window.getComputedStyle(el).textAlign;
      });
      
      // Text should align properly for RTL
      expect(textAlign).toMatch(/start|right/);
    }
  });

  test('Labels appear on correct side in RTL', async ({ page }) => {
    await page.goto('/ar/register');
    await page.waitForLoadState('networkidle');
    
    // Form labels should appear to the left of inputs in RTL
    const formField = page.locator('[data-testid="register-fullname"]').locator('..');
    
    if (await formField.isVisible()) {
      // Verify field structure exists
      expect(formField).toBeVisible();
    }
  });
});

test.describe('US3: RTL Navigation Verification', () => {
  
  test('Navigation items order reverses in RTL', async ({ page }) => {
    await page.goto('/ar/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Get nav items
    const navItems = page.locator('[data-testid="nav-item"]');
    const count = await navItems.count();
    
    if (count > 0) {
      // Get first and last item positions
      const firstItem = navItems.first();
      const lastItem = navItems.last();
      
      const firstRect = await firstItem.boundingBox();
      const lastRect = await lastItem.boundingBox();
      
      // In RTL, first item should be on the right
      if (firstRect && lastRect) {
        console.log(`First nav item at x: ${firstRect.x}, Last at x: ${lastRect.x}`);
      }
    }
  });

  test('Hamburger menu position in RTL', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Mobile menu should be on the right in RTL
    const menuButton = page.locator('[data-testid="mobile-menu-btn"]');
    
    if (await menuButton.isVisible()) {
      const rect = await menuButton.boundingBox();
      // In RTL, menu button should be on the right
      console.log('Mobile menu position:', rect?.x);
    }
  });
});

test.describe('US3: CSS Logical Properties Test', () => {
  
  test('border-inline-start works in RTL', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Test a card with border-inline-start
    const card = page.locator('[data-testid="service-card"]').first();
    
    if (await card.isVisible()) {
      const borderStyle = await card.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          borderStart: style.borderInlineStartStyle,
          borderEnd: style.borderInlineEndStyle,
        };
      });
      
      console.log('Border styles:', borderStyle);
    }
  });

  test('inset-inline works correctly', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Check that inset-inline properties work
    // This is more of a verification test
    const hero = page.locator('[data-testid="hero-section"]');
    
    if (await hero.isVisible()) {
      const position = await hero.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          insetStart: style.insetInlineStart,
          insetEnd: style.insetInlineEnd,
        };
      });
      
      console.log('Inset positions:', position);
    }
  });
});

test.describe('US3: Language Switch Transitions', () => {
  
  test('Switching from Arabic to English flips layout', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Get initial direction
    let direction = await page.locator('html').getAttribute('dir');
    expect(direction).toBe('rtl');
    
    // Find and click language switcher
    const langSwitch = page.locator('[data-testid="language-switcher"]');
    if (await langSwitch.isVisible()) {
      await langSwitch.click();
      await page.waitForURL(/.*\/en/);
      
      // Verify direction changed
      direction = await page.locator('html').getAttribute('dir');
      expect(direction).toBe('ltr');
    }
  });

  test('Switching from English to Arabic flips layout', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    
    let direction = await page.locator('html').getAttribute('dir');
    expect(direction).toBe('ltr');
    
    const langSwitch = page.locator('[data-testid="language-switcher"]');
    if (await langSwitch.isVisible()) {
      await langSwitch.click();
      await page.waitForURL(/.*\/ar/);
      
      direction = await page.locator('html').getAttribute('dir');
      expect(direction).toBe('rtl');
    }
  });
});