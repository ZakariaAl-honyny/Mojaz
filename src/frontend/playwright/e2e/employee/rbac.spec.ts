import { test, expect } from '@playwright/test';

/**
 * T013: RBAC Security Violation Tests
 * 
 * Tests that verify:
 * - Applicants cannot access Employee portals
 * - Employees cannot access other employee portals
 * - Cross-role access denial is enforced
 * - Unauthorized access returns proper error/redirect
 */
test.describe('US2: RBAC - Applicant Cannot Access Employee Portals', () => {
  
  test('Applicant cannot access receptionist queue', async ({ page }) => {
    // Login as applicant
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Try to access receptionist queue
    await page.goto('/ar/queue');
    
    // Should either redirect or show access denied
    // Check for access denied message or redirect to applicant dashboard
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|applications|unauthorized|access-denied|403/);
  });

  test('Applicant cannot access employee dashboard', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    // Try direct navigation to employee dashboard
    await page.goto('/ar/dashboard?role=employee');
    
    // Should only see applicant dashboard
    const dashboardContent = page.locator('[data-testid="applicant-dashboard"]');
    const employeeContent = page.locator('[data-testid="employee-dashboard"]');
    
    // If employee content is visible, it should show access restriction
    if (await employeeContent.isVisible()) {
      await expect(employeeContent).toContainText(/unauthorized|access denied|غير مصرح/i);
    }
  });

  test('Applicant cannot access medical exam entry', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    // Try to access medical exam page (doctor role)
    await page.goto('/ar/medical');
    
    // Should redirect or show error
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|applications|unauthorized|access-denied|403/);
  });

  test('Applicant cannot access test results entry', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    // Try to access examiner page
    await page.goto('/ar/tests/entry');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|applications|unauthorized|access-denied|403/);
  });

  test('Applicant cannot access admin panel', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    // Try to access admin settings
    await page.goto('/ar/admin');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|applications|unauthorized|access-denied|403/);
  });
});

test.describe('US2: RBAC - Employee Role Restrictions', () => {
  
  test('Doctor cannot access receptionist queue', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000003'); // Doctor
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Try to access queue as doctor (should have limited access)
    await page.goto('/ar/queue');
    
    // Doctor should only see medical queue, not full queue
    const medicalQueueOnly = page.locator('[data-testid="medical-queue-only"]');
    const receptionistTools = page.locator('[data-testid="receptionist-tools"]');
    
    // Should NOT have receptionist tools
    if (await receptionistTools.isVisible()) {
      await expect(receptionistTools).toBeHidden();
    }
  });

  test('Doctor cannot approve payments', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000003');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    // Try to access payment management
    await page.goto('/ar/payments/manage');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|unauthorized|access-denied|403/);
  });

  test('Receptionist cannot enter medical results', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000002'); // Receptionist
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    // Try to access medical entry
    await page.goto('/ar/medical/entry');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|queue|unauthorized|access-denied|403/);
  });

  test('Receptionist cannot enter test results', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000002');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    await page.goto('/ar/tests/entry');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|queue|unauthorized|access-denied|403/);
  });

  test('Examiner cannot access medical exam', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000004'); // Examiner
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    await page.goto('/ar/medical/entry');
    
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|queue|unauthorized|access-denied|403/);
  });

  test('Non-admin cannot access system settings', async ({ page }) => {
    // Test multiple employee roles
    const roles = ['1000000002', '1000000003', '1000000004']; // Receptionist, Doctor, Examiner
    
    for (const identifier of roles) {
      await page.goto('/ar/login');
      await page.getByTestId('login-identifier').fill(identifier);
      await page.getByTestId('login-password').fill('Password123!');
      await page.getByTestId('login-submit').click();
      
      // Try to access admin settings
      await page.goto('/ar/settings');
      
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/dashboard|unauthorized|access-denied|403/);
    }
  });
});

test.describe('US2: RBAC - API Level Enforcement', () => {
  
  test('API rejects unauthorized application updates', async ({ request }) => {
    // Try to update application as applicant (should work for own)
    // But try to update another user's application
    
    // Login as applicant
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000001',
        password: 'Password123!'
      }
    });
    
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    if (token) {
      // Try to access another applicant's data
      const unauthorizedApp = await request.get('/api/v1/applications/99999', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Should be rejected or return 404 (not found, not access denied for different user)
      expect([401, 403, 404]).toContain(unauthorizedApp.status());
    }
  });

  test('Employee cannot access applicant-only APIs', async ({ request }) => {
    // Login as doctor
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        identifier: '1000000003',
        password: 'Password123!'
      }
    });
    
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    const token = loginData.data?.accessToken;
    
    if (token) {
      // Try to create new application (applicant-only action)
      const createAppResponse = await request.post('/api/v1/applications', {
        headers: { Authorization: `Bearer ${token}` },
        data: {}
      });
      
      // Should be rejected
      expect([401, 403]).toContain(createAppResponse.status());
    }
  });
});

test.describe('US2: RBAC - UI Elements Hidden Based on Role', () => {
  
  test('Applicant does not see employee navigation items', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000001');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    // Check navigation
    const navItems = await page.locator('[data-testid="nav-item"]').allTextContents();
    
    // Should not contain employee-only items
    expect(navItems.join(' ')).not.toMatch(/queue|medical|exams|reports|management/i);
  });

  test('Employee sees role-appropriate navigation', async ({ page }) => {
    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill('1000000003'); // Doctor
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    
    const navItems = await page.locator('[data-testid="nav-item"]').allTextContents();
    const navText = navItems.join(' ');
    
    // Should see medical-related items
    expect(navText).toMatch(/medical|فحص|صحي/);
    
    // Should NOT see admin settings
    expect(navText).not.toMatch(/admin|إدارة النظام|settings/i);
  });
});