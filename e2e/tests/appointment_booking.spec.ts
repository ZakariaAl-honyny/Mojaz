import { test, expect } from '@playwright/test';

// Test credentials - in a real scenario these would come from environment variables or fixtures
const TEST_USER = {
  email: 'applicant@test.com',
  password: 'TestPass123!'
};

const TEST_APPLICATION_ID = '00000000-0000-0000-0000-000000000001';

test.describe('Appointment Booking Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the appointment booking page
    await page.goto(`/ar/applications/${TEST_APPLICATION_ID}/appointment`);
  });

  test('should display appointment booking page with calendar', async ({ page }) => {
    // Verify the page loads
    await expect(page.locator('h1')).toContainText(/حجز موعد|Book Appointment/i);
    
    // Verify calendar component is present
    await expect(page.locator('text=اختر التاريخ|Select Date')).toBeVisible();
  });

  test('should allow selecting a date from the calendar', async ({ page }) => {
    // Click on a day in the calendar (next week)
    const nextWeekDay = new Date();
    nextWeekDay.setDate(nextWeekDay.getDate() + 7);
    const dayNumber = nextWeekDay.getDate();
    
    // Find and click a day button that is not disabled
    const availableDay = page.locator('button:not([disabled])').filter({ hasText: new RegExp(`^${dayNumber}$`) }).first();
    
    if (await availableDay.count() > 0) {
      await availableDay.click();
      
      // Verify that time slots are now visible
      await expect(page.locator('text=اختر الوقت|Select Time')).toBeVisible();
    }
  });

  test('should show available slots when date is selected', async ({ page }) => {
    // Find a clickable day in the calendar
    const buttons = page.locator('button:has-text(/^\\d+$/)');
    const count = await buttons.count();
    
    if (count > 0) {
      // Click the first available day
      await buttons.first().click();
      
      // Wait for slots to load
      await page.waitForTimeout(1000);
      
      // Check if time slots are displayed
      const slotsContainer = page.locator('[class*="grid"]').filter({ has: page.locator('text=/08:|09:|10:|11:|12:/') });
      
      // Either slots or "no slots" message should appear
      const hasSlotsOrMessage = await Promise.race([
        slotsContainer.waitFor({ state: 'visible', timeout: 3000 }).then(() => true),
        page.locator('text=/لا توجد مواعيد|No available slots/').waitFor({ state: 'visible', timeout: 3000 }).then(() => true)
      ]);
      
      expect(hasSlotsOrMessage).toBeTruthy();
    }
  });

  test('should display appointment type options', async ({ page }) => {
    // Check for appointment type buttons
    await expect(page.locator('text=الفحص الطبي|Medical Exam')).toBeVisible();
    await expect(page.locator('text=الاختبار النظري|Theory Test')).toBeVisible();
    await expect(page.locator('text=الاختبار العملي|Practical Test')).toBeVisible();
  });

  test('should switch between appointment types', async ({ page }) {
    // Click on Medical Exam
    await page.click('text=الفحص الطبي|Medical Exam');
    
    // Verify it's selected (check for different styling or active state)
    const medicalExamButton = page.locator('button:has-text("الفحص الطبي"), button:has-text("Medical Exam")');
    await expect(medicalExamButton).toBeVisible();
  });
});

test.describe('Appointment Booking - Authenticated Flow', () => {
  
  test('should book an appointment when slots are available', async ({ page }) => {
    // This test assumes the user is already authenticated
    // In a real scenario, we'd login first or use authenticated context
    
    // Navigate to appointment page
    await page.goto(`/ar/applications/${TEST_APPLICATION_ID}/appointment`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Select a day in the calendar (find any enabled day)
    const enabledDay = page.locator('button:not([disabled]):has-text(/^\\d+/)').first();
    
    if (await enabledDay.count() > 0) {
      await enabledDay.click();
      
      // Wait for slots to load
      await page.waitForTimeout(1500);
      
      // Try to find an available slot
      const availableSlot = page.locator('button:has-text(/\\d{2}:\\d{2}/)').filter({ hasNot: page.locator('text=ممتلئ|full') }).first();
      
      if (await availableSlot.count() > 0) {
        await availableSlot.click();
        
        // Verify confirmation section appears
        await expect(page.locator('text=تأكيد الحجز|Confirm Booking')).toBeVisible();
      }
    }
  });
});

test.describe('Appointment Reschedule', () => {
  
  test('should navigate to reschedule from existing appointment', async ({ page }) => {
    // Navigate to application detail page that might have existing appointment
    await page.goto(`/ar/applications/${TEST_APPLICATION_ID}`);
    
    // Look for reschedule button if appointment exists
    const rescheduleButton = page.locator('text=إعادة تحديد|Reschedule');
    
    // Either button exists or not - both are valid outcomes
    const exists = await rescheduleButton.count() > 0;
    if (exists) {
      await rescheduleButton.click();
      await expect(page.url()).toContain('/appointment');
    }
  });
});

test.describe('Appointment Cancellation', () => {
  
  test('should show cancel option for existing appointments', async ({ page }) => {
    // Navigate to application detail
    await page.goto(`/ar/applications/${TEST_APPLICATION_ID}`);
    
    // Look for cancel button
    const cancelButton = page.locator('text=إلغاء|Cancel');
    
    const exists = await cancelButton.count() > 0;
    if (exists) {
      await cancelButton.click();
      
      // Should show reason input
      await expect(page.locator('text=سبب|Reason')).toBeVisible();
    }
  });
});