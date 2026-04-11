import { test as setup, expect } from '@playwright/test';
import path from 'path';

// Storage paths
const AUTH_DIR = path.join(__dirname, '.auth');

// Seed the database before authenticating
setup('seed database', async ({ request }) => {
  const response = await request.post('/api/v1/Testing/seed');
  // We ignore if it fails due to being already seeded, 
  // but it's guarded by environment in the controller.
  console.log('Database seeding triggered:', await response.status());
});

/**
 * Authentication Helper
 */
const authenticateRole = async (page: any, role: string, identifier: string) => {
  await page.goto('/ar/login'); // Defaulting to Arabic for setup
  
  await page.getByTestId('login-identifier').fill(identifier);
  await page.getByTestId('login-password').fill('Password123!');
  await page.getByTestId('login-submit').click();

  // Wait for dashboard or similar indicative path
  await expect(page).toHaveURL(/.*dashboard/);
  
  // Save storage state
  await page.context().storageState({ path: path.join(AUTH_DIR, `${role}.json`) });
  console.log(`Authenticated as ${role} and saved to ${role}.json`);
};

setup('authenticate applicant', async ({ page }) => {
  await authenticateRole(page, 'applicant', '1000000001');
});

setup('authenticate receptionist', async ({ page }) => {
  await authenticateRole(page, 'receptionist', '1000000002');
});

setup('authenticate doctor', async ({ page }) => {
  await authenticateRole(page, 'doctor', '1000000003');
});

setup('authenticate examiner', async ({ page }) => {
  await authenticateRole(page, 'examiner', '1000000004');
});

setup('authenticate manager', async ({ page }) => {
  await authenticateRole(page, 'manager', '1000000005');
});

setup('authenticate admin', async ({ page }) => {
  await authenticateRole(page, 'admin', '1000000006');
});
