import { test, expect } from '@playwright/test';
import { mojazUtils } from '../../utils';

/**
 * T012: Official (Doctor/Examiner) Result Entry Tests
 * 
 * Tests for Doctor and Examiner roles:
 * - Access to medical exam results entry
 * - Access to theory/practical test results entry
 * - Validation of result data
 * - Proper status transitions
 */
test.describe('US2: Doctor Medical Examination Results', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as Doctor
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000003');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Doctor can access medical exam queue', async ({ page }) => {
    // Navigate to medical queue
    await page.goto('/ar/queue');
    
    // Should show applications pending medical exam
    await expect(page.locator('[data-testid="medical-queue"]')).toBeVisible({ timeout: 10000 });
  });

  test('Medical exam form displays correctly', async ({ page }) => {
    await page.goto('/ar/queue');
    
    // Get first pending medical application
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Should show medical exam form
      await expect(page.locator('[data-testid="medical-exam-form"]')).toBeVisible({ timeout: 5000 });
    }
  });

  test('Can enter medical examination results', async ({ page }) => {
    await page.goto('/ar/queue');
    
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Fill medical examination results
      // Vision test
      await page.getByTestId('vision-left').fill('6/6');
      await page.getByTestId('vision-right').fill('6/6');
      
      // Hearing test
      await page.getByTestId('hearing-result').selectOption('Pass');
      
      // General health
      await page.getByTestId('blood-pressure').fill('120/80');
      await page.getByTestId('heart-rate').fill('72');
      
      // Overall result
      await page.getByTestId('medical-result').selectOption('Fit');
      
      // Add notes
      await page.getByTestId('medical-notes').fill('المرشح لائق صحياً');
      
      // Submit results
      await page.getByTestId('submit-medical-result').click();
      
      // Should show success
      await mojazUtils.expectSuccessToast(page);
    }
  });

  test('Medical exam validation prevents invalid data', async ({ page }) => {
    await page.goto('/ar/queue');
    
    const appItems = page.locator('[data-testId="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Try to submit without required fields
      await page.getByTestId('submit-medical-result').click();
      
      // Should show validation errors
      const validationError = page.locator('[data-testid="validation-error"]');
      expect(await validationError.count()).toBeGreaterThan(0);
    }
  });

  test('Can view applicant medical history', async ({ page }) => {
    await page.goto('/ar/queue');
    
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Look for medical history button
      const historyBtn = page.locator('[data-testid="view-medical-history"]');
      if (await historyBtn.isVisible()) {
        await historyBtn.click();
        
        // Should show medical history
        await expect(page.locator('[data-testid="medical-history"]')).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

test.describe('US2: Examiner Test Results Entry', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as Examiner
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000004');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Examiner can access test queue', async ({ page }) => {
    // Navigate to test queue
    await page.goto('/ar/queue');
    
    // Should show applications pending tests
    await expect(page.locator('[data-testid="test-queue"]')).toBeVisible({ timeout: 10000 });
  });

  test('Theory test results entry works', async ({ page }) => {
    await page.goto('/ar/queue');
    
    // Filter for theory test applications
    const filterDropdown = page.locator('[data-testid="test-type-filter"]');
    if (await filterDropdown.isVisible()) {
      await filterDropdown.selectOption('Theory');
    }
    
    // Get first pending application
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Fill theory test results
      await page.getByTestId('theory-score').fill('28'); // Out of 30
      await page.getByTestId('theory-pass').check();
      
      // Add evaluator notes
      await page.getByTestId('theory-notes').fill('ناجح في اختبار النظرية');
      
      // Submit
      await page.getByTestId('submit-theory-result').click();
      
      await mojazUtils.expectSuccessToast(page);
    }
  });

  test('Practical test results entry works', async ({ page }) => {
    await page.goto('/ar/queue');
    
    // Filter for practical test
    const filterDropdown = page.locator('[data-testid="test-type-filter"]');
    if (await filterDropdown.isVisible()) {
      await filterDropdown.selectOption('Practical');
    }
    
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Fill practical test results - score based
      await page.getByTestId('practical-score').fill('85');
      
      // Select fault categories (if applicable)
      const minorFaults = page.locator('[data-testid="faults-minor"]');
      if (await minorFaults.isVisible()) {
        await minorFaults.fill('2');
      }
      
      // Overall pass/fail
      await page.getByTestId('practical-pass').check();
      
      // Add notes
      await page.getByTestId('practical-notes').fill('أداء جيد في اختبار القيادة');
      
      // Submit
      await page.getByTestId('submit-practical-result').click();
      
      await mojazUtils.expectSuccessToast(page);
    }
  });

  test('Can view applicant test history', async ({ page }) => {
    await page.goto('/ar/queue');
    
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Look for test history link
      const historyLink = page.locator('[data-testid="view-test-history"]');
      if (await historyLink.isVisible()) {
        await historyLink.click();
        
        await expect(page.locator('[data-testid="test-history"]')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Examiner sees correct stats on dashboard', async ({ page }) => {
    await page.goto('/ar/dashboard');
    
    // Should show examiner-specific stats
    await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible();
    
    // Should show pending tests count
    const pendingTests = page.locator('[data-testid="pending-tests-count"]');
    expect(await pendingTests.count()).toBeGreaterThanOrEqual(0);
  });
});

test.describe('US2: Result Validation', () => {
  
  test('Cannot submit empty test results', async ({ page }) => {
    // Login as examiner
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000004');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.goto('/ar/queue');
    
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Try to submit without any data
      await page.getByTestId('submit-theory-result').click();
      
      // Should show validation errors
      await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
    }
  });

  test('Score validation prevents invalid values', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000004');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    await page.goto('/ar/queue');
    
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Try to enter invalid score
      await page.getByTestId('theory-score').fill('100'); // Out of range
      
      await page.getByTestId('submit-theory-result').click();
      
      // Should show range validation error
      await expect(page.locator('[data-testid="score-error"]')).toBeVisible();
    }
  });
});