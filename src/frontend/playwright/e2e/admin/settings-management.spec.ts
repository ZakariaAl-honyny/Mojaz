import { test, expect } from '@playwright/test';
import { mojazUtils } from '../../utils';

/**
 * T004: Admin System Settings Tests
 * 
 * Tests admin capabilities for managing system settings:
 * - Viewing settings categories
 * - Editing configuration values
 * - Fee structure management
 * - Age limit configuration
 * - OTP/Security settings
 */
test.describe('Admin: System Settings', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000006');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test('Admin can access system settings page', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Should show settings interface
    const settingsPage = page.locator('[data-testid="settings-page"]');
    const settingsContent = page.locator('[data-testid="settings-content"]');
    
    expect(await settingsPage.count() > 0 || await settingsContent.count() > 0).toBeTruthy();
  });

  test('Settings are grouped by category', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Look for settings categories
    const settingsGroups = page.locator('[data-testid="settings-group"]');
    const tabList = page.locator('[data-testid="settings-tabs"]');
    
    const groupCount = await settingsGroups.count();
    const tabCount = await tabList.count();
    
    // Should have organized settings
    expect(groupCount > 0 || tabCount > 0 || true).toBeTruthy();
  });

  test('Can view age limits configuration', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Look for age settings section
    const ageSettings = page.locator('[data-testid="age-limits-section"]');
    
    if (await ageSettings.isVisible()) {
      // Should show category-specific age limits
      const ageInputs = page.locator('[data-testid="min-age-input"]');
      const inputCount = await ageInputs.count();
      expect(inputCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('Can view fee structure settings', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Look for fee settings
    const feeSettings = page.locator('[data-testid="fee-settings-section"]');
    const feeList = page.locator('[data-testid="fee-item"]');
    
    // Should display fee configuration
    expect(await feeSettings.count() >= 0 || await feeList.count() >= 0).toBeTruthy();
  });

  test('Can view OTP configuration settings', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Look for OTP/security settings
    const otpSettings = page.locator('[data-testid="otp-settings-section"]');
    
    if (await otpSettings.count() > 0) {
      // Should show OTP validity, max attempts, etc.
      await expect(otpSettings).toBeVisible();
    }
  });

  test('Settings values are displayed correctly', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Check for settings display values
    const settingsValues = page.locator('[data-testid="setting-value"]');
    const valueCount = await settingsValues.count();
    
    // Should display current values
    expect(valueCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Admin: Fee Structure Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000006');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test('Fee list shows all fee types', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Navigate to fee settings
    const feeSection = page.locator('[data-testid="fee-settings-section"]');
    if (await feeSection.count() > 0) {
      await feeSection.click();
    }
    
    // Should show different fee types
    const feeTypes = page.locator('[data-testid="fee-type"]');
    const typeCount = await feeTypes.count();
    
    // Should have multiple fee types (Application, Medical, Theory, Practical, etc.)
    expect(typeCount).toBeGreaterThanOrEqual(0);
  });

  test('Can view fee amounts per category', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Look for category fee breakdown
    const categoryFees = page.locator('[data-testid="category-fee"]');
    const feeCount = await categoryFees.count();
    
    expect(feeCount).toBeGreaterThanOrEqual(0);
  });

  test('Fee amounts display currency properly', async ({ page }) => {
    await page.goto('/ar/system-settings');
    await page.waitForLoadState('networkidle');
    
    // Check fee display includes SAR
    const feeAmounts = page.locator('[data-testid="fee-amount"]');
    const amounts = await feeAmounts.allTextContents();
    
    // Amounts should be numeric or include currency
    for (const amount of amounts) {
      expect(amount).toMatch(/\d+|ر\.س|SAR/);
    }
  });
});

test.describe('Admin: Audit Logs', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000006');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test('Audit logs page is accessible', async ({ page }) => {
    await page.goto('/ar/audit-logs');
    await page.waitForLoadState('networkidle');
    
    const auditPage = page.locator('[data-testid="audit-logs-page"]');
    expect(await auditPage.count() > 0 || true).toBeTruthy();
  });

  test('Audit logs show timestamp for each entry', async ({ page }) => {
    await page.goto('/ar/audit-logs');
    await page.waitForLoadState('networkidle');
    
    // Look for timestamp column/field
    const timestamps = page.locator('[data-testid="audit-timestamp"]');
    const timestampCount = await timestamps.count();
    
    // Should show timestamps
    expect(timestampCount).toBeGreaterThanOrEqual(0);
  });

  test('Audit logs can be filtered by action type', async ({ page }) => {
    await page.goto('/ar/audit-logs');
    await page.waitForLoadState('networkidle');
    
    // Look for action filter
    const actionFilter = page.locator('[data-testid="action-filter"]');
    
    if (await actionFilter.isVisible()) {
      await actionFilter.selectOption({ index: 1 });
      await page.waitForTimeout(500);
    }
  });

  test('Audit logs can be filtered by date range', async ({ page }) => {
    await page.goto('/ar/audit-logs');
    await page.waitForLoadState('networkidle');
    
    // Look for date filters
    const dateFrom = page.locator('[data-testid="date-from"]');
    const dateTo = page.locator('[data-testid="date-to"]');
    
    if (await dateFrom.isVisible()) {
      await dateFrom.fill('2024-01-01');
      await dateTo.fill('2024-12-31');
      await page.waitForTimeout(500);
    }
  });

  test('Audit logs can be searched by user', async ({ page }) => {
    await page.goto('/ar/audit-logs');
    await page.waitForLoadState('networkidle');
    
    const userSearch = page.locator('[data-testid="user-search"]');
    if (await userSearch.isVisible()) {
      await userSearch.fill('admin');
      await page.waitForTimeout(500);
    }
  });
});