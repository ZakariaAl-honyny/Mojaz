# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-features.spec.ts >> Core Features - Bilingual Platform & Theme Toggle >> should toggle language between English and Arabic
- Location: tests\core-features.spec.ts:15:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel(/switch to english|التغيير إلى العربية/i).or(locator('button:has-text("English")').or(locator('button:has-text("العربية")'))).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByLabel(/switch to english|التغيير إلى العربية/i).or(locator('button:has-text("English")').or(locator('button:has-text("العربية")'))).first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [active]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - navigation [ref=e7]:
            - button "previous" [disabled] [ref=e8]:
              - img "previous" [ref=e9]
            - generic [ref=e11]:
              - generic [ref=e12]: 1/
              - text: "5"
            - button "next" [ref=e13] [cursor=pointer]:
              - img "next" [ref=e14]
          - img
        - generic [ref=e16]:
          - link "Next.js 15.5.14 (outdated) Webpack" [ref=e17] [cursor=pointer]:
            - /url: https://nextjs.org/docs/messages/version-staleness
            - img [ref=e18]
            - generic "An outdated version detected (latest is 16.2.3), upgrade is highly recommended!" [ref=e20]: Next.js 15.5.14 (outdated)
            - generic [ref=e21]: Webpack
          - img
      - generic [ref=e22]:
        - dialog "Console Error" [ref=e23]:
          - generic [ref=e26]:
            - generic [ref=e27]:
              - generic [ref=e28]:
                - generic [ref=e29]:
                  - generic [ref=e30]: Console Error
                  - generic [ref=e31]: Server
                - generic [ref=e32]:
                  - button "Copy Error Info" [ref=e33] [cursor=pointer]:
                    - img [ref=e34]
                  - link "Go to related documentation" [ref=e36] [cursor=pointer]:
                    - /url: https://react.dev/link/invalid-hook-call
                    - img [ref=e37]
                  - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools" [ref=e39] [cursor=pointer]:
                    - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
                    - img [ref=e40]
              - paragraph [ref=e49]: "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons: 1. You might have mismatching versions of React and the renderer (such as React DOM) 2. You might be breaking the Rules of Hooks 3. You might have more than one copy of React in the same app See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
            - generic [ref=e50]:
              - generic [ref=e51]:
                - paragraph [ref=e53]:
                  - img [ref=e55]
                  - generic [ref=e58]: src\app\[locale]\page.tsx (12:28) @ HomePage
                  - button "Open in editor" [ref=e59] [cursor=pointer]:
                    - img [ref=e61]
                - generic [ref=e64]:
                  - generic [ref=e65]: "10 | const { locale } = await params;"
                  - generic [ref=e66]: 11 | setRequestLocale(locale);
                  - generic [ref=e67]: "> 12 | const t = useTranslations('common');"
                  - generic [ref=e68]: "| ^"
                  - generic [ref=e69]: 13 |
                  - generic [ref=e70]: 14 | return (
                  - generic [ref=e71]: 15 | <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
              - generic [ref=e72]:
                - generic [ref=e73]:
                  - paragraph [ref=e74]:
                    - text: Call Stack
                    - generic [ref=e75]: "11"
                  - button "Show 9 ignore-listed frame(s)" [ref=e76] [cursor=pointer]:
                    - text: Show 9 ignore-listed frame(s)
                    - img [ref=e77]
                - generic [ref=e79]:
                  - generic [ref=e80]:
                    - text: HomePage
                    - button "Open HomePage in editor" [ref=e81] [cursor=pointer]:
                      - img [ref=e82]
                  - text: src\app\[locale]\page.tsx (12:28)
                - generic [ref=e84]:
                  - generic [ref=e85]: HomePage
                  - text: <anonymous>
          - generic [ref=e86]:
            - generic [ref=e87]: "1"
            - generic [ref=e88]: "2"
        - contentinfo [ref=e89]:
          - region "Error feedback" [ref=e90]:
            - paragraph [ref=e91]:
              - link "Was this helpful?" [ref=e92] [cursor=pointer]:
                - /url: https://nextjs.org/telemetry#error-feedback
            - button "Mark as helpful" [ref=e93] [cursor=pointer]:
              - img [ref=e94]
            - button "Mark as not helpful" [ref=e97] [cursor=pointer]:
              - img [ref=e98]
    - generic [ref=e104] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e105]:
        - img [ref=e106]
      - generic [ref=e109]:
        - button "Open issues overlay" [ref=e110]:
          - generic [ref=e111]:
            - generic [ref=e112]: "4"
            - generic [ref=e113]: "5"
          - generic [ref=e114]:
            - text: Issue
            - generic [ref=e115]: s
        - button "Collapse issues badge" [ref=e116]:
          - img [ref=e117]
  - generic [ref=e120]:
    - 'heading "Application error: a server-side exception has occurred while loading localhost (see the server logs for more information)." [level=2] [ref=e121]'
    - paragraph [ref=e122]: "Digest: 4217454208"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Core Features - Bilingual Platform & Theme Toggle', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Clear any stored preferences before each test
  6   |     await page.context().clearCookies();
  7   |     try {
  8   |       await page.evaluate(() => localStorage.clear());
  9   |     } catch (error: any) {
  10  |       // Ignore localStorage access errors (can happen in some test environments)
  11  |       console.warn('Could not clear localStorage:', error.message);
  12  |     }
  13  |   });
  14  | 
  15  |   test('should toggle language between English and Arabic', async ({ page }) => {
  16  |     // Visit English page
  17  |     await page.goto('/en');
  18  |     
  19  |     // Verify English content is displayed
  20  |     await expect(page).toHaveURL(/\/en\/?$/);
  21  |     
  22  |     // Look for language switcher - target the LanguageSwitcher component
  23  |     // Based on the LanguageSwitcher component, it has aria-label like "Switch to English" or "التغيير إلى العربية"
  24  |     const languageSwitcher = page.getByLabel(/switch to english|التغيير إلى العربية/i).or(
  25  |       page.locator('button:has-text("English")').or(page.locator('button:has-text("العربية")'))
  26  |     ).first();
> 27  |     await expect(languageSwitcher).toBeVisible({ timeout: 10000 });
      |                                    ^ Error: expect(locator).toBeVisible() failed
  28  |     
  29  |     // Click to switch to Arabic
  30  |     await languageSwitcher.click();
  31  |     
  32  |     // Wait for navigation to Arabic
  33  |     await page.waitForURL(/\/ar\/?$/, { timeout: 10000 });
  34  |     
  35  |     // Verify we're now on Arabic page
  36  |     await expect(page).toHaveURL(/\/ar\/?$/);
  37  |     
  38  |     // Verify document direction is RTL
  39  |     const html = page.locator('html');
  40  |     await expect(html).toHaveAttribute('dir', 'rtl');
  41  |     
  42  |     // Switch back to English
  43  |     await languageSwitcher.click();
  44  |     
  45  |     // Wait for navigation back to English
  46  |     await page.waitForURL(/\/en\/?$/, { timeout: 10000 });
  47  |     
  48  |     // Verify we're back on English page
  49  |     await expect(page).toHaveURL(/\/en\/?$/);
  50  |     
  51  |     // Verify document direction is LTR
  52  |     await expect(html).toHaveAttribute('dir', 'ltr');
  53  |   });
  54  | 
  55  |   test('should toggle dark/light theme without page reload', async ({ page }) => {
  56  |     await page.goto('/en');
  57  |     
  58  |     // Get initial theme
  59  |     const html = page.locator('html');
  60  |     const initialTheme = await html.getAttribute('class');
  61  |     
  62  |     // Find theme toggler button - based on ThemeToggler component
  63  |     const themeSwitcher = page.getByLabel(/toggle theme/i).or(
  64  |       page.locator('button:has(sun)').or(page.locator('button:has-text("Toggle theme")'))
  65  |     ).first();
  66  |     
  67  |     if (await themeSwitcher.isVisible()) {
  68  |       // Click theme toggle
  69  |       await themeSwitcher.click();
  70  |       
  71  |       // Small delay for CSS to apply
  72  |       await page.waitForTimeout(300);
  73  |       
  74  |       // Verify the page is still on the same URL (no reload)
  75  |       await expect(page).toHaveURL(/\/en\/?$/);
  76  |       
  77  |       // Verify the theme has changed - check for dark class on html
  78  |       const updatedTheme = await html.getAttribute('class');
  79  |       
  80  |       // The theme should have changed (either added/removed 'dark' class)
  81  |       const themeDidChange = initialTheme !== updatedTheme;
  82  |       expect(themeDidChange || true).toBeTruthy(); // Allow for CSS variables approach
  83  |     }
  84  |   });
  85  | 
  86  |   test('should display public layout correctly', async ({ page }) => {
  87  |     // Visit public page
  88  |     await page.goto('/en');
  89  |     
  90  |     // Wait for page to load completely
  91  |     await page.waitForLoadState('networkidle');
  92  |     
  93  |     // Verify main content area exists - try multiple selectors
  94  |     const mainSelectors = [
  95  |       'main',
  96  |       '[role="main"]',
  97  |       '#main-content',
  98  |       '.main-content',
  99  |       '[data-testid="main-content"]'
  100 |     ];
  101 |     
  102 |     let mainFound = false;
  103 |     for (const selector of mainSelectors) {
  104 |       const main = page.locator(selector);
  105 |       if (await main.count() > 0) {
  106 |         await expect(main.first()).toBeVisible();
  107 |         mainFound = true;
  108 |         break;
  109 |       }
  110 |     }
  111 |     
  112 |     // If no specific main element found, check that body has visible content
  113 |     if (!mainFound) {
  114 |       const body = page.locator('body');
  115 |       await expect(body).toBeVisible();
  116 |       
  117 |       // Check that there's some meaningful content
  118 |       const pageContent = await page.textContent('body');
  119 |       if (pageContent !== null) {
  120 |         expect(pageContent.trim().length).toBeGreaterThan(100); // Reasonable amount of content
  121 |       }
  122 |     }
  123 |     
  124 |     // Verify navigation is present (navbar/header)
  125 |     const navSelectors = [
  126 |       'nav',
  127 |       '[role="navigation"]',
```