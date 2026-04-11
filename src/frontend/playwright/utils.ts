import { expect, Page } from '@playwright/test';

/**
 * Common Mojaz Test Utilities
 */
export const mojazUtils = {
  /**
   * Measure performance of a specific action
   */
  async measurePerformance(page: Page, name: string, action: () => Promise<void>) {
    const start = Date.now();
    await action();
    const end = Date.now();
    const duration = end - start;
    console.log(`POLL_PERF: [${name}] took ${duration}ms`);
    return duration;
  },

  /**
   * Toggle language via the UI
   */
  async toggleLanguage(page: Page) {
    const currentLang = await page.getAttribute('html', 'lang');
    const targetLang = currentLang === 'ar' ? 'English' : 'العربية';
    await page.getByRole('button', { name: targetLang }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', currentLang === 'ar' ? 'en' : 'ar');
  },

  /**
   * Verify a success message (toast)
   */
  async expectSuccessToast(page: Page, message?: string | RegExp) {
    const toast = page.locator('.hot-toast-success'); // Adjust based on react-hot-toast styles
    await expect(toast).toBeVisible();
    if (message) {
      await expect(toast).toHaveText(message);
    }
  },

  /**
   * Fill a government-style date of birth
   */
  async fillDateOfBirth(page: Page, date: string) {
    // Assuming a structured date input or simple text for now
    await page.getByLabel(/date of birth/i).fill(date);
  },

  /**
   * Wait for all initial dashboard data to load
   */
  async waitForDashboardLoad(page: Page) {
    await expect(page.locator('[data-testid="dashboard-summary"]')).toBeVisible();
    await expect(page.locator('.lucide-loader-2')).not.toBeVisible();
  }
};
