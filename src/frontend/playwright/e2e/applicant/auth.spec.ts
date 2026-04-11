import { test, expect } from '@playwright/test';
import { mojazUtils } from '../../utils';

test.describe('Applicant Authentication Flow', () => {
  // Generate random email for each test run to avoid unique constraint violations
  const testId = `e2e_${Math.floor(Math.random() * 100000)}`;
  const testEmail = `${testId}@mojaz.gov.sa`;

  test('US1: Registration and OTP integration', async ({ page }) => {
    await page.goto('/ar/register');

    // 1. Fill registration form
    await page.getByTestId('register-fullname').fill('مستخدم تجريبي آلي');
    await page.getByTestId('register-identifier').fill(testEmail);
    await page.getByTestId('register-password').fill('Password123!');
    await page.getByTestId('register-confirm-password').fill('Password123!');
    
    // 2. Submit and measure
    await mojazUtils.measurePerformance(page, 'Registration Submit', async () => {
      await page.getByTestId('register-submit').click();
    });

    // 3. Verify redirection to OTP page
    await expect(page).toHaveURL(/.*verify-otp/);
    
    // 4. Enter test OTP (predictable from mock)
    const otp = "123456";
    for (let i = 0; i < 6; i++) {
        await page.getByTestId(`otp-input-${i}`).fill(otp[i]);
    }

    await page.getByTestId('otp-confirm').click();

    // 5. Verify success redirect to login with verification status
    await expect(page).toHaveURL(/.*login/);
    // Success message check (translation dependent, but visible)
    await expect(page.locator('body')).toContainText(/تم التحقق/i); 
  });

  test('US1: Existing User Login', async ({ page }) => {
    await page.goto('/ar/login');
    
    // Seeded user via TestDataSeeder
    await page.getByTestId('login-identifier').fill('applicant@mojaz.gov.sa');
    await page.getByTestId('login-password').fill('Password123!');
    
    await mojazUtils.measurePerformance(page, 'Login Submit', async () => {
      await page.getByTestId('login-submit').click();
    });

    // Verify dashboard access
    await expect(page).toHaveURL(/.*dashboard/);
    // Wait for data load
    await mojazUtils.waitForDashboardLoad(page);
  });
});
