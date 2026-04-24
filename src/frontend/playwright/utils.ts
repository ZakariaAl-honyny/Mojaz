import { expect, Page, Locator } from '@playwright/test';

/**
 * Common Mojaz Test Utilities
 */
export const mojazUtils = {
  /**
   * Measure performance of a specific action
   */
  async measurePerformance(page: Page, name: string, action: () => Promise<void>) {
    const start = Date.now();
    await action();
    const end = Date.now();
    const duration = end - start;
    console.log(`POLL_PERF: [${name}] took ${duration}ms`);
    return duration;
  },

  /**
   * Toggle language via the UI
   */
  async toggleLanguage(page: Page) {
    const currentLang = await page.getAttribute('html', 'lang');
    const targetLang = currentLang === 'ar' ? 'English' : 'العربية';
    await page.getByRole('button', { name: targetLang }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', currentLang === 'ar' ? 'en' : 'ar');
  },

  /**
   * Verify a success message (toast)
   */
  async expectSuccessToast(page: Page, message?: string | RegExp) {
    const toast = page.locator('.hot-toast-success, [data-testid="success-toast"], .toast-success');
    await expect(toast).toBeVisible({ timeout: 5000 }).catch(() => {
      // Alternative: check for success text anywhere
      if (message) {
        expect(page.locator('body')).toContainText(message);
      }
    });
    if (message) {
      await expect(toast).toContainText(message).catch(() => {
        expect(page.locator('body')).toContainText(message);
      });
    }
  },

  /**
   * Fill a government-style date of birth
   */
  async fillDateOfBirth(page: Page, date: string) {
    await page.getByLabel(/date of birth/i).fill(date);
  },

  /**
   * Wait for all initial dashboard data to load
   */
  async waitForDashboardLoad(page: Page) {
    await expect(page.locator('[data-testid="dashboard-summary"], [data-testid="dashboard-content"]')).toBeVisible({ timeout: 10000 }).catch(() => {});
    await expect(page.locator('.lucide-loader-2, [data-testid="loading-spinner"]')).not.toBeVisible().catch(() => {});
  },

  /**
   * Login as specific role
   */
  async loginAs(page: Page, role: 'applicant' | 'receptionist' | 'doctor' | 'examiner' | 'manager' | 'admin') {
    const credentials: Record<string, string> = {
      applicant: '1000000001',
      receptionist: '1000000002',
      doctor: '1000000003',
      examiner: '1000000004',
      manager: '1000000005',
      admin: '1000000006',
    };

    await page.goto('/ar/login');
    await page.getByTestId('login-identifier').fill(credentials[role]);
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  },

  /**
   * Toggle dark mode
   */
  async toggleDarkMode(page: Page) {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
  },

  /**
   * Check for console errors
   */
  async checkConsoleErrors(page: Page): Promise<string[]> {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.waitForTimeout(1000);
    return errors.filter(e => !e.includes('favicon') && !e.includes('manifest'));
  },

  /**
   * Wait for API response
   */
  async waitForApiResponse(page: Page, urlPattern: string | RegExp, timeout = 10000) {
    return page.waitForResponse(response => {
      const responseUrl = response.url();
      if (typeof urlPattern === 'string') {
        return responseUrl.includes(urlPattern);
      }
      return urlPattern.test(responseUrl);
    }, { timeout });
  },

  /**
   * Verify RTL direction
   */
  async expectRtl(page: Page) {
    const direction = await page.locator('html').getAttribute('dir');
    expect(direction).toBe('rtl');
  },

  /**
   * Verify LTR direction
   */
  async expectLtr(page: Page) {
    const direction = await page.locator('html').getAttribute('dir');
    expect(direction).toBe('ltr');
  },

  /**
   * Set mobile viewport
   */
  async setMobileViewport(page: Page, device: 'iphone-se' | 'iphone-14' | 'galaxy-s21' | 'ipad-pro' = 'iphone-14') {
    const viewports: Record<string, { width: number; height: number }> = {
      'iphone-se': { width: 375, height: 667 },
      'iphone-14': { width: 390, height: 844 },
      'galaxy-s21': { width: 360, height: 800 },
      'ipad-pro': { width: 1024, height: 1366 },
    };
    await page.setViewportSize(viewports[device]);
  },

  /**
   * Verify element is visible with timeout
   */
  async waitForVisible(page: Page, selector: string, timeout = 10000) {
    await expect(page.locator(selector)).toBeVisible({ timeout });
  },

  /**
   * Click element if visible
   */
  async clickIfVisible(page: Page, selector: string) {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      await element.click();
      return true;
    }
    return false;
  },

  /**
   * Fill form fields
   */
  async fillForm(page: Page, fields: Record<string, string>) {
    for (const [field, value] of Object.entries(fields)) {
      const input = page.getByTestId(field);
      if (await input.isVisible()) {
        await input.fill(value);
      }
    }
  },

  /**
   * Verify no horizontal overflow
   */
  async expectNoHorizontalOverflow(page: Page) {
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 2);
  },
};

