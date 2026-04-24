import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';

/**
 * Mojaz Platform - Playwright Test Configuration
 * 
 * Comprehensive E2E testing configuration supporting:
 * - Desktop & Mobile browsers
 * - RTL/LTR layouts
 * - Dark/Light themes
 * - Multiple authentication roles
 * - Performance benchmarking
 */

const config: PlaywrightTestConfig = {
  testDir: './playwright',
  
  // Fully qualified tests in e2e directory
  testMatch: [
    'e2e/**/*.spec.ts',
    'visual/**/*.spec.ts',
    'perf/**/*.spec.ts'
  ],
  
// Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'playwright-results.json' }]
  ],
  
  // Parallel execution settings
  fullyParallel: process.env.CI === 'true',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  
  // Timeout settings
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 10 * 1000, // 10 seconds for expect assertions
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.05, // 5% tolerance for visual regressions
    },
  },
  
// Projects to run tests in
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Web server configuration for local testing
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for server startup
  },
  
  // Output directories
  outputDir: 'playwright/test-results',
};

export default defineConfig(config);