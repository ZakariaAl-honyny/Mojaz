import { test, expect } from '@playwright/test';
import { mojazUtils } from '../utils';

/**
 * US3: Visual Consistency & Regression
 * These tests capture baseline screenshots.
 * Run with --update-snapshots to initialize.
 */
test.describe('Visual Regression Baselines', () => {

  test('Public Landing Page - Arabic Baseline', async ({ page }) => {
    await page.goto('/ar');
    // Allow animations to settle
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('landing-ar.png', { 
      fullPage: true,
      maxDiffPixelRatio: 0.05 
    });
  });

  test('Public Landing Page - English Baseline', async ({ page }) => {
    await page.goto('/en');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('landing-en.png', { 
      fullPage: true,
      maxDiffPixelRatio: 0.05 
    });
  });

  test.describe('Authenticated State Visuals', () => {
    test.use({ storageState: 'playwright/.auth/applicant.json' });

    test('Applicant Dashboard - Arabic Baseline', async ({ page }) => {
      await page.goto('/ar/dashboard');
      await mojazUtils.waitForDashboardLoad(page);
      
      // Mask dynamic elements like dates/app numbers to prevent false positives
      await expect(page).toHaveScreenshot('applicant-dashboard-ar.png', {
        mask: [
          page.locator('[data-testid="application-card"] span.font-mono'),
          page.locator('header span') 
        ]
      });
    });
  });

  test.describe('Employee Perspective Visuals', () => {
    test.use({ storageState: 'playwright/.auth/manager.json' });

    test('Manager Dashboard KPI Baseline', async ({ page }) => {
      await page.goto('/ar/dashboard');
      await mojazUtils.waitForDashboardLoad(page);
      
      // Focus on the KPI section specifically
      const kpiSection = page.locator('section').first();
      await expect(kpiSection).toHaveScreenshot('manager-kpis-ar.png');
    });
  });
});