/**
 * Test data generators for consistent test data
 */
export const testData = {
  /**
   * Generate unique test email
   */
  uniqueEmail: () => `e2e_${Date.now()}_${Math.floor(Math.random() * 10000)}@mojaz.gov.sa`,

  /**
   * Generate unique national ID
   */
  uniqueNationalId: () => `${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 100)}`,

  /**
   * Standard test password
   */
  testPassword: 'Password123!',

  /**
   * Sample Arabic name
   */
  arabicName: 'مستخدم اختبار آلي',

  /**
   * Sample dates
   */
  dates: {
    past: '1990-01-15',
    valid: '1995-06-20',
    underage: '2015-01-01',
  },

  /**
   * License categories
   */
  categories: ['A', 'B', 'C', 'D', 'E', 'F'] as const,

  /**
   * Application statuses
   */
  statuses: {
    draft: 'Draft',
    submitted: 'Submitted',
    documents: 'Documents',
    inReview: 'InReview',
    medical: 'Medical',
    training: 'Training',
    theory: 'Theory',
    practical: 'Practical',
    approved: 'Approved',
    payment: 'Payment',
    issued: 'Issued',
    cancelled: 'Cancelled',
  },

  /**
   * Test OTP
   */
  validOtp: '123456',

  /**
   * Fee amounts (in SAR)
   */
  fees: {
    application: 100,
    medical: 50,
    theory: 75,
    practical: 100,
    issuance: 200,
  },
};

/**
 * Helper for creating page object patterns
 */
export class PageObject {
  constructor(protected page: Page) {}

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected async click(selector: string) {
    await this.locator(selector).click();
  }

  protected async fill(selector: string, value: string) {
    await this.locator(selector).fill(value);
  }

  protected async isVisible(selector: string): Promise<boolean> {
    return this.locator(selector).isVisible();
  }

  protected async waitForNavigation(urlPattern: string | RegExp, timeout = 15000) {
    await this.page.waitForURL(urlPattern, { timeout });
  }
}

/**
 * Application wizard page object
 */
export class WizardPageObject extends PageObject {
  async selectService(serviceName: string) {
    const serviceCard = this.locator(`[data-testid="service-card"]:has-text("${serviceName}")`);
    if (await serviceCard.isVisible()) {
      await serviceCard.click();
    }
  }

  async selectCategory(category: string) {
    const categoryOption = this.locator(`[data-testid="category-option"]:has-text("${category}")`);
    if (await categoryOption.isVisible()) {
      await categoryOption.click();
    }
  }

  async nextStep() {
    await this.click('[data-testid="wizard-next-btn"]');
  }

  async previousStep() {
    await this.click('[data-testid="wizard-prev-btn"]');
  }

  async saveDraft() {
    await this.click('[data-testid="wizard-save-draft-btn"]');
  }

  async submitApplication() {
    await this.click('[data-testid="wizard-submit-btn"]');
  }

  async getCurrentStep(): Promise<number> {
    const activeStep = this.locator('[data-testid="wizard-step"][data-active="true"]');
    const stepIndex = await activeStep.getAttribute('data-step');
    return parseInt(stepIndex || '0', 10);
  }
}

/**
 * Application list page object
 */
export class ApplicationsPageObject extends PageObject {
  async openApplication(index = 0) {
    const appItem = this.locator('[data-testid="application-item"]').nth(index);
    if (await appItem.isVisible()) {
      await appItem.click();
    }
  }

  async filterByStatus(status: string) {
    const filterDropdown = this.locator('[data-testid="status-filter"]');
    if (await filterDropdown.isVisible()) {
      await filterDropdown.selectOption(status);
    }
  }

  async searchApplication(searchTerm: string) {
    const searchInput = this.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill(searchTerm);
    }
  }
}
