import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['list']],
  
  use: {
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  projects: [
    /* Setup project for auth and seeding */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    /* Main testing projects */
    {
      name: 'chromium-ar-light',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/applicant.json',
        locale: 'ar-SA',
        colorScheme: 'light',
      },
      dependencies: ['setup'],
    },
    {
      name: 'chromium-en-dark',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/applicant.json',
        locale: 'en-US',
        colorScheme: 'dark',
      },
      dependencies: ['setup'],
    },
    
    /* Dedicated Role projects for RBAC verification */
    {
      name: 'receptionist-view',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/receptionist.json',
        locale: 'ar-SA',
      },
      dependencies: ['setup'],
      testMatch: /.*employee\/receptionist\.spec\.ts/,
    },
    {
      name: 'doctor-view',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/doctor.json',
        locale: 'ar-SA',
      },
      dependencies: ['setup'],
      testMatch: /.*employee\/officials\.spec\.ts/,
    },

    /* Mobile viewports */
    {
      name: 'mobile-chrome-ar',
      use: {
        ...devices['Pixel 5'],
        storageState: 'playwright/.auth/applicant.json',
        locale: 'ar-SA',
      },
      dependencies: ['setup'],
    },
  ],

  outputDir: 'test-results/',
});
