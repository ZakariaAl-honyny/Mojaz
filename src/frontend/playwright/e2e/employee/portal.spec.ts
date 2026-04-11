import { test, expect } from '@playwright/test';
import { mojazUtils } from '../../utils';

test.describe('US2: Employee Portal RBAC & Workflows', () => {
  
  test.describe('Receptionist Context', () => {
    // Stage receptionist auth state
    test.use({ storageState: 'playwright/.auth/receptionist.json' });

    test('receptionist can view queue and start review', async ({ page }) => {
      await page.goto('/ar/dashboard');
      await mojazUtils.waitForDashboardLoad(page);

      // 1. Verify restricted view (Receptionist should not see Manager KPIs)
      const kpis = page.locator('text=Executive Summary');
      await expect(kpis).not.toBeVisible();

      // 2. Interact with Application Queue
      const queueTable = page.locator('table');
      await expect(queueTable).toBeVisible();

      // 3. Navigate to Application Review
      // Click first 'view' action in the table
      const viewBtn = page.getByTestId('view-application-btn').first();
      await viewBtn.click();

      // 4. Verify Review Page elements
      await expect(page).toHaveURL(/.*queue\/.*\/review/);
      await expect(page.getByTestId('btn-approve')).toBeVisible();
      await expect(page.getByTestId('btn-reject')).toBeVisible();
      
      // Enter internal remarks
      await page.getByTestId('input-remarks').fill('RECEPTION_CHECK: All physical documents verified.');
    });
  });

  test.describe('Doctor Context', () => {
    // Stage doctor auth state
    test.use({ storageState: 'playwright/.auth/doctor.json' });

    test('doctor can search applicant and certify medical results', async ({ page }) => {
      await page.goto('/ar/medical-results');
      
      // 1. Search for applicant by National ID
      await page.getByTestId('input-medical-search').fill('1028493821');
      await page.getByTestId('btn-medical-search').click();

      // 2. Verify dynamic lookup result
      await expect(page.getByText('Ahmed Al-Salmi')).toBeVisible();

      // 3. Fill Medical Form
      await page.getByTestId('input-vision-left').fill('6/6');
      await page.getByTestId('input-vision-right').fill('6/6');
      await page.getByTestId('select-blood-group').selectOption('O+');
      await page.getByTestId('textarea-medical-remarks').fill('FIT_FOR_LICENSE: Normal vision and vitals.');

      // 4. Submit Certification
      await mojazUtils.measurePerformance(page, 'Medical Certification Submit', async () => {
        await page.getByTestId('btn-save-medical').click();
      });

      // 5. Verification
      // Currently alert shows "Success" (based on component alert logic)
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Success');
        await dialog.accept();
      });
    });
  });
});
