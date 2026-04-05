import { test, expect } from '@playwright/test';

test.describe('Application Workflow', () => {
  test('should allow an applicant to navigate the wizard and employee to see the queue', async ({ page }) => {
    // 1. Applicant Portal: Mocking the Navigation flow
    await page.goto('/ar/applications/new');
    await expect(page.getByText('إنشاء طلب جديد')).toBeVisible();
    
    // Step 1: Service
    await page.click('button:has-text("رخصة جديدة")');
    await page.click('button:has-text("التالي")');
    
    // Step 2: Category
    await page.click('button:has-text("خصوصي")');
    await page.click('button:has-text("التالي")');
    
    // Step 3: Personal Data
    await page.fill('input[placeholder="1XXXXXXXXX"]', '1028493821');
    await page.fill('input[type="date"]', '1990-05-15');
    await page.fill('input[placeholder="05XXXXXXXX"]', '0501234567');
    // await page.fill('input:below(:text("المدينة"))', 'الرياض');
    await page.click('button:has-text("التالي")');
    
    // Step 4: Details
    await page.click('button:has-text("التالي")');
    
    // Step 5: Review & Submit
    await page.check('#accuracy');
    await page.click('button:has-text("تقديم الطلب")');
    
    // 2. Employee Portal Dashboard
    await page.goto('/ar/dashboard'); 
    // Assuming staff is on administrative console
    await expect(page.getByText('Administrative Console')).toBeVisible();
    
    // 3. Queue List
    await page.goto('/ar/queue');
    await expect(page.getByText('قائمة الطلبات')).toBeVisible();
    await expect(page.getByText('MOJ-2025-48291037')).toBeVisible();
    
    // 4. Detailed Review
    await page.goto('/ar/queue/a1b2c3d4/review');
    await expect(page.getByText('مراجعة الطلب')).toBeVisible();
    await expect(page.getByText('Ahmed Abdullah')).toBeVisible();
    
    await page.fill('textarea', 'All documents are valid. Proceeding to next stage.');
    await page.click('button:has-text("اعتماد الطلب")');
  });
});
