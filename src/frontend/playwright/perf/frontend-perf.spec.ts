import { test, expect } from '@playwright/test';

/**
 * T018: Frontend Performance Metrics (FCP/LCP)
 * 
 * Tests frontend performance metrics:
 * - First Contentful Paint (FCP) < 3s
 * - Largest Contentful Paint (LCP) < 3s
 * - Time to Interactive (TTI)
 * - Cumulative Layout Shift (CLS)
 */
test.describe('US4: Frontend Performance Metrics', () => {
  
  // SLA: FCP < 3000ms
  const FCP_SLA_MS = 3000;
  
  test('Landing page FCP is within SLA', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('domcontentloaded');
    
    // Get FCP using performance API
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
          resolve(fcpEntry?.startTime || null);
        }).observe({ type: 'paint', buffered: true });
        
        // Fallback if FCP already happened
        const paintTiming = performance.getEntriesByType('paint');
        const fcpTiming = paintTiming.find(entry => entry.name === 'first-contentful-paint');
        if (fcpTiming) {
          resolve(fcpTiming.startTime);
        }
      });
    });
    
    console.log(`FCP (Landing): ${fcp}ms (SLA: ${FCP_SLA_MS}ms)`);
    if (fcp) {
      expect(fcp).toBeLessThan(FCP_SLA_MS);
    }
  });
  
  test('Login page FCP is within SLA', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('domcontentloaded');
    
    const fcp = await page.evaluate(() => {
      const paintTiming = performance.getEntriesByType('paint');
      const fcpTiming = paintTiming.find(entry => entry.name === 'first-contentful-paint');
      return fcpTiming?.startTime || null;
    });
    
    console.log(`FCP (Login): ${fcp}ms (SLA: ${FCP_SLA_MS}ms)`);
    if (fcp) {
      expect(fcp).toBeLessThan(FCP_SLA_MS);
    }
  });
  
  test('Dashboard page LCP is within SLA', async ({ page }) => {
    // Login first
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Wait for LCP to potentially load
    await page.waitForLoadState('networkidle');
    
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry?.renderTime || lastEntry?.startTime || null);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Fallback
        const paintTiming = performance.getEntriesByType('largest-contentful-paint');
        if (paintTiming.length > 0) {
          const last = paintTiming[paintTiming.length - 1] as any;
          resolve(last?.renderTime || last?.startTime);
        }
      });
    });
    
    const LCP_SLA_MS = 3000;
    console.log(`LCP (Dashboard): ${lcp}ms (SLA: ${LCP_SLA_MS}ms)`);
    if (lcp) {
      expect(lcp).toBeLessThan(LCP_SLA_MS);
    }
  });
});

test.describe('US4: Page Load Performance', () => {
  
  test('Landing page loads within time limit', async ({ page }) => {
    const start = Date.now();
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - start;
    const PAGE_LOAD_SLA_MS = 4000;
    
    console.log(`Page Load (Landing): ${loadTime}ms (SLA: ${PAGE_LOAD_SLA_MS}ms)`);
    expect(loadTime).toBeLessThan(PAGE_LOAD_SLA_MS);
  });
  
  test('Login page loads quickly', async ({ page }) => {
    const start = Date.now();
    
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - start;
    console.log(`Page Load (Login): ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('Dashboard loads within time limit', async ({ page }) => {
    const start = Date.now();
    
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - start;
    console.log(`Page Load (Dashboard): ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });
  
  test('Applications list loads within time limit', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    const start = Date.now();
    await page.goto('/ar/applications');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - start;
    console.log(`Page Load (Applications): ${loadTime}ms`);
    expect(loadTime).toBeLessThan(4000);
  });
});

test.describe('US4: Interaction Performance', () => {
  
  test('Form submission responds quickly', async ({ page }) => {
    await page.goto('/ar/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    
    const start = Date.now();
    await page.getByTestId('login-submit').click();
    
    // Wait for navigation to start
    await page.waitForURL(/.*dashboard|.*login/, { timeout: 5000 }).catch(() => {});
    const responseTime = Date.now() - start;
    
    console.log(`Form Submit Response: ${responseTime}ms`);
    expect(responseTime).toBeLessThan(2000);
  });
  
  test('Navigation between pages is fast', async ({ page }) => {
    await page.goto('/ar/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Navigate to applications
    const start = Date.now();
    await page.goto('/ar/applications');
    await page.waitForLoadState('domcontentloaded');
    const navTime = Date.now() - start;
    
    console.log(`Page Navigation: ${navTime}ms`);
    expect(navTime).toBeLessThan(2000);
  });
  
  test('Modal opens quickly', async ({ page }) => {
    await page.goto('/ar/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Find a button that might open a modal
    const modalTrigger = page.locator('[data-testid="modal-trigger"]').first();
    
    if (await modalTrigger.isVisible()) {
      const start = Date.now();
      await modalTrigger.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 1000 }).catch(() => {});
      const modalTime = Date.now() - start;
      
      console.log(`Modal Open: ${modalTime}ms`);
      expect(modalTime).toBeLessThan(500);
    }
  });
});

test.describe('US4: Performance Metrics Collection', () => {
  
  test('Collect full performance metrics', async ({ page }) => {
    await page.goto('/ar/dashboard');
    await page.waitForLoadState('networkidle');
    
    const metrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const navigationEntries = performance.getEntriesByType('navigation');
      const resourceEntries = performance.getEntriesByType('resource');
      
      return {
        paint: paintEntries.map(e => ({ name: e.name, startTime: e.startTime })),
        navigation: navigationEntries.map(e => ({
          type: (e as any).type,
          duration: e.duration,
          transferSize: (e as any).transferSize
        })),
        resourceCount: resourceEntries.length,
        resourcesSize: resourceEntries.reduce((sum: number, e: any) => sum + (e.transferSize || 0), 0)
      };
    });
    
    console.log('\n=== Performance Metrics ===');
    console.log('Paint Entries:', metrics.paint);
    console.log('Resource Count:', metrics.resourceCount);
    console.log('Total Resources Size:', (metrics.resourcesSize / 1024).toFixed(2), 'KB');
    console.log('===========================\n');
    
    // Basic sanity checks
    expect(metrics.resourceCount).toBeGreaterThan(0);
  });
  
  test('Check for render-blocking resources', async ({ page }) => {
    const issues: string[] = [];
    
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    
    // Check for synchronous XHR (blocking)
    const blockingScripts = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      return Array.from(scripts)
        .filter(s => !s.async && !s.defer)
        .map(s => s.src || s.id || 'inline');
    });
    
    console.log('Blocking scripts:', blockingScripts.length);
    
    // Check for large CSS files
    const stylesheets = await page.evaluate(() => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      return Array.from(links).map((l: any) => ({
        href: l.href,
        media: l.media
      }));
    });
    
    console.log('Stylesheets:', stylesheets.length);
  });
});