import { test, expect } from '@playwright/test';

// Test constants
const TEST_USER = {
  email: 'upgrade_applicant@test.com',
  password: 'TestPass123!'
};

// We assume this applicant already has a Category B license
const APPLICANT_ID = 'applicant-uuid-with-cat-b'; 
const UPGRADE_TARGET_CATEGORY = 'C';

test.describe('License Upgrade Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Login and navigate to application wizard
    // In a real scenario, we would use a login utility
    await page.goto('/ar/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('T2718: should charge CategoryUpgrade fee when initiating license upgrade', async ({ page }) => {
    // Navigate to create new application
    await page.goto('/ar/applications/new');

    // Select "Upgrade License" service
    await page.click('text=ترقية رخصة|Upgrade License');

    // Select target category (e.g., Category C)
    await page.selectOption('select[name="category"]', UPGRADE_TARGET_CATEGORY);

    // Proceed to payment step
    await page.click('text=التالي|Next');
    
    // Verify the fee displayed is for Upgrade, not New License
    // We expect a label like "Upgrade Fee" or a specific amount defined in FeeStructures
    const feeLabel = page.locator('text=/رسوم الترقية|Upgrade Fee/i');
    await expect(feeLabel).toBeVisible();
    
    // Also verify the amount matches the expected upgrade fee (mocked or from known test data)
    // const feeAmount = await page.locator('.fee-amount').innerText();
    // expect(feeAmount).toBe('EXPECTED_UPGRADE_FEE_AMOUNT');
  });

  test('T2719: should reflect the higher category on the issued license after upgrade', async ({ page }) => {
    // For E2E tests, we simulate the completion of the workflow via API 
    // to avoid waiting for medical/theory/practical tests in every run.
    
    // 1. Create upgrade application
    await page.goto('/ar/applications/new');
    await page.click('text=ترقية رخصة|Upgrade License');
    await page.selectOption('select[name="category"]', UPGRADE_TARGET_CATEGORY);
    await page.click('text=تقديم|Submit');
    
    const applicationId = (await page.url()).split('/').pop();

    // 2. Shortcut: Move application to 'Issued' status via API request
    await page.request.patch(`/api/v1/applications/${applicationId}/status`, {
      data: { status: 'Issued' }
    });

    // 3. Navigate to the issued license view
    await page.goto(`/ar/license/${applicationId}`);

    // 4. Verify the category is the target category (C)
    const categoryBadge = page.locator('[data-testid="license-category"]');
    await expect(categoryBadge).toContainText(UPGRADE_TARGET_CATEGORY);

    // 5. Verify holder details are correct
    await expect(page.locator('text=applicant@test.com')).toBeVisible();
  });

  test('T2720: should mark the previous license as Superseded (IsDeleted=true) after upgrade', async ({ page }) => {
    // 1. Setup: Complete an upgrade flow (similar to T2719)
    await page.goto('/ar/applications/new');
    await page.click('text=ترقية رخصة|Upgrade License');
    await page.selectOption('select[name="category"]', UPGRADE_TARGET_CATEGORY);
    await page.click('text=تقديم|Submit');
    const applicationId = (await page.url()).split('/').pop();

    await page.request.patch(`/api/v1/applications/${applicationId}/status`, {
      data: { status: 'Issued' }
    });

    // 2. Verify via API that the old license (Cat B) is now IsDeleted = true
    // We assume there is an endpoint to fetch license history or the old license
    const response = await page.request.get(`/api/v1/licenses/history?applicantId=${APPLICANT_ID}`);
    const history = await response.json();
    
    const oldLicense = history.data.find(l => l.category === 'B');
    expect(oldLicense).toBeDefined();
    expect(oldLicense.isDeleted).toBe(true); // Verify it's marked as superseded/deleted
  });
});
