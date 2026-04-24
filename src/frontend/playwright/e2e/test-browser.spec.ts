import { test, expect } from '@playwright/test';

test('browser check', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.screenshot({ path: 'playwright/test-results/login-check.png' });
  await expect(page).toHaveTitle(/.*Mojaz.*/i);
});
