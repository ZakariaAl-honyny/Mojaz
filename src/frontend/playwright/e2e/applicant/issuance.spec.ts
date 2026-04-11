import { test, expect } from '@playwright/test';
import { mojazUtils } from '../../utils';

test.describe('US1: New License Issuance Journey', () => {
  // Use pre-authenticated applicant state (Phase 2 requirement)
  test.use({ storageState: 'playwright/.auth/applicant.json' });

  test('create new license application via wizard', async ({ page }) => {
    // 1. Visit Dashboard and ensure we are logged in as Applicant
    await page.goto('/ar/dashboard');
    await mojazUtils.waitForDashboardLoad(page);

    // 2. Trigger "New Application" flow
    await page.getByTestId('new-application-btn').click();
    await expect(page).toHaveURL(/.*applications\/new/);

    // 3. Wizard Step 1: Select Service (New License)
    await page.getByTestId('service-type-new').click();
    await page.getByTestId('wizard-next').click();

    // 4. Wizard Step 2: Select Category (Private Car)
    await page.getByTestId('category-private').click();
    await page.getByTestId('wizard-next').click();

    // 5. Wizard Step 3: Personal Data
    await page.getByTestId('input-national-id').fill('1000000001');
    await page.getByTestId('input-dob').fill('1995-05-15');
    await page.getByTestId('input-phone').fill('0555555555');
    await page.getByTestId('input-city').fill('Riyadh');
    await page.getByTestId('wizard-next').click();

    // 6. Wizard Step 4: Application Details
    // selectOption label should match the visible text in selected locale
    await page.getByTestId('select-center').selectOption({ index: 1 }); // Riyadh Main Branch
    await page.getByTestId('select-language').selectOption('ar');
    await page.getByTestId('textarea-special-needs').fill('Automated E2E Test Entry');
    await page.getByTestId('wizard-next').click();

    // 7. Wizard Step 5: Review & Submit
    // Verify visibility of selected data summary
    await expect(page.getByText('1000000001')).toBeVisible();
    await page.getByTestId('checkbox-accuracy').check();
    
    // Measure submission performance (SLA observation)
    await mojazUtils.measurePerformance(page, 'Issuance Application Submit', async () => {
      await page.getByTestId('wizard-submit').click();
    });

    // 8. Redirect Verification
    // Success submission leads back to dashboard in Mojaz flow
    await expect(page).toHaveURL(/.*dashboard/);
    await mojazUtils.waitForDashboardLoad(page);

    // 9. Verify record presence in recent applications list
    const applicationList = page.locator('[data-testid="application-card"]');
    await expect(applicationList.first()).toBeVisible();
    
    // Visual snapshot check for the dashboard state (Phase 5 precursor)
    // await expect(page).toHaveScreenshot('dashboard-after-submit.png');
  });
});