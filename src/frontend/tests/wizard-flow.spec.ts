import { test, expect } from '@playwright/test';

test.describe('Application Wizard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock key API endpoints
    await page.route('**/api/v1/license-categories/service/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { id: '1', code: 'B', nameAr: 'رخصة القيادة ب', nameEn: 'Driving License B', descriptionAr: 'وصف', descriptionEn: 'Desc', minAge: 18, baseFee: 100, isActive: true }
          ]
        }),
      });
    });

    await page.route('**/api/v1/applications/nationalities', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ code: 'SAR', nameAr: 'سعودي', nameEn: 'Saudi' }]
        }),
      });
    });

    await page.route('**/api/v1/applications/regions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ code: 'RUH', nameAr: 'الرياض', nameEn: 'Riyadh' }]
        }),
      });
    });

    await page.route('**/api/v1/applications/exam-centers', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ id: 'c1', nameAr: 'مركز الرياض', nameEn: 'Riyadh Center', city: 'Riyadh', isActive: true }]
        }),
      });
    });

    await page.route('**/api/v1/applications', async (route) => {
      if (route.request().method() === 'POST' || route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: { id: 'app-123' } }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] }),
        });
      }
    });
  });

  test('Happy Path: Complete and submit application', async ({ page }) => {
    // Start at English locale
    await page.goto('/en/applications/new');

    // Step 1: Service Selection
    await expect(page.getByText('Select Service Type')).toBeVisible();
    await page.getByRole('button', { name: 'Issuance of a new primary license' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 2: License Category
    await expect(page.getByText('Select License Category')).toBeVisible();
    await page.getByText('Driving License B').click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Personal Information
    await expect(page.getByText('Personal Information')).toBeVisible();
    await page.getByLabel('National ID').fill('1029384756');
    await page.getByLabel('Date of Birth').fill('1990-01-01');
    await page.getByLabel('Nationality').selectOption('SAR');
    await page.getByLabel('Mobile Number').fill('0501234567');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Region').selectOption('RUH');
    await page.getByLabel('City').fill('Riyadh');
    await page.getByLabel('Full Address').fill('Test Address');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 4: Application Details
    await expect(page.getByText('Application Details')).toBeVisible();
    await page.getByLabel('Preferred Exam Center').selectOption('c1');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 5: Review & Submit
    await expect(page.getByText('Review Your Application')).toBeVisible();
    await expect(page.getByText('1029384756')).toBeVisible();
    
    // Test validation: Submit should be disabled
    const submitBtn = page.getByRole('button', { name: 'Submit Application' });
    await expect(submitBtn).toBeDisabled();

    // Check declaration
    await page.getByRole('checkbox').check();
    await expect(submitBtn).toBeEnabled();

    // Submit
    await page.route('**/api/v1/applications/app-123/submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Submitted successfully' }),
      });
    });

    await submitBtn.click();

    // Should redirect to dashboard or details
    await expect(page).toHaveURL(/\/applicant\/applications\/app-123/);
  });

  test('RTL Audit: Switch to Arabic and verify layout', async ({ page }) => {
    await page.goto('/ar/applications/new');
    
    // Check direction
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    
    // Check Arabic text
    await expect(page.getByText('اختيار نوع الخدمة')).toBeVisible();
    
    // Progress bar order (visual check would be needed, but we check role/labels)
    const progressBar = page.locator('nav[aria-label="Progress"]'); // If we have aria-label
    // ...
  });

  test('Validation: Prevent advancing with missing data', async ({ page }) => {
    await page.goto('/en/applications/new');
    
    // Step 1: Selection is required? Actually Step 1 usually has a default or requires click.
    // If we click Next without selecting:
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Please select a service type')).toBeVisible();
  });
});
