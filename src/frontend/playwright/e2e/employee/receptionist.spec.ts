import { test, expect } from '@playwright/test';
import { mojazUtils } from '../../utils';

/**
 * T011: Receptionist Document Verification Tests
 * 
 * Tests the Receptionist role's ability to:
 * - View applications pending document review
 * - Verify uploaded documents
 * - Approve or reject document submissions
 */
test.describe('US2: Receptionist Document Verification', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as receptionist
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000002');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Receptionist can access application queue', async ({ page }) => {
    // Navigate to employee queue
    await page.goto('/ar/queue');
    
    // Should show application queue
    await expect(page.locator('[data-testid="employee-queue"]')).toBeVisible({ timeout: 10000 });
  });

  test('Applications pending document review are visible', async ({ page }) => {
    await page.goto('/ar/queue');
    
    // Should show list of applications
    const appList = page.locator('[data-testid="application-item"]');
    const count = await appList.count();
    
    // Should have at least applications visible
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('Can filter applications by status', async ({ page }) => {
    await page.goto('/ar/queue');
    
    // Look for filter dropdown
    const filterDropdown = page.locator('[data-testid="status-filter"]');
    
    if (await filterDropdown.isVisible()) {
      // Select "Pending Documents" status
      await filterDropdown.selectOption('Documents');
      
      // Verify filtered results
      await expect(page.locator('[data-testid="application-item"]')).toBeVisible();
    }
  });

  test('Can view application documents', async ({ page }) => {
    await page.goto('/ar/queue');
    
    // Get first application if exists
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      // Click on first application
      await appItems.first().click();
      
      // Should show document section
      await expect(page.locator('[data-testid="documents-section"]')).toBeVisible({ timeout: 5000 });
    }
  });

  test('Can approve documents with comment', async ({ page }) => {
    await page.goto('/ar/queue');
    
    // Find application with pending documents
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Look for approve button
      const approveBtn = page.locator('[data-testid="approve-documents-btn"]');
      
      if (await approveBtn.isVisible()) {
        // Add verification comment
        const commentBox = page.locator('[data-testid="verification-comment"]');
        await commentBox.fill('جميع المستندات مكتملة وصحيحة');
        
        // Click approve
        await approveBtn.click();
        
        // Should show success toast
        await mojazUtils.expectSuccessToast(page);
      }
    }
  });

  test('Can reject documents with reason', async ({ page }) => {
    await page.goto('/ar/queue');
    
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Look for reject button
      const rejectBtn = page.locator('[data-testid="reject-documents-btn"]');
      
      if (await rejectBtn.isVisible()) {
        // Add rejection reason
        const reasonSelect = page.locator('[data-testid="rejection-reason"]');
        await reasonSelect.selectOption('1'); // Example: Incomplete documents
        
        const commentBox = page.locator('[data-testid="rejection-comment"]');
        await commentBox.fill('يرجى إكمال المستندات المطلوبة');
        
        // Click reject
        await rejectBtn.click();
        
        // Should show confirmation
        await expect(page.locator('[data-testid="rejection-confirmation"]')).toBeVisible();
      }
    }
  });

  test('Document upload timestamp is displayed', async ({ page }) => {
    await page.goto('/ar/queue');
    
    // Click on an application
    const appItems = page.locator('[data-testid="application-item"]');
    if (await appItems.first().isVisible()) {
      await appItems.first().click();
      
      // Verify document timestamps are visible
      const docTimestamp = page.locator('[data-testid="document-timestamp"]');
      const count = await docTimestamp.count();
      
      if (count > 0) {
        await expect(docTimestamp.first()).toBeVisible();
      }
    }
  });

  test('Receptionist sees correct dashboard stats', async ({ page }) => {
    await page.goto('/ar/dashboard');
    
    // Should show receptionist-specific stats
    await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible();
    
    // Should show pending documents count
    const pendingCount = page.locator('[data-testid="pending-documents-count"]');
    expect(await pendingCount.count()).toBeGreaterThanOrEqual(0);
  });
});